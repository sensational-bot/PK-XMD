const { cmd } = require('../command')
const config = require('../config')
const moment = require('moment-timezone')
const fs = require('fs')

cmd({
  pattern: "gnfo|pkinfo",
  desc: "Group information with member details",
  category: "group",
  use: '.ginfo',
  filename: __filename
}, async(conn, m, { isAdmin, isBotAdmin, groupMetadata, participants, args, text, prefix, command }) => {
  if (!m.isGroup) return m.reply("This command can only be used in groups!")

  let groupInfo = groupMetadata
  let owner = groupInfo.owner ? groupInfo.owner.split("@")[0] : "Unknown"
  let groupAdmins = participants.filter(p => p.admin)
  let adminJids = groupAdmins.map(p => p.id)
  let memberList = participants.map((p, i) => {
    const role = p.admin ? '👑 Admin' : '👤 Member'
    const number = p.id.split('@')[0]
    return `${i + 1}. wa.me/${number} — ${role}`
  }).join("\n")

  let groupCreation = groupInfo.creation ? moment(groupInfo.creation * 1000).tz(config.TIME_ZONE).format('dddd, MMMM Do YYYY (h:mm:ss A)') : 'Unknown'

  let caption = `╭────[ *📛 GROUP INFO* ]──◇
│🌐 *Name:* ${groupInfo.subject}
│🆔 *ID:* ${groupInfo.id}
│👑 *Owner:* wa.me/${owner}
│👥 *Members:* ${participants.length}
│🛡️ *Admins:* ${groupAdmins.length}
│📆 *Created On:* ${groupCreation}
│💬 *Desc:* ${groupInfo.desc ? groupInfo.desc : "No description"}
╰────◇

╭───[ 👤 *GROUP PARTICIPANTS* ]──◇
${memberList}
╰────◇

©️ *PK-XMD Engine*\n*Powered by Pkdriller*`

  let ppUrl = 'https://files.catbox.moe/fgiecg.jpg'
  try {
    ppUrl = await conn.profilePictureUrl(m.chat, 'image')
  } catch {}

  await conn.sendMessage(m.chat, {
    image: { url: ppUrl },
    caption,
    mentions: participants.map(p => p.id),
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      externalAdReply: {
        title: "Group Info • PK-XMD",
        body: "Tap to join our official channel",
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
  }, { quoted: m })
})
