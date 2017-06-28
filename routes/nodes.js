var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(_.toArray(ns.clients));
});
router.get('/alive', function(req, res, next) {
  res.send(_.filter(ns.clients,function(c){
    return c.connected;
  }));
});
router.get('/dead', function(req, res, next) {
  res.send(_.filter(ns.clients,function(c){
    return !c.connected;
  }));
});
router.get('/pid/:id', function(req, res, next) {
  res.send(_.filter(ns.clients,function(c){
    return c.meta.os.pid == req.params.id;
  }));
});
router.get('/sid/:id', function(req, res, next) {
  res.send(_.filter(ns.clients,function(c){
    return c.meta.socket_id == req.params.id;
  }));
});
router.get('/hosts', function(req, res, next) {
  var hosts = [];
  try{
    hosts = _.map(_.toArray(ns.hosts),(h)=>{
      h.processes = _.sortBy(_.map(h.processes,(p)=>{
        var process = {
          name: p.name,
          pid: p.pid,
          uptime: p.pm2_env.pm_uptime,
          restarts: p.pm2_env.restart_time,
          mem: p.monit.memory,
          cpu: p.monit.cpu
        }
        return process;
      }),(p)=>{
        return p.name;
      });
      return h;
    })
  }catch(err){}
  res.send(hosts);
});

module.exports = router;
