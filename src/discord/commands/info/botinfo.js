const config = require('../../config');

const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, BotModel) => {
    const embed = new MessageEmbed()
    .setColor('#2F3136')
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .addField('<a:chincheta:759818182424133644> Creador', '`HuguitisYT#4927`')
    .addField(':space_invader: Versión', `\`v${config.version}\``)
    .addField('🏘️ Servidores', `\`${client.guilds.cache.size}\``)
    .addField('Invitame', `📬 [Pulsa aqui](https://discord.com/api/oauth2/authorize?client_id=865990846175772723&permissions=8&scope=bot)`)
    .addField('Servidor de soporte', '[discord.link/huguitis](https://discord.link/huguitis)')
    message.channel.send(embed);
}

module.exports.conf = {
    name: 'botinfo',
    description: 'Muestra la información del bot',
    category: 'info',
    aliases: ['info'],

    usage: 'botinfo',
    example: 'botinfo',

    dmOnly: false,
    guildOnly: false,
    ownerOnly: false
}