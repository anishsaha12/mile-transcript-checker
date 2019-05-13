const mongoose = require('mongoose');

const languageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    language_id: {type: Number},
    language_name: {type: String}
});

module.exports = mongoose.model('Language', languageSchema, 'languages');