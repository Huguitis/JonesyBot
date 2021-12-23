const { readdirSync } = require('fs');

module.exports = (client, BotModel) => {
    readdirSync(`${__dirname}/../events/`).forEach(dir => {
        const events = readdirSync(`${__dirname}/../events/${dir}/`).filter(x => x.endsWith('.js'));

        for (let file of events) {
            const pull = require(`${__dirname}/../events/${dir}/${file}`);

            if (pull.conf.name) {
                client.events.set(pull.conf.name, pull);
            }
        }
    });
}