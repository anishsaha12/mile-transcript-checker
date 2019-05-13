const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    volunteer_username: { type: String, required: true },
    volunteer_password: { type: String, required: true },
    language_id: {type: Number}
});

module.exports = mongoose.model('User', userSchema, 'users');