// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

const User = require("../models/user");

// exports.user_signup = (req, res, next) => {
//     User.find({ email: req.body.email })
//         .exec()
//         .then(user => {
//             if (user.length >= 1) {
//                 return res.status(409).json({
//                     message: "Mail exists"
//                 });
//             } else {
//                 bcrypt.hash(req.body.password, 10, (err, hash) => {
//                     if (err) {
//                         return res.status(500).json({
//                             error: err
//                         });
//                     } else {
//                         const user = new User({
//                             _id: new mongoose.Types.ObjectId(),
//                             email: req.body.email,
//                             password: hash
//                         });
//                         user
//                             .save()
//                             .then(result => {
//                                 console.log(result);
//                                 res.status(201).json({
//                                     message: "User created"
//                                 });
//                             })
//                             .catch(err => {
//                                 console.log(err);
//                                 res.status(500).json({
//                                     error: err
//                                 });
//                             });
//                     }
//                 });
//             }
//         });
// };

exports.user_login = (req, res, next) => {
    User.findOne({ 
            volunteer_username: req.body.v_name, 
            volunteer_password: req.body.v_password,
            language_id: req.body.v_lang_id 
        },
        function(err,user ){
            if (err) {
                return res.status(500).json({
                    message: "Server Error"
                });
            }
            if (!user) {                
                return res.status(401).json({
                    message: "Auth failed: "+req.body.v_name+", "+req.body.v_password+", "+req.body.v_lang_id
                });
            }
            req.session.user_ID = user._id;
            req.session.volunteer_username = user.volunteer_username;
            req.session.language_id = user.language_id;
            return res.status(200).json({
                message: "Logged in",
                user_ID: user._id
            });
        }
    );
};

exports.user_logout = (req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
    });
    req.session = null;
    res.redirect('/');
};

// exports.user_delete = (req, res, next) => {
//     User.remove({ _id: req.params.userId })
//         .exec()
//         .then(result => {
//             res.status(200).json({
//                 message: "User deleted"
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// };