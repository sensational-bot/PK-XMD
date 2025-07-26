const { cmd } = require('../command');
const axios = require("axios");
const { getBuffer } = require("../lib/functions");

cmd({
  pattern: "ig",
  alias: ["insta", "instagram"],
  desc: "Download Instagram videos or reels",
  react: "🎥",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.includes("instagram.com")) {
      return reply("❌ *Please provide a valid Instagram link.*");
    }

    await conn.sendMessage(from, {
      react: { text: "📥", key: m.key }
    });

    const res = await axios.get(`https://api.smdownloader.net/ig?url=${encodeURIComponent(q)}`);
    const data = res.data;

    if (!data || !data.url || data.url.length === 0) {
      return reply("⚠️ *Failed to fetch Instagram video.*");
    }

    const videoUrl = data.url[0]; // First result
    const buffer = await getBuffer(videoUrl);

    await conn.sendMessage(from, {
      video: buffer,
      mimetype: "video/mp4",
      caption: "✅ *Instagram Video Downloaded!*"
    }, { quoted: m });

  } catch (err) {
    console.log(err);
    reply("❌ *An error occurred while processing your request.*");
  }
});
      
