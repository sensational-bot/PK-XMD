const config = require('../config')
const { cmd } = require('../command')
const {
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  runtime,
  sleep
} = require('../lib/functions')

cmd({
  pattern: "pkinfo",
  react: "🥏",
  alias: ["groupinfo"],
  desc: "Get group information.",
  category: "group",
  use: '.ginfo',
  filename: __filename
},
async (conn, mek, m, {
  from, quoted, isCmd, isGroup, sender, isBotAdmins,
  isAdmins, isDev, reply, groupMetadata, participants
}) => {
  try {
    if (!isGroup) return reply(`❌ This command only works in group chats.`);
    if (!isBotAdmins) return reply(`❌ I need *admin* rights to fetch group details.`);

    const fallbackPpUrls = [
      'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
      'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
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

    const gdata = `*「 Group Information 」*\n
*Group Name* : ${metadata.subject}
*Group ID* : ${metadata.id}
*Participants* : ${metadata.size}
*Group Creator* : @${owner.split('@')[0]}
*Description* : ${metadata.desc?.toString() || 'No description'}\n
*Admins (${groupAdmins.length})*:\n${listAdmin}`

    await conn.sendMessage(from, {
      image: { url: ppUrl },
      caption: gdata,
      mentions: groupAdmins.map(v => v.id).concat([owner]),
      contextInfo: {
        mentionedJid: groupAdmins.map(v => v.id).concat([owner]),
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "PK-XMD GROUP INFO",
          body: config.botname + " by Pkdriller",
          thumbnailUrl: ppUrl,
          sourceUrl: "https://whatsapp.com/channel/0029Vad7YNyJuyA77CtIPX0x",
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true,
        },
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363288304618280@newsletter',
          newsletterName: config.botname + " News",
          serverMessageId: '100'
        }
      }
    }, {
      quoted: {
        key: {
          fromMe: false,
          participant: `0@s.whatsapp.net`,
          remoteJid: "status@broadcast"
        },
        message: {
          contactMessage: {
            displayName: `WhatsApp Verified`,
            vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;WhatsApp Verified;;;\nFN:WhatsApp Verified\nORG:Meta\nTEL;type=CELL;type=VOICE;waid=447710173736:+44 7710 173736\nEND:VCARD`
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
      
