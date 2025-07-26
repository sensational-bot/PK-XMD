const { sendContact } = require('./functions');
const config = require('../config');
const fs = require('fs');

const antiCall = async (conn, callEvent) => {
  try {
    if (!config.ANTICALL) return;

    const { from, isGroup, id, status } = callEvent;

    // Check if it's a call offer (voice or video)
    if (status === 'offer') {
      console.log(`🚨 Call detected from: ${from}`);

      // Reject the call automatically (optional)
      await conn.rejectCall(id, from);

      // Send warning message
      await conn.sendMessage(from, {
        text: `🚫 *Calling the bot is not allowed!*\n\nIf you call again, you will be blocked permanently.`,
        contextInfo: {
          externalAdReply: {
            title: "PK-XMD BOT",
            body: "Protected by Pkdriller",
            mediaType: 1,
            renderLargerThumbnail: true,
            thumbnailUrl: 'https://files.catbox.moe/fgiecg.jpg',
            sourceUrl: "https://wa.me/254794146821"
          }
        }
      });

      // Block user
      await conn.updateBlockStatus(from, 'block');
      console.log(`⛔ Blocked ${from} for calling.`);
    }
  } catch (e) {
    console.error("❌ Anticall error:", e);
  }
};

module.exports = antiCall;
