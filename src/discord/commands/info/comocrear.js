const config = require('../../config');

const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, BotModel) => {
    const embed = new MessageEmbed()
    .setColor('#2F3136')
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .setDescription('1 - Inicia sesión en **https://epicgames.com** con una cuenta **alternativa**, la de tu bot.\n2 - Ejecuta el comando **+create**, el bot te pedira un codigo de autorización de la cuenta de tu bot.\n3 - Entra en este link: **[aqui](https://www.epicgames.com/id/api/redirect?clientId=3446cd72694c4a4485d81b77adbb2141&responseType=code)** y copia el codigo que hay entre **code=** y **"**\n4 - Pegalo y envialo por el chat donde ejecutaste el comando **+create**.\n5 - Ahora el bot habrá editado el mensaje y te pedirá el **estado de tu bot**, el mensaje que aparezca en la lista de amigos.\n6 - A continuación indica el **mensaje** que aparecera por el chat cuando alguien se una al grupo.\n7 - Introduce tu nombre usuario de **Epic Games** para que el bot te de administrador.\n8 - Ahora el bot mostrará que si quieres que todo el mundo pueda usar el bot, si es así, escribe y envia **si**, de lo contrario indica **no**\n***(NOTA: Si no respondes pronto, el bot cancelará el proceso y tendrás que hacerlo todo de nuevo. Soporte: [discord.link/huguitis](discord.link/huguitis)***')
    message.channel.send(embed);
}

module.exports.conf = {
    name: 'comocrear',
    description: 'Muestra una guia de como crear un bot.',
    category: 'info',

    usage: 'comocrear',
    example: 'comocrear',

    dmOnly: false,
    guildOnly: false,
    ownerOnly: false
}