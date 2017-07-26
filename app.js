var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var ect = require('ect')({ watch: true, root: path.join(__dirname, 'views'), ext : '.ect' });

//Redis
var RedisStore = require('connect-redis')(session);
var session_store = new RedisStore({ host: 'localhost', port: 6379, client: redis});
// function redisLog(type) {
//     return function () {
//         var arguments = (typeof arguments != 'undefined') ? arguments : '';
//         //console.log(type, arguments);
//     }
// }
redis.select(2, function(err, res){ if(!err) 'Redis Client Set to 2 database'});
// redis.on('connect', redisLog('Redis Connection Opened ...'));
// redis.on('ready', redisLog('Redis Connection Ready ...'));
// redis.on('reconnecting', redisLog('Redis Connection Reconnecting ... '));
// redis.on('error', redisLog('Redis Connection Error ...'));
// redis.on('end', redisLog('Redis Connection End ...'));




var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ect');
app.engine('ect', ect.render);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//app.use(cookieParser());
app.use(session({
    key: 'zizi',
    secret: 'zizi',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, domain: 'localhost', maxAge: 60000000 },
    store: session_store,
    rolling : true
}));

global.passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    LocalStrategy = require('passport-local').Strategy;
    GitHubStrategy = require('passport-github2').Strategy;
var Player = require('./models/player');
var index = require('./routes/index');
var auth = require('./routes/auth');
var players = require('./routes/players');
var nodes = require('./routes/nodes');
var game = require('./routes/game');
var ds = require('./services/ds');
ds.init();

passport.serializeUser(function(player, done) {
    done(null, player.id);
});

passport.deserializeUser(function(id, done) {
    Player.findById(id).then(function(player) {
        done(null, player);
    },(err)=>{console.error(err);done(err,null)});
});

passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['link','cover','name','displayName','gender','email']
    },
    function(accessToken, refreshToken, profile, done) {
        Player.findOrCreate(profile).then((player)=>{
            console.log('yes')
            ds.addPlayer(player);
            done(null, player);
        },(err)=>{
            console.error('no',err);
            return done(err);
        });
    }
));

passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
        Player.findOrCreate(profile).then((player)=>{
            console.log('yes')
            ds.addPlayer(player);
            done(null, player);
        },(err)=>{
            console.error('no',err);
            return done(err);
        });
    }
));

passport.use(new LocalStrategy({
    passReqToCallback: true},
    function(req, username, password, done) {
        console.log(username, password)
        Player.findOne({username: username}).then((player)=> {
            console.log(player);
            if (!player) {
                return done(null, false, {message: 'Incorrect username.'});
            }
            if (!player.validPassword(password)) {
                return done(null, false, {message: 'Incorrect password.'});
            }
            ds.addPlayer(player);
            return done(null, player);
        }, (err)=> {
            console.error('no', err);
            return done(err);
        });
    }
));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use('/', index);
app.use('/auth', auth);
app.use('/nodes', nodes);
app.use('/players', players);
app.use('/game', game);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.PROFILE == 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',res.locals);
});

module.exports = app;
