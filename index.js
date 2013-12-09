/**
 * Created by ${USER} <andy.sumskoy@gmail.com> on ${DATE}.
 */

var config = require("./config");

var path = require('path');
var express = require('express');
var app = express();
var MongoStore = require('connect-mongo')(express);
var MongoClient = require('mongodb').MongoClient;

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var VKontakteStrategy = require('passport-vkontakte').Strategy;
var GoogleStrategy = require('passport-google').Strategy;

var UserModel = require("./models/user");

app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.session({
    secret: config.server.cookie.secret,
    store: new MongoStore(config.server.session)
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);
app.use(express.static(__dirname + '/static'));

passport.use(new VKontakteStrategy({
        clientID:     config.auth.vk.app_id,
        clientSecret: config.auth.vk.app_secret,
        callbackURL:  config.auth.url + "/auth/vkontakte/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        UserModel.findOrCreate(profile, function (err, user) {
            return done(err, user);
        });
    }
));

passport.use(new GoogleStrategy({
        returnURL: config.auth.url + '/auth/google/callback',
        realm: config.auth.url
    },
    function(identifier, profile, done) {
        UserModel.findOrCreate({id: identifier, provider: "google", name: profile.displayName, displayName: profile.displayName}, function(err, user) {
            done(err, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, {id: user.passportId, provider: user.provider});
});

passport.deserializeUser(function(data, done) {
    UserModel.findById(data, function(err, user) {
        done(err, user);
    });
});


app.all("*", function(req, res, next){
    if (req.user == null && !req.session.allow && req.url !== "/login" && req.url.indexOf("/auth") === -1 && path.extname(req.url) === ""){
        res.redirect("/login");
    } else {
        if (req.url === "/" ){
            req.url = "/index.html";
        }
        next();
    }
});

app.get('/auth/vkontakte', passport.authenticate('vkontakte'));
app.get('/auth/vkontakte/callback',
    passport.authenticate('vkontakte', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', successRedirect: '/' }));

app.get('/auth/simple', function(req, res){
    req.session.allow = true;
    res.redirect("/");
});

app.get("/login", function(req, res, next){
    req.url = "/login.html";
    next();
});
app.get('/logout', function(req, res){
    delete req.session.allow;
    req.logout();
    res.redirect('/login');
});

app.get('/user', function(req, res){
    res.send(req.user || {displayName: "Гость"});
});




app.use(function(err, req, res, next) {
    console.error(err);
    next(err);
});
app.use(function(err, req, res, next) {
    if (req.xhr) {
        res.send(500, err.toJSON());
    } else {
        next(err);
    }
});
app.use(function(err, req, res, next) {
    res.send(500, "Internal system error");
});

MongoClient.connect(config.db.url, function(err, db){
    if (err != null){
        console.error("Can not connect to mongodb ", err);
    } else {
        config.db = db;

        UserModel.init();

        app.listen(config.server.port, config.server.ip, function(){
            console.info('Listening on ' + config.server.ip + ':' + config.server.port);
        });
    }
});