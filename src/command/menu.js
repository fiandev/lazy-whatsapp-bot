const { menuByLabel } = require("../utils/loadCommands.js")
const timer2 = require("../utils/timer2.js")
const fs = require('fs');
const path = require('path');
const config = require("../../config.js");

module.exports = {
    name: "menu",
    description: "Menu Bot",
    cmd: ['help', 'menu'],
    run: async ({ m, sock }) => {
        let text = ''
        let label = 'All Menu';
        // text += `*\`Hai ${m.db.user.name}\`*\nSelamat ${timer2()} \n\n`
        // text += `\`Blockchain\`\n> Mata uang bot yang bisa kamu gunakan untuk membeli limit taruhan dan lain lain.\n\n\n`
        text += String.fromCharCode(8206).repeat(4001)
        if (m.body.arg) {
            let filterMenu = menuByLabel.get(m.body.arg)
            if (!filterMenu) return
            label = m.body.arg.toUpperCase()
            text += `\`❖ ${m.body.arg.toUpperCase()}\`\n`
            filterMenu.forEach((v) => {
                text += `▷  ${m.body.prefix + v.cmd[0]} ${v?.example ? '_' + v.example + '_' : ''}\n`
            })
        } else {
            menuByLabel.forEach((val, key) => {
                text += `\`❖ ${key.toUpperCase()}\`\n`
                val.forEach((v) => {
                    text += `▷  ${m.body.prefix + v.cmd[0]} ${v?.example ? '_' + v.example + '_' : ''}\n`
                })
                text += `\n`
            })
        }
        text += `\n`
        text += `_👑 author: Fian\n`

        await m._sendMessage(m.chat, {
            text,
            contextInfo: {
                externalAdReply: {
                    title: 'Yui BOT',
                    body: `- ${label} -`,
                    mediaType: 2,
                    thumbnail: m.db.bot.icon,
                    sourceUrl: 'https://velixs.com',
                }
            }
        }, { quoted: m });
    }
}