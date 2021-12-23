const { owners, logs } = require('../../config');
const { MessageEmbed } = require('discord.js');

const embed = new MessageEmbed()
.setColor('YELLOW')
.setTitle(':warning: Vaya...')

module.exports = (client, BotModel) => {
    client.on('message', async message => {
        const { prefix } = require('../../config'); 

        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(' ');
        const cmd = args.shift().toLowerCase();

        const command = client.commands.get(cmd) ? client.commands.get(cmd) : client.commands.get(client.aliases.get(cmd));

        if (command) {
            if (command.conf.ownerOnly && !owners.includes(message.author.id)) return;
            if (command.conf.dmOnly && message.guild) { embed.setDescription('Este comando solo puede ser ejecutado en mensajes privados.'); return message.channel.send(embed); };
            if (command.conf.guildOnly && !message.guild) { embed.setDescription('Este comando solo puede utilizarse en un servidor.'); return message.channel.send(embed); };

            try {
                command.run(client, message, args, BotModel);
                console.log('[SERVER] [DISCORD] [COMMAND]', `${message.author.tag} (${message.author.id})${message.guild ? `, ${message.guild.name} (${message.guild.id})` : ''}: ${command.conf.name}`)
            } catch (err) {
                console.log('[SERVER] [DISCORD] [COMMAND] [ERR]', `${message.author.tag} (${message.author.id})${message.guild ? `, ${message.guild.name} (${message.guild.id})` : ''}: ${command.conf.name}`)
                console.log(err);
                const channel = client.channels.cache.get(logs);

                const embed = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle(':warning: Error encontrado por el usuario')
                .setDescription(`\`\`\`js\n${err}\`\`\``)
                channel.send(embed);
            }
        }
    });

}

module.exports.conf = {
    name: 'message'
}