const { cmd } = require('../command');
const axios = require('axios');
const { getBuffer } = require('../lib/functions');

cmd({
  pattern: "ig",
  alias: ["insta", "instagram"],
  desc: "Download Instagram video using custom API.",
  category: "download",
  react: "📥",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.includes("instagram.com")) return reply("❌ Send a valid Instagram link.");

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    const apiUrl = `https://insta-dl.hazex.workers.dev/?url=${encodeURIComponent(q)}`;
    const res = await axios.get(apiUrl);
    const result = res.data;

    if (!result || !result.urls || !result.urls.length) {
      return reply("⚠️ No media found at that link.");
    }

    const mediaUrl = result.urls[0]; // first media item
    await conn.sendMessage(from, {
      video: { url: mediaUrl },
      caption: `✅ *Instagram video downloaded successfully!*`,
      mimetype: 'video/mp4'
    }, { quoted: m });

  } catch (err) {
    console.log(err);
    reply("❌ Failed to fetch video. Please try another link.");
  }
});
