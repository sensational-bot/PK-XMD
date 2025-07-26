const { cmd } = require('../command');
const { fetchJson, getGroupAdmins } = require('../lib/functions');

cmd({
  pattern: "ginfo",
  alias: ["groupinfo", "pkinfo"],
  desc: "Show group information",
  category: "group",
  use: '<optional>',
  filename: __filename
}, async (conn, m, text, { args, prefix, command }) => {
  try {
    const groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : {};
    const groupName = groupMetadata.subject || "N/A";
    const groupDesc = groupMetadata.desc || "No Description";
    const participants = groupMetadata.participants || [];
    const groupAdmins = getGroupAdmins(participants);
    const owner = groupMetadata.owner ? groupMetadata.owner.split("@")[0] : "Unknown";
    const ppUrl = await conn.profilePictureUrl(m.chat, 'image').catch(_ => "https://i.ibb.co/2t2pF9y/default.jpg");

    const gdata = `╭━━━〈  *PK-XMD GROUP INFO*  〉━━━╮
┃ 🏷️ *Name:* ${groupName}
┃ 🧩 *ID:* ${m.chat}
┃ 👥 *Members:* ${participants.length}
┃ 👮 *Admins:* ${groupAdmins.length}
┃ 👑 *Owner:* @${owner}
┃ 🗒️ *Desc:* 
┃ ${groupDesc}
╰━━━━━━━━━━━━━━━━━━━━━━╯`;

    await conn.sendMessage(m.chat, {
      image: { url: ppUrl },
      caption: gdata,
      mentions: groupAdmins.map(v => v.id).concat([owner]),
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "Group Info Tool • PK-XMD",
          body: "Powered by Pkdriller",
          thumbnailUrl: ppUrl,
          mediaType: 1,
          previewType: "PHOTO",
          renderLargerThumbnail: false,
          sourceUrl: "https://whatsapp.com/channel/0029Vad7YNyJuyA77CtIPX0x"
        },
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          newsletterName: "PK-XMD Channel",
          serverMessageId: "100"
        }
      }
    }, { quoted: m });
  } catch (e) {
    console.error(e);
    return m.reply("❌ Failed to fetch group info.");
  }
});
          
