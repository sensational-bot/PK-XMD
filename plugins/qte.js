const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

cmd({
  pattern: "quote",
  desc: "Get a random inspirational quote",
  category: "fun",
  react: "💬",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const quotedContact = {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
      },
      message: {
        contactMessage: {
          displayName: "PK-XMD",
          vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:PK-XMD Verified\nORG:PKDRILLER\nTEL;type=CELL;type=VOICE;waid=254700000000:+254 700 000000\nEND:VCARD`
        }
      }
    };

    const contextInfo = {
      forwardingScore: 999,
      isForwarded: true,
      mentionedJid: [m.sender],
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363288304618280@newsletter",
        newsletterName: "PK-XMD Official"
      },
      externalAdReply: {
        title: "Quote by PK-XMD",
        body: config.botname,
        thumbnailUrl: config.LOGO,
        renderLargerThumbnail: true,
        mediaType: 1,
        sourceUrl: config.channel
      }
    };

    const res = await axios.get("https://api.quotable.io/random");
    const data = res.data;

    const quoteText = `💭 *"${data.content}"*\n\n— _${data.author}_`;

    await conn.sendMessage(from, { text: quoteText, contextInfo }, { quoted: quotedContact });

  } catch (e) {
    console.error(e);
    reply("❌ Error fetching quote.");
  }
});
        
