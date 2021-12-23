const emoji = require('../../../utils/emojis');

const { MessageEmbed } = require('fnbr');
const { Client } = require('fnbr');

module.exports.run = async (client, message, args, BotModel) => {
    const bots = await BotModel.find({ sleeping: false });

    let i = 0;

    bots.forEach(async bot => {
        let Options;

        if (bot.status !== '0') {
            Options = {
                status: bot.status,
                keepAliveInterval: 30,
                auth: {}
            }
        } else {
            Options = {
                keepAliveInterval: 30,
                auth: {}
            }
        }

        const data = {
            accountId: bot.accountId,
            deviceId: bot.deviceId,
            secret: bot.secret
        };

        Options.auth.deviceAuth = data;

        const x = new Client(Options);

        x.on('ready', () => {
            i++;
            API.handleCommands(client, x, BotModel);
        });

        await x.login();
    });

    const embed = new MessageEmbed()
    .setColor('#2F3136')
    .setDescription(`${emoji.good} Reinicados ${i} bots.`)
    message.channel.send(embed);
}

module.exports.conf = {
    name: 'reload',
    description: 'Reinicia todos los bots creados.',
    category: 'owner',
    aliases: ['r'],

    usage: 'reload [command]',
    example: 'reload suggest',

    dmOnly: false,
    guildOnly: false,
    ownerOnly: true
}
