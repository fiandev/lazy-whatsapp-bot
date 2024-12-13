const moment = require('../utils/moment.js');
const config = require('../../config.js');
const db = require('../utils/db.js');

const intended = new Map();
const expiredIntended = 60; // seconds

module.exports = {
    handler: async (sock, m, $next, command) => {
        if (m.fromMe) return $next

        // if user not register and try command bot
        if (!m.db?.user) {
            try {
                // if user try to register
                await db.user.put(m.sender, { name, ...config.DATABASE_SCHEMA.user })
                intended.delete(m.sender);
            } catch (e) {
                throw {
                    break: false, // continue code
                    continueCommand: false, // but dont execute command
                    message: 'User has not registered.',
                    hideLogs: true
                }
            }

        }

        return $next;
    }
}

const msg = {
    id: {
        register: 'Silahkan lakukan registrasi terlebih dahulu.\nCaranya ketik {prefix}reg `nama`',
        success: 'Hai *{name}* silahkan menggunakan bot dengan bijak.\n\nUntuk mengecek profile ketik `{prefix}id`\nUntuk menampilkan semua fitur bot ketik `{prefix}help`',
        min: 'Minimal 3 huruf.',
        tol: 'Yang bener napa bikin nama 🥱, cari nama lain le.'
    },
    en: {
        register: 'Please register first.\nHow to register : {prefix}reg `name`',
        success: 'Hi *{name}* please use the bot with caution.\n\nTo check profile type `{prefix}id`\nTo show all features type `{prefix}help`',
        min: 'Minimal 3 character.',
        tol: 'Name cannot be used 🥱'
    }
}