const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const config = require('../config');
const { getBuffer } = require('../lib/functions');

// Fake vCard contact
const quotedContact = {
  key: {
    fromMe: false,
    participant: '0@s.whatsapp.net',
    remoteJid: 'status@broadcast'
  },
  message: {
    contactMessage: {
      displayName: "WhatsApp Verified",
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:WhatsApp Verified\nORG:WhatsApp\nTEL;type=CELL;type=VOICE;waid=1234567890:+1 (234) 567-890\nEND:VCARD`
    }
  }
};

// Context info
const contextInfo = {
  externalAdReply: {
    title: 'PK-XMD Anime Suite 🎌',
    body: 'Powered by Pkdriller',
    thumbnail: await getBuffer('https://files.catbox.moe/fgiecg.jpg'),
    mediaType: 1,
    mediaUrl: '',
    sourceUrl: 'https://whatsapp.com/channel/0029Vad7YNyJuyA77CtIPX0x',
    showAdAttribution: true
  },
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterName: "PK-XMD Verified",
    newsletterJid: "120363288304618280@newsletter",
  }
};

cmd({
  pattern: "anime",
  desc: "All Anime Commands",
  category: "anime",
  react: "🎌",
  filename: __filename
},
async (conn, m, text, { args }) => {
  const query = args.slice(1).join(" ");
  const subcmd = args[0];

  if (!subcmd) {
    return await m.reply("*🎌 PK-XMD Anime Suite 🎌*\n\n• `.anime <name>`\n• `.character <name>`\n• `.manga <name>`\n• `.topanime`\n• `.animesearch <name>`\n• `.animequote`\n• `.animewall`\n\n_Type any to continue..._", {
      quoted: quotedContact,
      contextInfo
    });
  }

  switch (subcmd.toLowerCase()) {

    case "anime":
      if (!query) return m.reply("*Enter anime name!*", { quoted: quotedContact, contextInfo });
      try {
        const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${query}`);
        const anime = res.data.data[0];
        let caption = `🎌 *Title:* ${anime.title}\n🆔 *ID:* ${anime.mal_id}\n📺 *Type:* ${anime.type}\n💫 *Status:* ${anime.status}\n⭐ *Score:* ${anime.score}\n📅 *Aired:* ${anime.aired.string}\n📖 *Synopsis:* ${anime.synopsis}`;
        await conn.sendMessage(m.chat, { image: { url: anime.images.jpg.image_url }, caption }, { quoted: quotedContact, contextInfo });
      } catch (e) {
        return m.reply("Anime not found!", { quoted: quotedContact, contextInfo });
      }
      break;

    case "character":
      if (!query) return m.reply("Enter character name", { quoted: quotedContact, contextInfo });
      try {
        const res = await axios.get(`https://api.jikan.moe/v4/characters?q=${query}`);
        const char = res.data.data[0];
        let msg = `🎭 *Name:* ${char.name}\n📝 *About:* ${char.about?.substring(0, 500) || "No info"}...`;
        await conn.sendMessage(m.chat, { image: { url: char.images.jpg.image_url }, caption: msg }, { quoted: quotedContact, contextInfo });
      } catch (e) {
        return m.reply("Character not found!", { quoted: quotedContact, contextInfo });
      }
      break;

    case "manga":
      if (!query) return m.reply("Enter manga name", { quoted: quotedContact, contextInfo });
      try {
        const res = await axios.get(`https://api.jikan.moe/v4/manga?q=${query}`);
        const manga = res.data.data[0];
        let cap = `📚 *Title:* ${manga.title}\n🔖 *Status:* ${manga.status}\n⭐ *Score:* ${manga.score}\n🖊️ *Chapters:* ${manga.chapters}\n📖 *Synopsis:* ${manga.synopsis}`;
        await conn.sendMessage(m.chat, { image: { url: manga.images.jpg.image_url }, caption: cap }, { quoted: quotedContact, contextInfo });
      } catch (e) {
        return m.reply("Manga not found!", { quoted: quotedContact, contextInfo });
      }
      break;

    case "topanime":
      try {
        const res = await axios.get(`https://api.jikan.moe/v4/top/anime`);
        const list = res.data.data.slice(0, 5).map((v, i) => `*${i + 1}.* ${v.title} (${v.score})`).join('\n');
        await m.reply(`🌟 *Top Anime List:*\n\n${list}`, { quoted: quotedContact, contextInfo });
      } catch {
        return m.reply("Couldn't fetch top anime", { quoted: quotedContact, contextInfo });
      }
      break;

    case "animesearch":
      if (!query) return m.reply("Enter anime to search", { quoted: quotedContact, contextInfo });
      try {
        const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${query}`);
        const result = res.data.data.map((v, i) => `*${i + 1}.* ${v.title} (${v.score})`).slice(0, 5).join('\n');
        await m.reply(`🔍 *Search Results:*\n\n${result}`, { quoted: quotedContact, contextInfo });
      } catch {
        return m.reply("Error in anime search", { quoted: quotedContact, contextInfo });
      }
      break;

    case "animequote":
      try {
        const res = await axios.get(`https://animechan.xyz/api/random`);
        const quote = res.data;
        await m.reply(`💬 *"${quote.quote}"*\n\n— ${quote.character} (${quote.anime})`, { quoted: quotedContact, contextInfo });
      } catch {
        return m.reply("Could not fetch quote", { quoted: quotedContact, contextInfo });
      }
      break;

    case "animewall":
      try {
        const res = await axios.get(`https://nekos.best/api/v2/wallpaper`);
        const img = res.data.results[0].url;
        await conn.sendMessage(m.chat, { image: { url: img }, caption: "🖼️ *Anime Wallpaper*" }, { quoted: quotedContact, contextInfo });
      } catch {
        return m.reply("Couldn't fetch wallpaper", { quoted: quotedContact, contextInfo });
      }
      break;

    default:
      await m.reply("Unknown anime command.\nUse `.anime` to see options.", { quoted: quotedContact, contextInfo });
  }
});
  
