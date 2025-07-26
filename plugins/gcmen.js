const { cmd } = require('../command')
const config = require('../config')

let antimention = {}

cmd({
  pattern: "antimention",
  desc: "Anti-Mention system",
  category: "Group",
  filename: __filename,
  use: "<on/off>",
  react: "🚫",
  fromMe: true
}, async (m, match, conn) => {
  if (!m.isGroup) return m.reply("*❗ This command only works in groups*")
  if (!match) return m.reply("*Usage: .antimention on / off*")

  if (match !== "on" && match !== "off") return m.reply("*❗ Use only 'on' or 'off'*")

  antimention[m.chat] = match === "on"
  await m.reply(`*✅ Anti-Mention is now ${match.toUpperCase()}*`)
})

cmd({
  on: "message",
  fromMe: false
}, async (m, conn) => {
  try {
    if (!m.isGroup) return
    if (!antimention[m.chat]) return

    const mentionText = (m.body || "").toLowerCase()
    const triggers = [
      "mentioned you in their status",
      "amekutaja kwenye hali yake",
      "has mentioned you in their status"
    ]

    if (triggers.some(txt => mentionText.includes(txt))) {
      // Delete message
      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant
        }
      })

      // Get group metadata
      const metadata = await conn.groupMetadata(m.chat)
      const admins = metadata.participants.filter(p => p.admin).map(p => p.id)
      const isAdmin = admins.includes(m.sender)

      if (!isAdmin) {
        await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove")
        await conn.sendMessage(m.chat, {
          text: `*🚫 Anti-Mention Triggered!*\n@${m.sender.split("@")[0]} was removed for mentioning this group in their status.`,
          mentions: [m.sender]
        })
      }
    }
  } catch (e) {
    console.log("AntiMention Error:", e)
  }
})
        
