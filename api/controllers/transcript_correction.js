const AudioTranscript = require("../models/audio_transcript");
const Language = require("../models/lanuage");
fs = require('fs');

exports.corrector_page_local = (req, res, next) => {
    let sess = req.session;
    var obj = { 
        title: 'Express',
        v_name: '',
        language_id: 0,
        language_name: '',
        audio_transcript_id: [],
        wav_file_name: [],
        trans_text: [],
        edit_flag: []
    };
    if(sess.user_ID) {
        // console.log(sess.user_ID);
        obj.v_name = sess.volunteer_username;
        obj.language_id = sess.language_id;

        AudioTranscript.find({ 
                user_id: sess.volunteer_username, 
                language_id: sess.language_id 
            },
            function(err,aud_transcripts ){
                if (err) {
                    return res.status(500).json({
                        message: "Server Error"
                    });
                }
                if (!aud_transcripts) {                
                    return res.status(404).send(`
                        <html>
                        <body>
                            <h2>No Transcripts Available to Correct!</h2>
                            <a href="/user/logout">Logout</a>
                        </body>
                        `
                    );
                }
                else{
                    for(i in aud_transcripts){
                        aud_trans = aud_transcripts[i];
                        obj.audio_transcript_id.push(aud_trans._id);
                        obj.wav_file_name.push(aud_trans.wav_file_name);
                        obj.trans_text.push(aud_trans.trans_text);
                        obj.edit_flag.push(aud_trans.edit_flag);
                    }
                    Language.findOne({ 
                            language_id: sess.language_id 
                        },
                        function(err,language ){
                            if (err) {
                                return res.status(500).json({
                                    message: "Server Error"
                                });
                            }
                            if (!language) {  
                                obj.language_name = "NA";

                                return res.render('transcript_correction_local', obj);
                            }else{
                                obj.language_name = language.language_name;
                                
                                return res.render('transcript_correction_local', obj);
                                // return res.render('transcript_correction', obj);
                            }
                        }
                    );
                }
            }
        ).sort({wav_file_name: 1});

    }else{
        // res.render('transcript_correction', obj);
        res.redirect('/');
    }
};

exports.corrector_page_online = (req, res, next) => {
    let sess = req.session;
    var obj = { 
        title: 'Express',
        v_name: '',
        language_id: 0,
        language_name: '',
        audio_transcript_id: [],
        wav_file_name: [],
        trans_text: [],
        edit_flag: []
    };
    if(sess.user_ID) {
        // console.log(sess.user_ID);
        obj.v_name = sess.volunteer_username;
        obj.language_id = sess.language_id;

        AudioTranscript.find({ 
                user_id: sess.volunteer_username, 
                language_id: sess.language_id 
            },
            function(err,aud_transcripts ){
                if (err) {
                    return res.status(500).json({
                        message: "Server Error"
                    });
                }
                if (!aud_transcripts) {                
                    return res.status(404).send(`
                        <html>
                        <body>
                            <h2>No Transcripts Available to Correct!</h2>
                            <a href="/user/logout">Logout</a>
                        </body>
                        `
                    );
                }
                else{
                    for(i in aud_transcripts){
                        aud_trans = aud_transcripts[i];
                        obj.audio_transcript_id.push(aud_trans._id);
                        obj.wav_file_name.push(aud_trans.wav_file_name);
                        obj.trans_text.push(aud_trans.trans_text);
                        obj.edit_flag.push(aud_trans.edit_flag);
                    }
                    Language.findOne({ 
                            language_id: sess.language_id 
                        },
                        function(err,language ){
                            if (err) {
                                return res.status(500).json({
                                    message: "Server Error"
                                });
                            }
                            if (!language) {  
                                obj.language_name = "NA";

                                return res.render('transcript_correction_online', obj);
                            }else{
                                obj.language_name = language.language_name;
                                
                                return res.render('transcript_correction_online', obj);
                                // return res.render('transcript_correction', obj);
                            }
                        }
                    );
                }
            }
        ).sort({wav_file_name: 1});

    }else{
        // res.render('transcript_correction', obj);
        res.redirect('/');
    }
};

exports.save_editted_transcript = (req, res, next) => {
    // console.log("Saved "+req.body.audio_transcript_id+", text: "+req.body.trans_text);
    let sess = req.session;
    if(sess.user_ID){
        AudioTranscript.findOneAndUpdate({ 
                _id: req.body.audio_transcript_id,
                user_id: sess.volunteer_username
            }, 
            {
                $set: { 
                    trans_text: req.body.trans_text,
                    edit_flag: 1
                }
            }, 
            {upsert:false, useFindAndModify:false}, 
            function(err, aud_transcript){
                if (err) {
                    return res.status(500).json({
                        message: "Server Error"
                    });
                }
                if (!aud_transcript) {                
                    return res.status(404).send(`
                        <html>
                        <body>
                            <h2>No Transcripts Available to Correct!</h2>
                            <a href="/user/logout">Logout</a>
                        </body>
                        `
                    );
                }
                else{
                    var txt_file_name = aud_transcript.wav_file_name.split('.')[0] + '.txt';
                    var txt_file_url = './public/transcripts/editted_text/'+txt_file_name;
                    fs.writeFile(txt_file_url, req.body.trans_text, 'utf-8', 
                        function (err) {
                            if (err) {
                                console.log(err);
                                return res.status(200).json({
                                    message: "Updated on DB, NOT in file",
                                    audio_transcript_id: req.body.audio_transcript_id,
                                    aud_transcript: aud_transcript
                                });
                            }else{
                                return res.status(200).json({
                                    message: "Updated",
                                    audio_transcript_id: req.body.audio_transcript_id,
                                    aud_transcript: aud_transcript
                                });
                            }
                        }
                    );
                }
            }
        );
    }else{
        res.status(401).json({
            message: "Unauthorized",
            status: 401,
            redirect: "/"
        });
    }
}