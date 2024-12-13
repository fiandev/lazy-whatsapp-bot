const axios = require("axios");
const { fbdl, ttdl } = require("../utils/scraper.js");
const log = require("../utils/log.js");

module.exports = {
    handler: async (sock, m, $next, command) => {
        if (m.fromMe) return $next;
        if (m.body.prefix) return $next;
        if (m.isGroup) return $next;

        let message = m.body.full;
        let idUser = Buffer.from(m.sender).toString("base64");
        let prompt = `kamu akan menggantikan seseorang bernama fian, untuk membalas pesan belum sempat ia balas.
jika pesan yang dikirim kekamu sopan maka gunakan bahasa yang santai tetapi masih tetap sopan, tetapi jika bahasa dari pesan yang diberikan ke kamu adalah bahasa antar teman yang akrab maka balas dengan bahasa akrab juga tidak pelru formal.
gunakanlah emoji untuk mengekpresikan perasaan.
jika kamu diminta untuk minjamin sesautu katakan padanya kalau kamu hanya asisten ai dari yang bersangkutan, dan katakan bahwa nanti yang bersangkutan akan membalas dan mengonfirmasi mau meminjamkannya atau tidak.
jawab kamu diberi pertanyaan jawablah dengan konteks dan jawaban yang tepat, jika kamu diminta mengirim foto atau file katakan bahwa kamu ini hanya asisten ai dari yang bersangkutan, dan sampaikan permintaan maaf karna belum di program sejauh itu.`

        try {
            if (
                ["imageMessage", "videoMessage"].includes(m.quoted?.mtype || m.mtype)
            ) {
                prompt +=
                    "jika ada yang meminta mu untuk melihat gambar, sampaikan pemintaan maaf bahwa kamu belum diprogram lebih jauh untuk hal tersebut.";
                prompt += `Jika seseorang meminta untuk mendownload media dari Facebook, Instagram, atau TikTok dengan menyertakan link yang mengandung facebook.com, instagram.com, atau tiktok.com, balas dengan [download] (huruf kecil, tanpa tambahan apapun) dan lanjutkan ke bot WhatsApp.`;
                prompt += `Jika seseorang meminta untuk mendownload media dari platform tersebut tetapi tidak menyertakan link yang valid, minta mereka untuk mengirimkan link dari salah satu platform tersebut. Setelah itu, jika mereka mengirimkan link, balas dengan [download] (huruf kecil, tanpa tambahan apapun) dan lanjutkan ke bot WhatsApp.`;
                prompt += `Ingatkan bahwa hanya media dari Facebook, Instagram, atau TikTok yang dapat didownload.`;
            }

            const response = await axios.post("https://luminai.my.id/", {
                prompt,
                content: message,
                user: idUser,
            });

            if (response.data.result.match(/\[download\]/)) {
                let url = m.body.full.match(/(https?:\/\/[^\s]+)/g)[0] || null;

                if (
                    /^https?:\/\/(?:www\.)?(facebook|fb|instagram)\.com\/.+$/.test(url)
                ) {
                    m._react(m.key, "🔍");
                    const res = await fbdl(url);
                    const bestQuality = res.data[0];
                    await m._sendMessage(
                        m.chat,
                        {
                            video: { url: bestQuality.url },
                        },
                        { quoted: m }
                    );
                    m._react(m.key, "✅");
                }

                if (/^https?:\/\/(?:[a-z]+\.)?(tiktok)\.com\/.+$/.test(url)) {
                    m._react(m.key, "🔍");
                    const res = await ttdl(url);
                    await m._sendMessage(
                        m.chat,
                        {
                            video: { url: res.video },
                        },
                        { quoted: m }
                    );
                    m._react(m.key, "✅");
                }

                m._reply(
                    "sepertinya URL yang anda kirimkan tidak valid, coba kirim lagi dengan URL yang valid!"
                );
                return $next;
            }

            m._reply(response.data.result);
            log.info(`@${m.sender} # auto response generated!`);

            return $next;
        } catch (e) {
            console.error(e);
        }

        return $next;
    },
};
