const axios = require('axios').default;
const emoji = require('../../../utils/emojis');
const endpoints = require('../../../utils/endpoints');
const tokens = require('../../../utils/tokens');
const API = require('../../../lib/auth');

const { MessageEmbed } = require('discord.js');
const { Client } = require('fnbr');
const { stringify } = require('querystring');

const failEmbed = (text, message) => {
    const _ = new MessageEmbed()
    .setColor('YELLOW')
    .setTitle(':warning: Vaya...')
    .setDescription(text)

    return message.channel.send(_);
}

module.exports.run = async (client, message, args, BotModel) => {
    const bot = await BotModel.findOne({ ownedBy: message.author.id });
    if (bot) return message.channel.send('Parece ser que ya tienes un bot, haz -delete y luego -create si quieres uno nuevo.');

    const step1 = new MessageEmbed()
    .setColor('#2F3136')
    .setImage("https://cdn.discordapp.com/attachments/890620618918215720/890620630670659624/unknown.png")
    .setTitle('Paso 1')
    .setDescription('Proporcione un **código de autorización**, puede obtener uno **[aqui](https://www.epicgames.com/id/login?redirectUrl=https%3A%2F%2Fwww.epicgames.com%2Fid%2Fapi%2Fredirect%3FclientId%3D3446cd72694c4a4485d81b77adbb2141%26responseType%3Dcode)**.\n\nTutorial:\n1. Inicie sesión con su cuenta alternativa, la que vaya a ser para el bot\n2. Copia lo que se indica en la siguiente imagen\n3. Envia por aqui el codigo');

    const step2 = new MessageEmbed()
    .setColor('#2F3136')
    .setTitle('Paso 2')
    .setDescription('Proporcione el **estado** que desea que tenga el bot, envíe `0` si desea que el bot no tenga ningún estado.')

    const step3 = new MessageEmbed()
    .setColor('#2F3136')
    .setTitle('Paso 3')
    .setDescription('Proporcione el **mensaje** cuando que desea que su bot envíe una vez que alguien se una a la sala, envíe `0` si no desea que el bot mande ningún mensaje.')

    const step4 = new MessageEmbed()
    .setColor('#2F3136')
    .setTitle('Paso 4')
    .setDescription('Proporcione **su nombre de usuario de Epic**, esto servira para que te demos permisos de administrador, asi puedas controlar el bot sin problemas.')

    const step5 = new MessageEmbed()
    .setColor('#2F3136')
    .setTitle('Paso 5')
    .setDescription('¿Quieres que **todo el mundo** pueda utilizar el bot? Si es así, responde "yes", de lo contrario responde "no".')

    const msg = await message.channel.send(step1);

    const data = {
        ownedBy: message.author.id,
        sleeping: false,
    }

    const auth_code = await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 });
    
    let auth = auth_code.first().content;

    if (auth.includes('?code=')) {
        auth = auth.split('=')[1].split('"')[0];
    } else {
        auth = auth;
    }

    await msg.edit(null, step2);

    let status = await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 40000 }).catch(() => {
        return failEmbed('No respondiste a tiempo, operación cancelada.', message);
    });

    if (status.first().content === '0') {
        status.first().content = null;
    }

    data.status = status.first().content;

    await msg.edit(null, step3);

    let joinMessage = await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 40000 }).catch(err => {
        return failEmbed('No respondiste a tiempo, operación cancelada.', message);
    });

    if (joinMessage.first().content === '0') {
        joinMessage.first().content = null;
    }

    data.joinMessage = joinMessage.first().content;

    await msg.edit(null, step4);

    const owner = await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 40000 }).catch(err => {
        return failEmbed('No respondiste a tiempo, operación cancelada.', message);
    });

    data.owner = owner.first().content;

    await msg.edit(null, step5);

    let public = await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 40000 }).catch(err => {
        return failEmbed('No respondiste a tiempo, operación cancelada.', message);
    });

    const answers = [
        'y',
        'n',
        'yes',
        'no',
        'si',
        'ye',
        
    ];

    if (!answers.includes(public.first().content.toLowerCase())) {
        return failEmbed('Tienes que indicar "Si" o "No", repita todo el proceso.', message);
    }

    if (public.first().content.toLowerCase() === 'Y' || public.first().content.toLowerCase() === 'yes') {
        public.first().content = true;
    } else {
        public.first().content = false;
    }

    data.public = public.first().content;

    const Options = {
        status: data.status !== '0' ? data.status : null,
        debug: false,
        keepAliveInterval: 30,
        auth: {}
    }

    Options.auth.authorizationCode = auth;

    const embed_ = new MessageEmbed()
    .setColor('#2F3136')
    .setTitle(`${emoji.loading} Creando bot...`)
    
    await msg.edit(null, embed_);

    try {
        let error = false;
        const x = new Client(Options);

        x.on('ready', async () => {
            const goodLogin = new MessageEmbed()
            .setColor('#2F3136')
            .setTitle(`${emoji.good} ¡El bot esta listo como: ${x.user.displayName}, enhorabuena! Mira la guia enviando: -comandos-fn`)
            if (!error) await msg.edit(null, goodLogin);
            if (!error) API.handleCommands(client, x, BotModel);
        });

        x.on('deviceauth:created', async da => {
            data.accountId = da.accountId;
            data.deviceId = da.deviceId;
            data.secret = da.secret;

x.on("friend:request", async (PendingFriend) =>{
      await PendingFriend.accept()
    })

            const op = {
                grant_type: 'device_auth',
    account_id: data.accountId,
                device_id: data.deviceId,
                secret: data.secret
            };

            const res = await axios.post(endpoints.OAUTH_TOKEN, stringify(op), {
                headers: {
                    Authorization: `Basic ${tokens.iosToken}`
                }
            }).catch(err => { return console.log(err) });

            const token = res.data.access_token;
            const account_id = res.data.account_id;

            const p = await axios.post(`https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/profile/${account_id}/client/QueryProfile?profileId=athena&rvn=-1`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).catch(err => { return console.log(err) });

            const lvl = p.data.profileChanges[0].profile.stats.attributes.accountLevel;

            if (lvl > 10) {
                const embed = new MessageEmbed()
                .setColor('#2F3136')
                .setTitle(`${emoji.bad} Vaya, ha ocurrido un error`)
                .setDescription(`Introduciste un codigo de autorización de una cuenta que es mayor de nivel 10, nivel asignado: ${lvl}, procura que hayas iniciado sesion en https://epicgames.com con la cuenta de tu bot.`)
                error = true;
                return (await msg.edit(null, embed));
            }

            const c = new BotModel(data);
            await c.save();
        });

        await x.login();
    } catch {
        const failLogin = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${emoji.bad} Introduciste un código de autorización inválido o ha expirado, soporte: https://discord.link/huguitis`)
        await msg.edit(null, failLogin);
    }
}
    
module.exports.conf = {
    name: 'create',
    description: 'Crea un bot para Fortnite.',
    category: 'fortnite',
    aliases: ['start', 'c', 'createbot', 'crear'],

    usage: 'create',
    example: 'create',

    dmOnly: false,
    guildOnly: false,
    ownerOnly: false
}