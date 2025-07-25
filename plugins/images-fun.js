const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');
const { getBuffer } = require('../lib/functions');

const fakeContact = {
  key: {
    fromMe: false,
    participant: '0@s.whatsapp.net',
    remoteJid: 'status@broadcast'
  },
  message: {
    contactMessage: {
      displayName: 'WhatsApp',
      vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:WhatsApp Verified Contact\nORG:WhatsApp;\nTEL;type=CELL;type=VOICE;waid=254700000000:+254 700 000000\nEND:VCARD'
    }
  }
};

const commands = [
  { pattern: 'waifu', url: 'https://api.waifu.pics/sfw/waifu', emoji: '💫', title: 'Random Waifu Image' },
  { pattern: 'neko', url: 'https://api.waifu.pics/sfw/neko', emoji: '😽', title: 'Random Neko Girl' },
  { pattern: 'maid', url: 'https://api.waifu.pics/sfw/maid', emoji: '🧹', title: 'Random Maid Girl' },
  { pattern: 'megumin', url: 'https://api.waifu.pics/sfw/megumin', emoji: '🎇', title: 'Megumin Explosion' },
  { pattern: 'shinobu', url: 'https://api.waifu.pics/sfw/shinobu', emoji: '🦋', title: 'Shinobu Image' },
  { pattern: 'marin', url: 'https://api.waifu.pics/sfw/marin', emoji: '🎀', title: 'Marin Kitagawa' },
  { pattern: 'miku', url: 'https://api.waifu.pics/sfw/miku', emoji: '🎤', title: 'Miku Image' },
  { pattern: 'zero', url: 'https://api.waifu.pics/sfw/zero_two', emoji: '💗', title: 'Zero Two' },
  { pattern: 'dog', url: 'https://random.dog/woof.json', emoji: '🐶', title: 'Random Dog' }
];

for (const { pattern, url, emoji, title } of commands) {
  cmd({
    pattern,
    react: emoji,
    desc: `Sends ${title.toLowerCase()}.`,
    category: 'anime',
    filename: __filename
  },
  async (conn, mek, m, { from, reply }) => {
    try {
      const res = await axios.get(url);
      const imageUrl = res.data.url || `https://random.dog/${res.data.woof}`;
      const caption = `🎴 ${title}\n\n> © Powered by PK-XMD`;
      await conn.sendMessage(from, {
        image: { url: imageUrl },
        caption,
        contextInfo: {
          quotedMessage: fakeContact.message,
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363040838753617@newsletter',
            newsletterName: 'PK-XMD Official',
            serverMessageId: ''
          }
        }
      }, { quoted: mek });
    } catch (e) {
      reply("I can't fetch the image right now.");
      console.log(e);
    }
  });
}
