const { delay } = require("@whiskeysockets/baileys");

module.exports = async (sock) => {
    setInterval(async () => {
        if (!sock?.connected) return;
    }, 30000); // 1 minute

    async function _sendMessage(jid, content, options) {
        await sock.presenceSubscribe(jid);
        await delay(500);
        await sock.sendPresenceUpdate("composing", jid);
        await delay(500);
        await sock.sendPresenceUpdate("paused", jid);

        options = { ...options, ...{ ephemeralExpiration: true } };
        return await sock.sendMessage(jid, content, options);
    }
};
