const { cmd } = require('../command');
const axios = require("axios");
const { getRandom } = require("../lib/functions");

cmd({
  pattern: "ig",
  alias: ["insta", "instagram"],
  desc: "Download Instagram videos.",
  category: "download",
  react: "📥",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.startsWith("http")) {
      return reply("❌ Please provide a valid Instagram post/reel URL.");
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    let videoUrl;

    // 1. Try DavidCyrilTech API
    try {
      const res1 = await axios.get(`https://api.davidcyriltech.my.id/instagram?url=${q}`);
      if (res1.data?.status == 200 && res1.data?.downloadUrl) {
        videoUrl = res1.data.downloadUrl;
      }
    } catch (e) {
      console.log("❌ DavidCyrilTech API failed.");
    }

    // 2. Try Ruhend Scraper
    if (!videoUrl) {
      try {
        const res2 = await axios.get(`https://api.ruhend.my.id/igdl2?url=${q}`);
        if (res2.data?.status && res2.data?.data?.url) {
          videoUrl = res2.data.data.url;
        }
      } catch (e) {
        console.log("❌ Ruhend Scraper failed.");
      }
    }

    // 3. Try SaveInsta unofficial API (scraped)
    if (!videoUrl) {
      try {
        const res3 = await axios.get(`https://saveinsta.vercel.app/api?url=${q}`);
        if (res3.data?.status && res3.data?.media?.length > 0) {
          videoUrl = res3.data.media[0];
        }
      } catch (e) {
        console.log("❌ SaveInsta API failed.");
      }
    }

    if (!videoUrl) {
      return reply("⚠️ Failed to download Instagram video from all sources.");
    }

    await conn.sendMessage(from, {
      video: { url: videoUrl },
      mimetype: "video/mp4",
      caption: "✅ *Instagram video downloaded successfully!*"
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    reply("❌ An unexpected error occurred.");
  }
});
