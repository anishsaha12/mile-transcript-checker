exports.home_page = (req, res, next) => {
    let sess = req.session;
    var obj = { 
        title: 'Express',
        v_name: ''
    };
    if(sess.user_ID) {
        // return res.redirect('/admin');
        console.log(sess.user_ID);
        obj.v_name = sess.volunteer_username;
    }
    res.render('index', obj);
};