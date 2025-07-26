const config = require('../config')
const { cmd } = require('../command')
const { getBuffer } = require('../lib/functions')

cmd({
  pattern: "pkinfo",
  react: "♻️",
  alias: ["groupinfo"],
  desc: "Get group information.",
  category: "group",
  use: '.ginfo',
  filename: __filename
}, async (conn, mek, m, {
  from, isGroup, isAdmins, isDev, isBotAdmins,
  reply, participants
}) => {
  try {
    if (!isGroup) return reply(`❌ This command only works in group chats.`);
    if (!isAdmins && !isDev) return reply(`⛔ Only *Group Admins* or *Bot Dev* can use this.`);
    if (!isBotAdmins) return reply(`❌ I need *admin* rights to fetch group details.`);

    const fallbackPpUrls = [
      'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
      'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png'
    ];
    let ppUrl;
    try {
      ppUrl = await conn.profilePictureUrl(from, 'image');
    } catch {
      ppUrl = fallbackPpUrls[Math.floor(Math.random() * fallbackPpUrls.length)];
    }

    const metadata = await conn.groupMetadata(from);
    const groupAdmins = participants.filter(p => p.admin);
    const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');
    const owner = metadata.owner || groupAdmins[0]?.id || "unknown";

    const gdata = `╭─❏ *GROUP INFORMATION*\n│\n│ 📛 *Name:* ${metadata.subject}\n│ 🆔 *ID:* ${metadata.id}\n│ 👥 *Members:* ${metadata.size}\n│ 👑 *Creator:* @${owner.split('@')[0]}\n│ 📝 *Description:* ${metadata.desc || 'No description'}\n│\n│ 🛡️ *Admins (${groupAdmins.length}):*\n│ ${listAdmin.replace(/\n/g, '\n│ ')}\n╰─────────────⭓\n\n_Powered by Pkdriller • PK-XMD_`;

    await conn.sendMessage(from, {
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
          renderLargerThumbnail: true,
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
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    reply(`❌ An error occurred:\n\n${e}`);
  }
});
