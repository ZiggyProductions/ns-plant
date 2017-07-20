/**
 * Created by xgharibyan on 4/3/15.
 */

module.exports = {

    getList: function (type, callback) {
        redisClient.get('live_list_' + type, function (error, res) {
            if (!error) {
                callback({error: false, data: JSON.parse(res), message: 'success'});
            }
            else callback({error: true, message: error});
        });
    },

    getAllEvents: function (type, callback) {
        redisClient.hgetall('live_' + type, function (error, res) {
            if (!error && res) {
                callback({error: false, data: JSON.parse(JSON.stringify(res)), message: 'success'});
            }
            else callback({error: true, message: error});
        });
    },

    updateList: function (type, list, callback) {
        redisClient.set('live_list_' + type, JSON.stringify(list), function (error, res) {
            if (!error && res) {
                callback({error: false, data: res, message: 'success'});
            }
            else callback({error: true, message: error});
        });
    },
    
    getEvent: function (type, event_id, callback) {
        redisClient.hget('live_' + type, event_id, function (error, res) {
            if (!error) {
                callback({error: false, data: JSON.parse(res), message: 'success'});
            }
            else callback({error: true, message: error});
        });
    },

    setEvent: function (type, event, callback) {
        redisClient.hset('live_' + type, event.event_id, JSON.stringify(event), function (error, res) {
            if (!error) {
                callback({error: false, data: res, message: 'success'});
            }
            else callback({error: true, message: error});
        });
    },
    

    delEvent: function (type, event_id, callback) {
        redisClient.hdel('live_' + type, event_id, function (error, res) {
            if (!error) {
                callback({error: false, data: JSON.parse(res), message: 'success'});
            }
            else callback({error: true, message: error});
        });
    },

    clearAll: function (callback) {
        //redisClient.del('live_bm', function (error, res) {
        //    redisClient.del('live_tv', function (error, res) {
                callback("ok");
        //    })
        //})

/*
        redisClient.hkeys('live_bm', function (error, res) {
            if (!error && res) {
                var bm_events = JSON.parse(JSON.stringify(res));
                console.log("clearing events from redis ; length - ", bm_events.length);
                if(bm_events.length > 0) {
                    bm_events.forEach(function(item, key){
                        redisClient.hdel('live_bm', item, function (error, res) {
                            if (!error) {}
                            if(key == bm_events.length - 1) {
                                callback({error: false, message: ""});
                            }
                            //else
                        });
                    });
                }
                else {
                    callback({error: false, message: ""});
                }

                // redisClient.hkeys('live_tv', function (error, res) {
                //     if (!error && res) {
                //         var tv_events = JSON.parse(JSON.stringify(res));
                //         tv_events.forEach(function(item){
                //             redisClient.hdel('live_tv', item, function (error, res) {
                //                 if (!error) {
                //                     callback("ok");
                //                 }
                //                 else callback({error: true, message: error});
                //             });
                //         });
                //     }
                //     else callback({error: true, message: error});
                // });
            }
            else callback({error: true, message: error});
        });
*/
    },

    getShortCode: function(callback) {
        redisClient.get('live_short_code', function (error, res) {
            if (!error) {
                if(!JSON.parse(res)) {
                    redisClient.set('live_short_code', '1', function (error, res) {
                        if(!error) {
                            callback(1);
                        }
                        else {
                            callback({error: true, message: error});
                        }
                    });
                }
                else {
                    callback(JSON.parse(res));
                }
            }
            else callback({error: true, message: error});
        });
    },

    setShortCode: function(sc, callback) {
        redisClient.set('live_short_code', JSON.stringify(sc), function (error, res) {
            if(!error) {
                callback(sc);
            }
            else {
                callback({error: true, message: error});
            }
        });
    },

    getState: function(callback) {
        redisClient.get('bm_state', function (error, res) {
            if (!error) {
                if(!JSON.parse(res)) {
                    redisClient.set('bm_state', '{}', function (error, res) {
                        if(!error) {
                            callback({});
                        }
                        else {
                            callback({error: true, message: error});
                        }
                    });
                }
                else {
                    callback(JSON.parse(res));
                }
            }
            else callback({error: true, message: error});
        });
    },

    setState: function(sc, callback) {
        redisClient.set('bm_state', JSON.stringify(sc), function (error, res) {
            if(!error) {
                callback(sc);
            }
            else {
                callback({error: true, message: error});
            }
        });
    }

};
