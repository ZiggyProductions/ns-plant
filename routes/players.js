var express = require('express');
var router = express.Router();
var Player = require('../models/player');

router.get('/', function(req, res, next) {
  Player.fetchAll().then(function (collection) {
    res.send(collection);
  },(err)=>{res.send(err)});

});
module.exports = router;
