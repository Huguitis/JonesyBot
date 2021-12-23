const emoji = require('../../../utils/emojis');
const API = require('../../../lib/auth');

const { MessageEmbed } = require('discord.js');
const { Client } = require('fnbr');

module.exports.run = async (client, message, args, BotModel) => {
    const bot = await BotModel.findOne({ ownedBy: message.author.id });
    if (!bot) return message.channel.send('No tienes un bot.');

    const embed = new MessageEmbed()
    .setColor('#2F3136')

    if (bot.sleeping) {
        embed.setTitle(emoji.loading);
        const msg = await message.channel.send(embed);

        const data = {
            accountId: bot.accountId,
            deviceId: bot.deviceId,
            secret: bot.secret
        };
    
        const Options = {
            status: bot.status !== '0' ? bot.status : null,
            debug: false,
            keepAliveInterval: 30,
            auth: {}
        }
    
        Options.auth.deviceAuth = data;
    
        const x = new Client(Options);
    
        await x.login();

        await BotModel.findOneAndUpdate({ ownedBy: message.author.id }, { sleeping: false });
        embed.setTitle(`${emoji.good} Desactivado el modo suspendido`);
        if (!error) API.handleCommands(client, x, BotModel);
        await msg.edit(null, embed);
    } else {
        embed.setTitle(emoji.loading);
        const msg = await message.channel.send(embed);

        const data = {
            accountId: bot.accountId,
            deviceId: bot.deviceId,
            secret: bot.secret
        };
    
        const Options = {
            debug: false,
            auth: {}
        }
    
        Options.auth.deviceAuth = data;
    
        const x = new Client(Options);
    
        await x.login();
        await x.logout();

        await BotModel.findOneAndUpdate({ ownedBy: message.author.id }, { sleeping: true });
        embed.setTitle(`${emoji.good} Modo suspendido activado`);
        await msg.edit(null, embed);
    }

}

module.exports.conf = {
    name: 'sleep',
    description: 'Configura el modo suspenso de tu bot.',
    category: 'fortnite',

    usage: 'sleep',
    example: 'sleep',

    dmOnly: false,
    guildOnly: false,
    ownerOnly: true
}