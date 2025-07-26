const { cmd } = require('../command');
const { getBuffer } = require('../lib/functions');
const moment = require('moment-timezone');

cmd({
  pattern: "groupinfo",
  alias: ["ginfo"],
  desc: "Show detailed group info",
  category: "group",
  react: "📊",
  filename: __filename
}, async (conn, m, store, { from, reply, isBotAdmin }) => {
  try {
    if (!m.isGroup) return reply("❌ This command can only be used in groups.");

    const metadata = await conn.groupMetadata(from);
    const groupName = metadata.subject;
    const owner = metadata.owner ? `@${metadata.owner.split("@")[0]}` : "Not found";
    const members = metadata.participants.length;
    const admins = metadata.participants.filter(p => p.admin).map(p => `@${p.id.split("@")[0]}`);
    const creation = moment(metadata.creation * 1000).tz('Africa/Nairobi').format('DD/MM/YYYY - HH:mm');
    const description = metadata.desc?.toString().substring(0, 250) || "No description";
    let groupInvite = "Bot is not admin";

    if (isBotAdmin) {
      const code = await conn.groupInviteCode(from);
      groupInvite = `https://chat.whatsapp.com/${code}`;
    }

    const thumb = await getBuffer(metadata?.pictureUrl || "https://i.imgur.com/r7qY8.jpg");

    const msg = `╭──────〔 *GROUP INFO* 〕──────⭓
┃ 🏷️ *Name:* ${groupName}
┃ 👑 *Owner:* ${owner}
┃ 👥 *Members:* ${members}
┃ 🛡️ *Admins:* ${admins.length}
┃ 📝 *Description:* ${description}
┃ 🕒 *Created On:* ${creation}
┃ 🔗 *Invite Link:* ${groupInvite}
╰───────────────⭓\n\n_Powered by Pkdriller • PK-XMD_`;

    await conn.sendMessage(from, {
      image: thumb,
      caption: msg,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "PK-XMD Group Tools",
          body: "Verified by PKDRILLER",
          thumbnail: thumb,
          mediaType: 1,
          previewType: "PHOTO",
          renderLargerThumbnail: true,
          sourceUrl: "https://whatsapp.com/channel/0029VaGH2Mb6WaEPLxDfCf3N"
        },
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363217912684876@newsletter",
          newsletterName: "PK-XMD Channel",
          serverMessageId: "100"
        }
      }
    }, { quoted: {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
      },
      message: {
        contactMessage: {
          displayName: "WhatsApp",
          vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:WhatsApp\nORG:WhatsApp\nTEL;type=CELL;type=VOICE;waid=14155238886:+1 415-523-8886\nEND:VCARD"
        }
      }
    }});
    
  } catch (e) {
    console.error(e);
    reply("❌ Failed to fetch group info.");
  }
});
