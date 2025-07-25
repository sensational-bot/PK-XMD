const { cmd } = require('../command');
const fs = require('fs');

const menuImage = 'https://files.catbox.moe/fgiecg.jpg'; // your menu image

// Local riddles & answers
const riddles = [
  { q: "What has keys but can't open locks?", a: "A piano" },
  { q: "What gets wetter the more it dries?", a: "A towel" },
  { q: "I speak without a mouth and hear without ears. What am I?", a: "An echo" },
  { q: "What can travel around the world while staying in the same corner?", a: "A stamp" },
  { q: "The more of me you take, the more you leave behind. What am I?", a: "Footsteps" }
];

// Scramble game words
const scrambleWords = [
  "computer", "javascript", "whatsapp", "keyboard", "internet", "variable", "function", "github"
];

// Function to shuffle letters
function scramble(word) {
  return word.split('').sort(() => 0.5 - Math.random()).join('');
}

// Fake verified contact vCard
const fakeContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "WHATSAPP VERIFIED ✅",
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:WhatsApp User\nORG:Meta Verified Contact;\nTEL;type=CELL;type=VOICE;waid=1234567890:+1 234 567 890\nEND:VCARD`
    }
  }
};

// ─── RIDDLE ─────────────────────────────
cmd({
  pattern: "riddle",
  desc: "Send a random riddle",
  category: "games",
  filename: __filename
}, async (conn, m) => {
  const riddle = riddles[Math.floor(Math.random() * riddles.length)];
  await conn.sendMessage(m.chat, {
    image: { url: menuImage },
    caption: `🎯 *RIDDLE TIME!*\n\n❓ *${riddle.q}*\n\n🧠 Reply with your guess!`,
    contextInfo: {
      externalAdReply: {
        title: "PK-XMD GAMES 🎮",
        body: "Riddle Game",
        thumbnailUrl: menuImage,
        sourceUrl: "https://whatsapp.com/channel/0029VaK6LeW3Rp22D77DmJ0v",
        mediaType: 1,
        renderLargerThumbnail: false,
        showAdAttribution: true
      },
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363191736272380@newsletter",
        newsletterName: "PK-XMD UPDATES",
        serverMessageId: ""
      }
    },
    quoted: fakeContact
  });
});

// ─── UNSCRAMBLE ─────────────────────────────
cmd({
  pattern: "unscramble",
  desc: "Unscramble the word game",
  category: "games",
  filename: __filename
}, async (conn, m) => {
  const word = scrambleWords[Math.floor(Math.random() * scrambleWords.length)];
  const scrambled = scramble(word);
  await conn.sendMessage(m.chat, {
    image: { url: menuImage },
    caption: `🔤 *UNSCRAMBLE CHALLENGE!*\n\n🧩 *${scrambled}*\n\n💬 Guess the original word!`,
    contextInfo: {
      externalAdReply: {
        title: "PK-XMD GAMES 🎮",
        body: "Unscramble Game",
        thumbnailUrl: menuImage,
        sourceUrl: "https://whatsapp.com/channel/0029VaK6LeW3Rp22D77DmJ0v",
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: true
      },
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363191736272380@newsletter",
        newsletterName: "PK-XMD UPDATES",
        serverMessageId: ""
      }
    },
    quoted: fakeContact
  });
});
