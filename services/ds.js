/**
 * Created by GAZ on 7/26/17.
 */
var Player = require('../models/player');
var os = require('os');
//var DeepstreamServer = require('deepstream.io');
var DeepstreamClient = require('deepstream.io-client-js');

module.exports = {

//        DSServer:undefined,
        client:undefined,
        init: function () {
            // var self = this;
            // this.DSServer = new DeepstreamServer({
            //     host: 'localhost',
            //     port: process.env.DS_PORT_SELF,
            //     showLogo: false,
            //     auth: {type: 'none'},
            //     plugins: {
            //         message: {
            //             name: 'redis',
            //             options: {
            //                 host: 'localhost',
            //                 port: 6379
            //             }
            //         }
            //     }
            // })
            // try {
            //     this.DSServer.on('started',function(){
            //         self.client = DeepstreamClient('localhost:'+process.env.DS_PORT_SELF).login({ user: 'plant-client' });
            //     })
            //     this.DSServer.start();
            // } catch (err) {
            //     console.error(err);
            // }
            try {

                var net = os.networkInterfaces();
                var myip;
                _.each(net,function(ifaces){
                    _.each(ifaces,function (iface) {
                        if(iface.internal == false && iface.family == 'IPv4')
                            myip = iface.address;
                    })
                })

                const endpoint = _.first(_.shuffle(_.map(_.filter(ns.clients, function (c) {
                    return c.connected && c.meta.node == 'ns-cell' && c.meta.ds.ip == myip;
                }), function (n) {
                    return n.meta.ds;
                })));
                this.client = DeepstreamClient(/*endpoint.ip + */'localhost:' + endpoint.port).login({user: 'plant-client'});
            }catch(err){
                console.error(err);
            }

        },

        addPlayer: function(p){
            try {
                if(!this.client)
                    this.init();
                const player = this.client.record.getRecord('players/'+p.id);
                player.set(p);
            }catch(err){
                console.error(err);
            }
            // Player.findById(id).then(function(p) {
            //     player.set(p);
            // },(err)=>{console.error(err);done(err,null)});
        }
    }
