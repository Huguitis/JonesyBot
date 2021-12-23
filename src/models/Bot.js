const { Schema, model } = require('mongoose'); // mongodb package

Bot = Schema({
    ownedBy: String,
    sleeping: Boolean,

    status: String,
    joinMessage: String,
    owner: String,
    public: Boolean,

    accountId: String,
    deviceId: String,
    secret: String
});

module.exports = model('Bot', Bot);