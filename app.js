var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var session = require('express-session');
var MemoryStore = require('memorystore')(session)
var logger = require('morgan');
var mongoose = require("mongoose");

var indexRouter = require('./api/routes/index');
var userRouter = require('./api/routes/user');
var transcriptRouter = require('./api/routes/transcript_correction');

var app = express();

mongoose.connect('mongodb://madhavarajaa:asdASD123$@ds153096.mlab.com:53096/audio_trans_correction_db', 
  {useNewUrlParser: true },
  function(err){
      if(err){
        console.log('Some problem with the connection ' +err);
      }else{
        console.log('The Mongoose connection is ready');
      }
  }
);

app.use(session({
  secret: 'SESSION_SECRET',
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  saveUninitialized: false,
  resave: false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/transcript-correction', transcriptRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;