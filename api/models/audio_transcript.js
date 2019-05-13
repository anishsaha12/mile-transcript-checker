const mongoose = require('mongoose');

const audioTransSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    wav_file_name: {type: String},
    trans_text: {type: String},
    user_id: {type: String},
    edit_flag: {type: Number},
    language_id: {type: Number},
    edit_score: {type: Number}
});

module.exports = mongoose.model('AudioTranscript', audioTransSchema, 'audioTransDataCollection');