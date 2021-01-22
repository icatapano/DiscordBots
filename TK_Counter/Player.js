const {Schema, model} = require('mongoose');

const Player = new Schema({
    name: String,
    count: { type: Number, default: 0 }
});

module.exports = model('Player', Player);