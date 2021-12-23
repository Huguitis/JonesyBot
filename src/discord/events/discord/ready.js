const API = require('../../../lib/auth');

const { prefix } = require('../../config')
const { Client } = require('fnbr');

module.exports = (client, BotModel) => {
    client.on('ready', async () => {
        console.log('[SERVER] [DISCORD]', 'Connection has been established.');

        const bots = await BotModel.find({});

        bots.forEach(async bot => {
            if (bot.sleeping) return;

            const data = {
                accountId: bot.accountId,
                deviceId: bot.deviceId,
                secret: bot.secret
            };

            let Options;

            if (bot.status) {
                Options = {
                    status: bot.status,
                    keepAliveInterval: 30,
                    debug: false,
                    auth: {}
                };
            } else {
                Options = {
                    keepAliveInterval: 30,
                    debug: false,
                    auth: {}
                };
            };

            Options.auth.deviceAuth = data;

            const x = new Client(Options);

            API.handleCommands(client, x, BotModel);

            await x.login().catch(async() => {
                await BotModel.findOneAndDelete({ accountId: data.accountId });

                const member = client.users.cache.get(bot.ownedBy);
                await member.send(`¡Oye! Parece que hay algún problema con tu bot, esto suele ocurrir cuando Epic Games ha reiniciado los auths de las cuentas. Crea de nuevo el bot con +create`);
            });
        });

        setInterval(async() => {
            const online = await BotModel.find({ sleeping: false });
            client.user.setActivity(`${online.length === 0 || online.length > 2 ? `${online.length} lobbybots` : `${online.length} lobbybot`} | ${prefix}help`, { type: 'WATCHING' });

            await API.checkBots(client, BotModel);
        }, 10000);
    });
}

module.exports.conf = {
    name: 'ready'
}