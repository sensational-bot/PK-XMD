const { cmd } = require('../command');
const config = require('../config');
const moment = require('moment-timezone');

cmd({
  pattern: "ginfo",
  alias: ["groupinfo", "pkinfo"],
  desc: "Displays full group information including members and roles.",
  category: "group",
  use: '.ginfo',
  filename: __filename
}, async (conn, m, text, { groupMetadata, participants, isBotAdmin, isAdmin, isGroup, sender, from, args, prefix, pushName, quoted, mime, body }) => {
  try {
    if (!isGroup) return m.reply("*❌ This command is only for group chats.*");

    const group = groupMetadata || await conn.groupMetadata(from);
    const ownerId = group.owner ? group.owner : group.participants.find(p => p.admin === 'superadmin')?.id;
    const groupAdmins = group.participants.filter(p => p.admin);
    const creationTime = moment(group.creation * 1000).tz('Africa/Nairobi').format('MMMM Do YYYY, h:mm:ss A');
    const ppUrl = await conn.profilePictureUrl(from, 'image').catch(() => config.img);

    // Format participants
    const membersFormatted = group.participants.map(p => {
      const num = p.id.split('@')[0];
      const role = p.admin === 'admin' ? '🛡️ Admin' : p.admin === 'superadmin' ? '👑 Owner' : '👤 Member';
      return `• wa.me/${num} – ${role}`;
    }).join('\n');

    let caption = `┏━━━━━━━⊷\n`;
    caption += `┃  *📛 Group Info*\n`;
    caption += `┗━━━━━━━⊷\n\n`;
    caption += `👥 *Name:* ${group.subject}\n`;
    caption += `🔐 *ID:* ${from}\n`;
    caption += `📝 *Desc:* ${group.desc?.toString().split('\n')[0] || 'Not available'}\n`;
    caption += `👑 *Owner:* wa.me/${ownerId?.split('@')[0] || 'N/A'}\n`;
    caption += `👤 *Members:* ${group.participants.length}\n`;
    caption += `📅 *Created:* ${creationTime}\n`;
    caption += `\n╭─── *👨‍👩‍👧‍👦 Group Members:*\n`;
    caption += membersFormatted;
    caption += `\n╰─────────────⧼⧽`;

    await conn.sendMessage(from, {
      image: { url: ppUrl },
      caption: caption,
      mentions: group.participants.map(v => v.id),
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "Group Info Tool • PK-XMD",
          body: "Powered by Pkdriller",
          thumbnailUrl: ppUrl,
          mediaType: 1,
          previewType: "PHOTO",
          sourceUrl: "https://whatsapp.com/channel/0029Vad7YNyJuyA77CtIPX0x",
          renderLargerThumbnail: false
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
    return m.reply("*❌ Error while fetching group info. Make sure I'm an admin and try again.*");
  }
});
