var express = require('express');
var router = express.Router();
var connect = require('connect-ensure-login');

router.get('/login', function(req, res) {  res.render('login', { title: 'Ziggy Login', session:JSON.stringify(req.session) })});
router.get( "/logout", ( req, res ) => {
        if(req.isAuthenticated()) {
                req.logout();
                res.redirect('/game')
        }else{
                res.redirect('/game')
        }
} );

// FACEBOOK
router.get('/facebook', passport.authenticate('facebook',{scope:['public_profile']}));
router.get('/facebook/callback', passport.authenticate('facebook', { successReturnToOrRedirect: '/game', failureRedirect: '/game/login' }));

// GITHUB
router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/auth/login' }), function(req, res) { res.redirect('/game');});

router.post('/login', passport.authenticate('local', { failureRedirect: '/404' }),
    function(req, res) {
            res.redirect('/game');
    });
router.post('/register' ,
    function(req, res) {
            res.send('Not implemented');
});

module.exports = router;
