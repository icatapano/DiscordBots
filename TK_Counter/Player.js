const {Schema, model} = require('mongoose');

const Player = new Schema({
    _id: String,
    count: { type: Number, default: 0 }
});

module.exports = model('Player', Player);