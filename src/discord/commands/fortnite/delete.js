const emoji = require('../../../utils/emojis');

const { MessageEmbed } = require('discord.js');
const { Client } = require('fnbr');

module.exports.run = async (client, message, args, BotModel) => {
    const bot = await BotModel.findOne({ ownedBy: message.author.id });
    if (!bot) return message.channel.send('¡No tienes ningun bot todavia!');

    const embed = new MessageEmbed()
    .setColor('#2F3136')
    .setTitle(`${emoji.loading} Cerrando sesión y eliminando bot...`)
    const msg = await message.channel.send(embed);
    
    const data = {
        accountId: bot.accountId,
        deviceId: bot.deviceId,
        secret: bot.secret
    };

    const Options = {
        debug: false,
        auth: {}
    };

    Options.auth.deviceAuth = data;

    const x = new Client(Options);

    await x.logout();
    
    await BotModel.findOneAndDelete({ ownedBy: message.author.id });

    embed.setTitle(`${emoji.good} El bot se ha eliminado de la base de datos.`);
    await msg.edit(null, embed);


}

module.exports.conf = {
    name: 'delete',
    description: 'Elimina tu bot de Fortnite',
    category: 'fortnite',
    aliases: ['del', 'deletebot', 'remove', 'removebot', 'eliminar'],

    usage: 'delete',
    example: 'delete',

    dmOnly: false,
    guildOnly: false,
    ownerOnly: false
}