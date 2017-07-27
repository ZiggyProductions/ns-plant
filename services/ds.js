/**
 * Created by GAZ on 7/26/17.
 */
var Player = require('../models/player');
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
                const endpoints = _.map(_.filter(ns.clients, function (c) {
                    return c.connected && c.meta.node == 'ns-cell';
                }), function (n) {
                    return n.meta.ds;
                });
                const endpoint = _.first(_.shuffle(endpoints));
                this.client = DeepstreamClient(endpoint.ip + ':' + endpoint.port).login({user: 'plant-client'});
            }catch(err){
                console.error(err);
            }

        },

        addPlayer: function(p){
            try {
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
