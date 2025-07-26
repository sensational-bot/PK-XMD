const { cmd } = require('../command');
const config = require("../config");
const { getBuffer, runtime, fetchJson } = require("../lib/functions");
const fs = require("fs");
const moment = require("moment-timezone");

cmd({
  pattern: "pinfo",
  desc: "Show group info",
  category: "group",
  filename: __filename
}, async (conn, m, { isGroup, groupMetadata, participants, admins, groupName, pushName, prefix }) => {
  if (!isGroup) return m.reply("This command only works in groups.");

  try {
    const groupId = m.chat;
    const metadata = await conn.groupMetadata(groupId);
    const ppUrl = await conn.profilePictureUrl(groupId, 'image').catch(() => config.LOGO);
    const owner = metadata.owner ? metadata.owner : metadata.participants.find(p => p.admin === 'superadmin')?.id;

    const groupAdmins = metadata.participants.filter(p => p.admin);
    const members = metadata.participants;

    const creationTime = moment(metadata.creation * 1000).tz("Africa/Nairobi");
    const timeAgo = creationTime.fromNow();

    // Admins List
    const adminList = groupAdmins.map(p => {
      const name = metadata.participants.find(x => x.id === p.id)?.notify || conn.getName(p.id);
      return `• @${p.id.split("@")[0]} (${p.admin === 'superadmin' ? 'Owner' : 'Admin'})`;
    }).join("\n");

    // Members List
    const memberList = members.map(p => {
      const role = p.admin ? (p.admin === 'superadmin' ? "Owner" : "Admin") : "Member";
      return `• @${p.id.split("@")[0]} (${role})`;
    }).join("\n");

    const ginfo = `🌐 *GROUP INFORMATION*

📛 *Name:* ${metadata.subject}
🆔 *ID:* ${metadata.id}
👤 *Owner:* wa.me/${owner.split("@")[0]}
👥 *Members:* ${members.length}
🛡️ *Admins:* ${groupAdmins.length}
📅 *Created On:* ${creationTime.format("DD MMMM YYYY, HH:mm:ss")} (${timeAgo})
📝 *Description:* ${metadata.desc ? metadata.desc : "No description set."}
🔒 *Settings:*
  - Announce: ${metadata.announce ? "✅ Only Admins can send" : "❌ All members can send"}
  - Locked: ${metadata.restrict ? "✅ Only Admins can edit info" : "❌ All members can edit"}

👑 *ADMINS LIST:*
${adminList}

👤 *ALL MEMBERS:*
${memberList}

🔗 *Powered by Pkdriller | PK-XMD Bot*
`;

    await conn.sendMessage(m.chat, {
      image: { url: ppUrl },
      caption: ginfo,
      mentions: participants.map(p => p.id),
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "Group Info • PK-XMD",
          body: "PK-XMD by Pkdriller",
          thumbnailUrl: ppUrl,
          mediaType: 1,
          renderLargerThumbnail: false,
          sourceUrl: "https://whatsapp.com/channel/0029Vad7YNyJuyA77CtIPX0x"
        },
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          newsletterName: "PK-XMD Channel",
          serverMessageId: "100"
        }
      }
    }, {
      quoted: {
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
      }
    });

  } catch (e) {
    console.error(e);
    m.reply("❌ Failed to fetch group info.");
  }
});
        
