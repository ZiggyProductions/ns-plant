/**
 * Created by GAZ on 6/28/17.
 */

var options = {
    port: process.env.NS_MONITOR_PORT,
    namespace: process.env.NS_MONITOR_NAMESPACE,
};
var server = require('@netshards/ns-monitor').server(options);
var clients = require('@netshards/ns-monitor').clients;
var hosts = require('@netshards/ns-monitor').hosts;
server.on('connection', (socket) => {
    socket.on('message', (name, cb) => {
        cb('done');
    });

    socket.on('meta', (data, cb) => {
        //console.log(socket);
        StorageService.saveNodes(clients).then(cb,cb);
    });

    socket.on('req-port', (os, cb) => {
        StorageService.leasePort().then(cb,cb);
    });


});

exports.server = server;
exports.clients = clients;
exports.hosts = hosts;