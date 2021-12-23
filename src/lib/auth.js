const axios = require('axios').default;
const fetch = require('node-fetch');

const tokens = require('../utils/tokens');
const endpoints = require('../utils/endpoints');

const { stringify } = require('querystring');
async function searchCosmetic(name, backendType) {
    let url;

    if (backendType) url = `https://fortnite-api.com/v2/cosmetics/br/search?name=${name}&matchMethod=contains&backendType=${backendType}`;
    else url = `https://fortnite-api.com/v2/cosmetics/br/search?name=${name}&matchMethod=contains`;

    return (await fetch(url)).json();
}

function handleCommands(client, bot, BotModel) {
    client.on('message', async message => {
        const prefix = '+';
        const _ = await BotModel.findOne({ ownedBy: message.author.id });
      

        const args = message.content.slice(prefix.length).trim().split(' ');
        const command = args.shift().toLowerCase();

        if (command === 'skin') {
            const cosmetic = args.slice(0).join(' ');
            if (!cosmetic) return message.channel.send('Porfavor indica un cosmetico.');

            const res = await searchCosmetic(cosmetic, 'AthenaCharacter');
            if (res.status !== 200) return message.channel.send('No se ha encontrado ningun cosmetico con esos parametros.');

            bot.party.me.setOutfit(res.data.id);
            message.channel.send(`La skin se ha cambiado a: ${res.data.name} | ${res.data.id}`);
        }

        if (command === 'backpack' || command === 'bp') {
            const cosmetic = args.slice(0).join(' ');
            if (!cosmetic) return message.channel.send('Porfavor indica un cosmetico.');

            const res = await searchCosmetic(cosmetic, 'AthenaBackpack');
            if (res.status !== 200) return message.channel.send('No se ha encontrado ningun cosmetico con esos parametros.');

            bot.party.me.setBackpack(res.data.id);
            message.channel.send(`La mochila se ha cambiado a: ${res.data.name} | ${res.data.id}`);
        }


        if (command === 'emote') {
            const cosmetic = args.slice(0).join(' ');
            if (!cosmetic) return message.channel.send('Porfavor indica un cosmetico.');

            const res = await searchCosmetic(cosmetic, 'AthenaDance');
            if (res.status !== 200) return message.channel.send('No se ha encontrado ningun cosmetico con esos parametros.');

            bot.party.me.setEmote(res.data.id);
            message.channel.send(`El baile se ha cambiado a: ${res.data.name} | ${res.data.id}`);
        }

        if (command === 'pickaxe') {
            const cosmetic = args.slice(0).join(' ');
            if (!cosmetic) return message.channel.send('Porfavor indica un cosmetico.');

            const res = await searchCosmetic(cosmetic, 'AthenaPickaxe');
            if (res.status !== 200) return message.channel.send('No se ha encontrado ningun cosmetico con esos parametros.');

            bot.party.me.setPickaxe(res.data.id);
            message.channel.send(`El pico se ha cambiado a: ${res.data.name} | ${res.data.id}`);
        }

    });
}

async function checkBots(client, BotModel) {
    const b = await BotModel.find({ sleeping: false });

    b.forEach(async bot => {
        const data = {
            grant_type: 'device_auth',
            account_id: bot.accountId,
            device_id: bot.deviceId,
            secret: bot.secret
        };

        await axios.post(endpoints.OAUTH_TOKEN, stringify(data), {
            headers: {
                Authorization: `Basic ${tokens.iosToken}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).catch(async(err) => {
            console.log(err);
            await BotModel.findOneAndDelete({ accountId: data.account_id });

            const member = client.users.cache.get(bot.ownedBy);
            member.send('¡Oye! Parece que hay algún problema con tu bot, esto suele ocurrir cuando Epic Games ha reiniciado los auths de las cuentas. Crea de nuevo el bot con +create').catch(() => {});
        });
    });
}

module.exports = {
    searchCosmetic,
    checkBots,
    handleCommands
}