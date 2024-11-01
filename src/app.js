const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const { default: axios } = require("axios");

const handleDownloadImageRandomAnime = require("./handler/handleDownloadImageRandomAnime");

// Hapus folder data jika terjadi error: EBUSY: resource busy or locked
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: "./data",
    }),
});

client.once("ready", () => {
    console.log("Client is ready");
});

client.on("qr", (qr) => {
    console.log("Scan this QR:");
    qrcode.generate(qr, { small: true });
});

client.on("message", async (msg) => {
    if (msg.body[0] === "!" || msg.body[0] === ".") {
        if (msg.body[0] !== "!" && msg.body[0] !== ".") {
            return msg.reply("Gunakan tanda '!' atau '.' untuk memberikan perintah!");
        } else {
            console.log(`Chat: ${msg.body}, from: ${msg.id.remote.split("@", 1)[0]}`);
            switch (msg.body) {
                case "!menu":
                case ".menu":
                    msg.reply(
                        `
Powered by *Gaboot* 🎭

Dari ${msg.id.remote.split("@", 1)[0]}

Gunakan karakter *\'!\'* (tanda seru) atau *\'.\'* (titik) diawal untuk melakuakan perintah.
Contoh: !download

*FREE* 
» download-vt, dlvt
    • Download video tiktok

» swaifu, smaid, sraiden-shogun, smarin-kitagawa, smori-calliope, soppai, sselfies, suniform, skamisato-ayaka
    • Random gambar anime
    
*FREE (18+)*
» shentai, smilf, sass, soral, spaizuri, secchi, sero
    • Random gambar anime (18+)

_Harap gunakan teknologi ini dengan bijak._
                    `
                    );
                    break;
                case "!swaifu":
                case ".swaifu":
                case "!smaid":
                case ".smaid":
                case "!smarin-kitagawa":
                case ".smarin-kitagawa":
                case "!sraiden-shogun":
                case ".sraiden-shogun":
                case "!smori-calliope":
                case ".smori-calliope":
                case "!soppai":
                case ".soppai":
                case "!sselfies":
                case ".sselfies":
                case "!suniform":
                case ".suniform":
                case "!skamisato-ayaka":
                case ".skamisato-ayaka":

                case "!shentai":
                case ".shentai":
                case "!smilf":
                case ".smilf":
                case "!sass":
                case ".sass":
                case "!soral":
                case ".soral":
                case "!spaizuri":
                case ".spaizuri":
                case "!sechhi":
                case ".sechhi":
                case "!sero":
                case ".sero":
                    await msg.reply("Proccess...");

                    const msgBody = msg.body.substring(2);
                    const url = `https://api.waifu.im/search?included_tags=${msgBody}`;

                    try {
                        const res = await axios.get(url);
                        const data = res.data;
                        const imgUrl = data.images[0].url;
                        const fileExtension =
                            imgUrl.match(/\.(jpeg|jpg|png)$/i)?.[0] || ".png";
                        const fileName = `anime${fileExtension}`;

                        try {
                            await handleDownloadImageRandomAnime(imgUrl, fileName);
                            await msg.reply(MessageMedia.fromFilePath(fileName), msg.from, {
                                caption: "Nih bosss 😋",
                            });
                            fs.unlink(fileName, (e) => {
                                if (e) throw new Error(e.message);
                            });
                        } catch (e) {
                            await msg.reply("Gagal saat mengunduh gambar. Coba lagi");
                            console.error(e.message);
                        }
                    } catch (e) {
                        await msg.reply("Gagal saat mengambil data. Coba lagi");
                        console.error(e.message);
                    }
                    break;
                case "!download-vt":
                case "!dlvt":
                case ".download-vt":
                case ".dlvt":
                    await client.sendMessage(
                        msg.from,
                        "Replay chat ini dan berikan link nya"
                    );

                    client.on("message", async (msg) => {
                        if (msg.hasQuotedMsg) {
                            const quatedMsg = await msg.getQuotedMessage();

                            if (quatedMsg.body === "Replay chat ini dan berikan link nya") {
                                const userLink = msg.body;
                                const tiktokRegex = /https:\/\/(www\.tiktok\.com|vt\.tiktok\.com)\/[\S]+/gi;

                                if (tiktokRegex.test(userLink)) {
                                    const tt = require("@tobyg74/tiktok-api-dl");

                                    await msg.reply("Proccess...");
                                    tt.Downloader(userLink, { version: "v2" })
                                        .then(
                                            async (result) => {
                                                try {
                                                    const { type } = result.result;
                                                    const { nickname } = result.result.author
                                                    const { likeCount, commentCount, shareCount } = result.result.statistics;
                                                    const { video, music } = result.result;

                                                    await msg.reply(`Powered by Gaboot 🎭
_Harap gunakan data ini dengan bijak. Segala kerugian yang ditimbulkan bukan tanggung jawab kami._

*Status*: ${result.status ?? 'Tidak tersedia'}
_Type_: ${type ?? 'Tidak tersedia'}

*Author* 👀
_Nickname_: ${nickname ?? 'Tidak tersedia'}

*Statistics* 📊
_Likes_: ${likeCount ?? 'Tidak tersedia'}
_Share_: ${shareCount ?? 'Tidak tersedia'}
_Comments_: ${commentCount ?? 'Tidak tersedia'}

*Video* 🎥
_Download_: ${video ?? 'Tidak tersedia'}

*Music* 🎶
_Download_: ${music ?? 'Tidak tersedia'}

Link vt: ${userLink}`);
                                                } catch (e) {
                                                    msg.reply("Proses gagal. Coba lagi");
                                                    console.error(e.message)
                                                }
                                            }
                                        );
                                }
                            }
                        }
                    });
                    break;
                default:
                    msg.reply(
                        "Perintah tidak tersedia.\nKetik *.menu/!menu* untuk membuka list perintah"
                    );
            }
        }
    }
});

client.initialize();