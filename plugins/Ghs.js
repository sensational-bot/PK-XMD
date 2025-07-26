const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const { getBuffer } = require('../lib/functions');
const config = require('../config');

cmd({
  pattern: "ig",
  alias: ["instagram", "insta"],
  desc: "Download Instagram video or image",
  category: "Download",
  use: "<instagram url>",
  filename: __filename,
}, async (message, match, m) => {
  try {
    const url = match || '';
    if (!url.includes("instagram.com")) {
      return message.reply("*🚫 Please provide a valid Instagram link!*");
    }

    const apiUrl = `https://insta-dl.hazex.workers.dev/?url=${encodeURIComponent(url)}`;
    const res = await axios.get(apiUrl);

    if (!res.data || !res.data.url) {
      return message.reply("*❌ Failed to fetch media. Try another link.*");
    }

    const mediaUrl = res.data.url;
    const buffer = await getBuffer(mediaUrl);

    await message.sendMessage(m.chat, {
      video: buffer,
      caption: `*✅ Instagram Media Fetched Successfully!*`,
      mimetype: 'video/mp4',
      contextInfo: {
        externalAdReply: {
          title: "Instagram Downloader",
          body: "Powered by Pkdriller",
          thumbnailUrl: "https://i.imgur.com/N7rHj3f.jpg",
          mediaType: 2,
          mediaUrl: url,
          sourceUrl: config.CHANNEL, // Your channel or any URL
          renderLargerThumbnail: true,
          showAdAttribution: true
        },
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363025344500658@newsletter",
          newsletterName: "Instagram Media • PK-XMD",
          serverMessageId: "72"
        },
        quotedMessage: {
          contactMessage: {
            displayName: "Instagram",
            vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Instagram Verified\nORG:WhatsApp Inc.\nTEL;type=CELL;type=VOICE;waid=14152222222:+1 415-222-2222\nEND:VCARD`,
          }
        }
      }
    }, { quoted: m });
  } catch (e) {
    console.error(e);
    message.reply("*❌ An error occurred while fetching media.*");
  }
});
        
