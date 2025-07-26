const { cmd } = require('../command');
const config = require('../config');
const { getBuffer, runtime } = require('../lib/functions');
const moment = require('moment-timezone');

cmd({
  pattern: "pkinfo",
  alias: ["groupinfo", "gcinfo"],
  desc: "Group information and members list",
  category: "group",
  use: ".info",
  filename: __filename
}, async (conn, m, text, { isGroup, groupMetadata, participants, groupAdmins }) => {
  if (!isGroup) return m.reply('❌ This command only works in groups.');

  const from = m.chat;
  const sender = m.sender;
  const groupName = groupMetadata.subject;
  const groupDesc = groupMetadata.desc || "No description";
  const groupOwner = groupMetadata.owner ? '@' + groupMetadata.owner.split('@')[0] : "Not Available";

  // Group creation date
  const creationDate = moment(groupMetadata.creation * 1000).tz('Africa/Nairobi').format('DD MMMM YYYY, h:mm A');

  // Admins
  const admins = groupAdmins.map(v => `👑 @${v.split('@')[0]}`);

  // Members categorized
  let membersList = "";
  for (let member of participants) {
    const jid = member.id;
    const isAdmin = groupAdmins.includes(jid);
    const tag = "@" + jid.split('@')[0];
    membersList += `${isAdmin ? '👑ADMIN' : 'MEMBER👤'} ${tag}\n`;
  }

  const groupInfo = `╭━━⬣ GROUP INFO ⬣━━━◆
┃👥 *Group:* ${groupName}
┃📌 *Owner:* ${groupOwner}
┃🕰️ *Created:* ${creationDate}
┃📝 *Description:* 
┃${groupDesc.split("\n").map(l => "┃" + l).join("\n")}
┃👤 *Members:* ${participants.length}
┃🛡️ *Admins:* ${admins.length}
╰━━━━━━━◆

╭━━⬣ MEMBER LIST ⬣━━◆
${membersList}
╰━━━━━━━◆`;

  // Fake verified vCard
  const verifiedContact = {
    key: {
      fromMe: false,
      participant: `0@s.whatsapp.net`,
      remoteJid: "status@broadcast"
    },
    message: {
      contactMessage: {
        displayName: "WhatsApp",
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:WhatsApp\nORG:WhatsApp\nTEL;type=CELL;type=VOICE;waid=447710173736:+44 7710 173736\nEND:VCARD`
      }
    }
  };

  // Context Info
  const contextInfo = {
    forwardingScore: 999,
    isForwarded: true,
    externalAdReply: {
      title: "📢 PK-XMD GROUP INFO",
      body: config.botname + " | Powered by Pkdriller",
      mediaUrl: "",
      renderLargerThumbnail: true,
      thumbnail: await getBuffer(config.image_1),
      mediaType: 1,
      sourceUrl: config.channel
    },
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363025736545783@newsletter",
      serverMessageId: "",
    }
  };

  await conn.sendMessage(from, {
    text: groupInfo,
    mentions: participants.map(p => p.id),
    contextInfo
  }, { quoted: verifiedContact });
});
    
