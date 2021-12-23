const { MessageEmbed } = require('discord.js');
const { suggestions, prefix } = require('../../config');

module.exports.run = async (client, message, args, BotModel) => {
    if (message.guild.id !== '722020882675007518') return message.channel.send('Solo puedes usar este comando en el servidor oficial: https://discord.gg/ZxeavDHumA');

    const suggestion = args.slice(0).join(' ');
    if (!suggestion) return message.channel.send('¿Qué, vas a sugerir, aire? ¡No acepto eso como una sugerencia!');
    
    const embed = new MessageEmbed()
    .setColor('#2F3136')
    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic:true}))
    .setTitle('Sugerencia')
    .setDescription(suggestion)
    .setFooter(`¿Quieres sugerir algo? Usa ${prefix}suggest`)
    const msg = await client.channels.cache.get(suggestions).send(embed);

    await message.react('793126481777000466');
    await msg.react('793126481777000466');
    await msg.react('793119853049151538');
    
}

module.exports.conf = {
    name: 'sugerir',
    description: 'Sugiere algo para JonesyBot',
    category: 'misc',
    aliases: ['suggestion', 'suggest'],

    usage: 'sugerir [sugerencia]',
    example: 'sugerir Que el bot pueda regalarte cosas (obviamente no)',

    dmOnly: false,
    guildOnly: true,
    ownerOnly: false
}