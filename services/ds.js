/**
 * Created by GAZ on 7/26/17.
 */
var Player = require('../models/player');
var DeepstreamServer = require('deepstream.io');

module.exports = {

        DSServer:undefined,
        init: function () {
            this.DSServer = new DeepstreamServer({
                host: 'localhost',
                port: process.env.DS_PORT_SELF,
                showLogo: false,
                auth: {type: 'none'},
                plugins: {
                    message: {
                        name: 'redis',
                        options: {
                            host: 'localhost',
                            port: 6379
                        }
                    }
                }
            })
            try {
                this.DSServer.start();
            } catch (err) {
                console.error(err);
            }
        },

        addPlayer: function(p){
            const player = this.DSServer.record.getRecord('players/'+p.id);
            player.set(p);
            // Player.findById(id).then(function(p) {
            //     player.set(p);
            // },(err)=>{console.error(err);done(err,null)});
        }
    }
