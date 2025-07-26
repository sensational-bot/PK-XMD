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
  if (!m.isGroup) return m.reply("*❗This command only works in groups*")
  if (!match) return m.reply("*Usage: .antimention on / off*")
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

    // Detect "You were mentioned in a status" message
    const mentionText = (m.body || "").toLowerCase()
    if (
      mentionText.includes("mentioned you in their status") ||
      mentionText.includes("amekutaja kwenye hali yake") || // Swahili
      mentionText.includes("has mentioned you in their status")
    ) {
      // Delete the message
      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant
        }
      })

      // Check if the sender is an admin
      const metadata = await conn.groupMetadata(m.chat)
      const admins = metadata.participants.filter(p => p.admin).map(p => p.id)
      const isAdmin = admins.includes(m.sender)

      // Kick if not admin
      if (!isAdmin) {
        await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove")
        await conn.sendMessage(m.chat, {
          text: `*🚫 Anti-Mention Triggered!*\n@${m.sender.split("@")[0]} was removed for tagging this group in their status.`,
          mentions: [m.sender]
        })
      }
    }
  } catch (e) {
    console.log("AntiMention Error:", e)
  }
})
