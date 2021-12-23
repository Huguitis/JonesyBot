const config = require('./config');
require('./server');

const { Client, Collection } = require('discord.js');
const { connect } = require('mongoose');

const BotModel = require('../models/Bot');

const client = new Client({
    disableMentions: 'everyone'
});

client.commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.cooldowns = new Set();

require('./handlers/commands.js')(client);
require('./handlers/events.js')(client, BotModel);

['ready', 'message'].forEach(event => {
    require(`./events/discord/${event}.js`)(client, BotModel);
});

(async() => {
    await connect(config.mongoDB, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    });

    console.log('[SERVER] [MONGODB]', 'Connection has been established.');

    await client.login(config.token);
})();