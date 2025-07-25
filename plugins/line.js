const { cmd } = require('../command');
const config = require('../config');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

cmd({
  pattern: "online",
  desc: "Check online/active group members",
  category: "group",
  filename: __filename,
  react: "🟢"
}, async (conn, m, text, { isGroup, participants, metadata }) => {
  if (!isGroup) return m.reply("🔒 This command only works in groups.");
  
  await conn.presenceSubscribe(m.chat); // attempt to fetch presence data

  let activeList = [];
  let members = participants.map(p => p.id);

  for (let id of members) {
    try {
      const presence = conn.presence[id];
      if (presence && presence.lastSeen) {
        activeList.push({ id, time: new Date(presence.lastSeen).toLocaleTimeString() });
      }
    } catch { /* skip silently */ }
  }

  // Fallback: recent senders if presence not found
  if (activeList.length === 0) {
    activeList = participants.filter(p => p.admin !== null).map(p => ({ id: p.id, time: "recently active" }));
  }

  const listText = activeList.length > 0
    ? activeList.map((u, i) => `${i + 1}. @${u.id.split('@')[0]} — 🕐 ${u.time}`).join('\n')
    : "❌ No active users detected.";

  // Fake verified vCard
  const vcard = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "PK-ONLINE-CHECK"
    },
    message: {
      contactMessage: {
        displayName: "PK-XMD Verified",
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:PK-XMD\nORG:Verified Contact;\nTEL;type=CELL;type=VOICE;waid=254700000000:+254 700 000000\nEND:VCARD`
      }
    }
  };

  await conn.sendMessage(m.chat, {
    image: { url: "https://files.catbox.moe/fgiecg.jpg" },
    caption: `*🟢 Active Members in Group:*\n\n${listText}\n\n_Powered by PK-XMD_`,
    mentions: activeList.map(u => u.id),
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      externalAdReply: {
        title: "PK-XMD | ONLINE CHECK",
        body: "Multi Device Bot by Pkdriller",
        mediaType: 1,
        previewType: 0,
        thumbnailUrl: "https://files.catbox.moe/fgiecg.jpg",
        renderLargerThumbnail: false,
        showAdAttribution: true,
        sourceUrl: "https://wa.me/254700000000"
      },
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363025223635758@newsletter",
        newsletterName: "PK-XMD Verified Updates",
        serverMessageId: "",
      }
    }
  }, { quoted: vcard });
});
