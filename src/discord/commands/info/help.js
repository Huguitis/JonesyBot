const { MessageEmbed } = require('discord.js');
const { prefix } = require('../../config');

module.exports.run = async (client, message, args, BotModel) => {
    const command = client.commands.get(args[0]) ? client.commands.get(args[0]) : client.commands.get(client.aliases.get(args[0]));

    const commands = {
        info: client.commands.filter(cmd => cmd.conf.category === 'info'),
        fortnite: client.commands.filter(cmd => cmd.conf.category === 'fortnite'),
        misc: client.commands.filter(cmd => cmd.conf.category === 'misc')
    };

    const helpEmbed = new MessageEmbed()
    .setColor('#2F3136')
    .setTitle('Comandos')
    .addField(`Fortnite [${commands.fortnite.size}]`, commands.fortnite.map(x => `\`${x.conf.name}\``).join(', '))
    .addField(`Información [${commands.info.size}]`, commands.info.map(x => `\`${x.conf.name}\``).join(', '))
    .addField(`Otros [${commands.misc.size}]`, commands.misc.map(x => `\`${x.conf.name}\``).join(', '))
  
    
    if (command) {
        const embed = new MessageEmbed()
        .setColor('#2F3136')
        .setTitle('Comandos')
        .setFooter('Soporte: discord.link/huguitis')
        .setDescription(`**-** Nombre: \`${command.conf.name}\`
        **-** Descripción: \`${command.conf.description}\`
        **-** Categoria: \`${command.conf.category}\`
        **-** Aliases: \`${command.conf.aliases ? command.conf.aliases.map(x => x).join(', ') : 'None'}\`
        **-** Uso: \`${command.conf.usage ? `${prefix}${command.conf.usage}` : 'Sin uso'}\`
        **-** Ejemplo: \`${command.conf.example ? `${prefix}${command.conf.example}` : 'Sin ejemplo'}\`
        \n**-** Solo en servidor: \`${command.conf.guildOnly ? 'Si' : 'No'}\`
        **-** Solo en DM: \`${command.conf.dmOnly ? 'Si' : 'No'}\``)
        message.channel.send(embed);
    } else {
        message.channel.send(helpEmbed);
    }
}

module.exports.conf = {
    name: 'help',
    description: 'Muestra la lista de comandos disponibles.',
    category: 'info',
    aliases: ['h', 'ayuda'],

    usage: 'help [comando]',
    example: 'help create',

    dmOnly: false,
    guildOnly: false,
    ownerOnly: false
}