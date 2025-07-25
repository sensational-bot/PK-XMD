const axios = require('axios');
const fs = require('fs');
const { fromBuffer } = require('file-type');
const { getRandom } = require('../lib/functions');

module.exports = {
    name: "play3",
    alias: ["song3", "ytaudio"],
    category: "downloader",
    desc: "download song from YouTube/SoundCloud/Spotify",
    use: "<song name>",
    react: "🎧",
    async exec(m, conn, { args }) {
        if (!args.length) return m.reply('🎧 Example: .play perfect ed sheeran');

        const query = args.join(" ");
        m.reply(`🔍 Searching for *${query}*...\nPlease wait...`);

        try {
            let res, data, url, thumb, title, dl_url;

            // Try YOUTUBE FIRST
            try {
                res = await axios.get(`https://apis-keith.vercel.app/api/ytplaymp3?query=${encodeURIComponent(query)}`);
                if (res.data.status) {
                    data = res.data.result;
                    url = data.url;
                    title = data.title;
                    thumb = data.thumb;
                    dl_url = url;
                }
            } catch (e) { }

            // Try SOUNDCLOUD if YouTube failed
            if (!dl_url) {
                try {
                    res = await axios.get(`https://api.siputzx.my.id/api/soundcloud/play?query=${encodeURIComponent(query)}`);
                    if (res.data.status) {
                        data = res.data.result;
                        url = data.url;
                        title = data.title;
                        thumb = data.thumb;
                        dl_url = url;
                    }
                } catch (e) { }
            }

            // Try SPOTIFY if both failed
            if (!dl_url) {
                try {
                    res = await axios.get(`https://api.siputzx.my.id/api/spotify/play?query=${encodeURIComponent(query)}`);
                    if (res.data.status) {
                        data = res.data.result;
                        url = data.url;
                        title = data.title;
                        thumb = data.thumb;
                        dl_url = url;
                    }
                } catch (e) { }
            }

            if (!dl_url) return m.reply("❌ Failed to fetch song. Try again later.");

            const fileData = await axios.get(dl_url, { responseType: "arraybuffer" });
            const fileType = await fromBuffer(fileData.data);
            const filename = getRandom("." + fileType.ext);
            fs.writeFileSync(filename, fileData.data);

            let quoted = {
                key: {
                    fromMe: false,
                    participant: "0@s.whatsapp.net",
                    remoteJid: "status@broadcast"
                },
                message: {
                    contactMessage: {
                        displayName: "WhatsApp",
                        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:PK;Driller;;;\nFN:PK DRILLER\nORG:WhatsApp Inc.\nTITLE:Official Bot\nTEL;type=CELL;type=VOICE;waid=254700000000:+254 700 000 000\nEND:VCARD`
                    }
                }
            };

            const contextInfo = {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "🎧 Music Found!",
                    body: `PK-XMD | Powered by Pkdriller`,
                    thumbnailUrl: thumb,
                    sourceUrl: url,
                    mediaType: 2,
                    renderLargerThumbnail: true
                },
                forwardedNewsletterMessageInfo: {
                    newsletterName: "PK-XMD Music Bot",
                    newsletterJid: "120363144297304071@newsletter"
                }
            };

            await conn.sendMessage(m.chat, { audio: fs.readFileSync(filename), mimetype: 'audio/mp4', ptt: false }, { quoted, contextInfo });
            await conn.sendMessage(m.chat, {
                document: fs.readFileSync(filename),
                mimetype: fileType.mime,
                fileName: `${title}.mp3`,
                caption: `🎧 *Title:* ${title}\n🔗 *Source:* ${url}\n\n✅ Downloaded via *PK-XMD*`,
                contextInfo
            }, { quoted });

            fs.unlinkSync(filename);
        } catch (e) {
            console.error(e);
            m.reply("❌ Error occurred while processing your request.");
        }
    }
};
              
