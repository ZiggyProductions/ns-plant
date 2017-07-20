/**
 * Created by GAZ on 6/30/17.
 */
/**
 * Created by GAZ on 3/17/17.
 */
module.exports = StorageService;
function StorageService(redis,knex) {
    return {
        leasePort: function () {
            return new Promise(function (fulfill, reject) {

                // loading nodes from redis
                redis.get('ns-nodes', function (error, res) {
                    if (!error) {

                        try{
                            var nodes = JSON.parse(res);
                            console.log(nodes);
                            if(nodes) {
                                // extracting used ports from node map
                                var used = _.pluck(_.filter(nodes,(n)=>{return n.connected === true}),'meta.ds.port');
                                // composing range based on config values
                                var pool = _.range(Number(process.env.DS_PORT_POOL_MIN), Number(process.env.DS_PORT_POOL_MAX));
                                // wiping out used ports and selecting the first element
                                var port = _.first(_.shuffle(_.difference(pool, used)));
                                if (port)
                                    fulfill({port: port});
                                else
                                    reject(new Error('No available ports found'));
                            }else{
                                var pool = _.range(Number(process.env.DS_PORT_POOL_MIN), Number(process.env.DS_PORT_POOL_MAX));
                                fulfill({port: _.first(_.shuffle(pool))});
                            }
                        }
                        catch(err){
                            console.error(err);
                            reject(err);
                        }

                    }
                    else {console.error(error);reject(error);}
                });

            });
        },
        saveNodes: function (data) {
            return new Promise(function (fulfill, reject) {

                // loading nodes from redis
                redis.set('ns-nodes', JSON.stringify(data), function (error, res) {
                    if (!error)
                        fulfill('Done');
                    else reject(error);
                });

            });
        }
    }
}