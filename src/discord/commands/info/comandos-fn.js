const config = require('../../config');

const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, BotModel) => {
    const embed = new MessageEmbed()
    .setColor('#2F3136')
    .setTitle("Comandos para el LobbyBot")
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .setDescription('**+skin (nombre en inglés)** Ponle una skin a tu bot\n**+emote (nombre en inglés)** Ponle un baile a tu bot\n**+backpack (nombre en inglés)** Ponle una mochila a tu bot\n**+pickaxe (nombre en inglés)** Ponle un pico a tu bot\n\n **(TODOS ESTOS COMANDOS POR EL MOMENTO, DEBEN EJECUTARSE POR DISCORD)**  ')
    message.channel.send(embed);
}

module.exports.conf = {
    name: 'comandos-fn',
    description: 'Muestra una guia de los comandos para el lobbybot.',
    category: 'info',

    usage: 'comandos-fn',
    example: 'comandos-fn',

    dmOnly: false,
    guildOnly: false,
    ownerOnly: false
}