const { cmd } = require('../command');
const config = require('../config');

cmd({
  pattern: "hack",
  desc: "Fake hack someone just for fun",
  category: "fun",
  use: "<@user | number | name>",
  react: "👨‍💻",
  filename: __filename
}, async (conn, mek, m, { from, args, reply, participants }) => {
  const target = args.join(" ") || m.quoted?.sender || "";
  if (!target) return reply("👤 *Tag or enter a target name/number to hack.*\nExample: `.hack @username`");

  const contextInfo = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363288304618280@newsletter',
      newsletterName: 'PK-XMD',
      serverMessageId: 143
    }
  };

  const fakeHackSteps = [
    `🧠 Connecting to WhatsApp servers...`,
    `💻 Target Found: ${target}`,
    `🔍 Retrieving IP address...`,
    `📲 Accessing chats...`,
    `📂 Downloading media files...`,
    `🔓 Cracking password...`,
    `📡 Injecting backdoor...`,
    `💥 Target ${target} has been hacked successfully!`
  ];

  for (let step of fakeHackSteps) {
    await conn.sendMessage(from, { text: step, contextInfo }, { quoted: mek });
    await new Promise(r => setTimeout(r, 1000));
  }

  const fakeData = `
🛠️ *Target Info:*
👤 User: ${target}
📱 Phone: +2547${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}
🔑 Password: *pK_xMd_H4cK3r*
💌 Last message: *"Please don’t hack me 😭"*

😂 *Just kidding! You’ve been pranked by PK-XMD™*
  `;

  await conn.sendMessage(from, { text: fakeData, contextInfo }, { quoted: mek });
});
