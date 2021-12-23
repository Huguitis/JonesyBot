const emoji = require('../../../utils/emojis');

const { MessageEmbed } = require('discord.js');

const wait = time => new Promise(res => setTimeout(res, time));

module.exports.run = async (client, message, args, BotModel) => {
    const msg = await message.channel.send('Pingueando...');

    const ping = client.ws.ping;

    const embed = new MessageEmbed()
    .setColor('#2F3136')
    .setTitle(`${emoji.loading} Comprobando... `)

    await msg.edit(null, embed);
    await wait(2324);

    const Ping = msg.createdTimestamp - message.createdTimestamp;

    const embed2 = new MessageEmbed()
    .setColor('2F3136')
    .addField('Discord', `\`${ping}\` ms`, true)
    .addField('Cliente', `\`${Ping}\` ms`, true)
    await msg.edit(null, embed2);
}

module.exports.conf = {
    name: 'ping',
    description: 'Muestra la latencia del bot.',
    category: 'info',

    usage: 'ping',
    example: 'ping',

    dmOnly: false,
    guildOnly: false,
    ownerOnly: false
}