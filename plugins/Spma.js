const { cmd } = require('../command');
const config = require('../config');

cmd({
  pattern: "spam",
  desc: "Spam a message multiple times",
  category: "fun",
  use: "<count> <text>",
  filename: __filename
}, async (conn, m, { args, isGroup, isAdmin }) => {
  const count = parseInt(args[0]);
  const text = args.slice(1).join(" ");

  if (!count || isNaN(count) || count > 20) {
    return m.reply("❌ *Enter a valid count (max 20)*\nExample: `.spam 5 Hello`");
  }

  if (!text) return m.reply("❌ *Provide a message to spam*\nExample: `.spam 5 Hello`");

  if (isGroup && !isAdmin) return m.reply("🔐 Only admins can spam in groups.");

  const quotedContact = {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast"
    },
    message: {
      contactMessage: {
        displayName: "PK-XMD",
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:PK-XMD Verified Contact\nORG:PKDRILLER\nTEL;type=CELL;type=VOICE;waid=254700000000:+254 700 000000\nEND:VCARD`
      }
    }
  };

  const contextInfo = {
    externalAdReply: {
      title: "Spam Command by PK-XMD",
      body: config.botname,
      thumbnailUrl: config.LOGO,
      mediaType: 1,
      renderLargerThumbnail: true,
      showAdAttribution: true,
      sourceUrl: config.channel,
    },
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterName: "PK-XMD Official",
      newsletterJid: "120363288304618280@newsletter"
    }
  };

  for (let i = 0; i < count; i++) {
    await conn.sendMessage(m.chat, { text }, { quoted: quotedContact, contextInfo });
    await new Promise(r => setTimeout(r, 500)); // delay between messages
  }
});
          
