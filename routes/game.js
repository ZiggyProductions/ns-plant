var express = require('express');
var router = express.Router();
var connect = require('connect-ensure-login');

router.post('/', connect.ensureLoggedIn('/auth/login'), function(req, res, next) {
    if(req.session.views) req.session.views++; else req.session.views=1;
    console.log('SESSION',req.session);
    res.render('game', { title: 'Ziggy', user:req.user.id });
});
router.get('/', connect.ensureLoggedIn('/auth/login'), function(req, res, next) {
    if(req.session.views) req.session.views++; else req.session.views=1;
    console.log('SESSION',req.session);
    res.render('game', { title: 'Ziggy', user:req.user.id });
});

module.exports = router;
