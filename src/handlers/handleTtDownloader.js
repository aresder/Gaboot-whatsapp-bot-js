const tt = require("@tobyg74/tiktok-api-dl");

const handleTtDownloader = (client) => {
  client.on("message", async (msg) => {
    if (msg.hasQuotedMsg) {
      const quatedMsg = await msg.getQuotedMessage();

      if (quatedMsg.body === "Replay chat ini dan berikan link nya") {
        const userLink = msg.body;
        const tiktokRegex =
          /https:\/\/(www\.tiktok\.com|vt\.tiktok\.com)\/[\S]+/gi;

        if (tiktokRegex.test(userLink)) {
          await msg.reply("Proccess...");
          tt.Downloader(userLink, { version: "v2" }).then(async (result) => {
            try {
              const { type } = result.result;
              const { nickname } = result.result.author;
              const { likeCount, commentCount, shareCount } =
                result.result.statistics;
              const { video, music } = result.result;

              await msg.reply(`Powered by Gaboot 🎭
_Harap gunakan data ini dengan bijak. Segala kerugian yang ditimbulkan bukan tanggung jawab kami._

*Status*: ${result.status ?? "Tidak tersedia"}
_Type_: ${type ?? "Tidak tersedia"}

*Author* 👀
_Nickname_: ${nickname ?? "Tidak tersedia"}

*Statistics* 📊
_Likes_: ${likeCount ?? "Tidak tersedia"}
_Share_: ${shareCount ?? "Tidak tersedia"}
_Comments_: ${commentCount ?? "Tidak tersedia"}

*Video* 🎥
_Download_: ${video ?? "Tidak tersedia"}

*Music* 🎶
_Download_: ${music ?? "Tidak tersedia"}

Link vt: ${userLink}`);
            } catch (e) {
              msg.reply("Proses gagal. Coba lagi");
              console.error(e.message);
            }
          });
        }
      }
    }
  });
};

module.exports = handleTtDownloader;
