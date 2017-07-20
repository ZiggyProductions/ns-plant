/**
 * Created by GAZ on 7/1/17.
 */
//var Joi = require('joi');
//var extend = require('xtend')

//var Player = ModelBase.extend({
var Player = bookshelf.Model.extend({
    tableName: 'players'

},{
    findOrCreate: function (data) {
        return new Promise((F,R)=> {
            this.findByProviderId(data.id).then((p)=>{
                if(p)
                    F(p);
                else {
                    new Player(this.transform(data)).save().then(F, R);
                }
            },R);
        });
        // return this.findOne({providerId:data.id}, extend(options, { require: false }))
        //     .bind(this)
        //     .then(function (model) {
        //         var defaults = options && options.defaults;
        //         return model || this.create(extend(defaults, this.transform(data)), options);
        //     });
    },
    findOne: function(opts){
        return this.where(opts).fetch()
    },
    findById: function(id){
        return this.where({id: id}).fetch()
    },
    findByProviderId: function(id){
        return this.where({providerId: id}).fetch()
    },
    transform: function (data) {
        console.log(data)
        var name = data.displayName.split(' ');
        data.name = data.name ? data.name : {givenName:name[0],familyName:name[1]};

        data.providerId = data.id;
        data.firstName = data.name.givenName;
        data.lastName = data.name.familyName;
        data.username = data.username || data.displayName;
        delete data.name;
        delete data.id;
        delete data._json;
        return data;
    }
});
/*
    ,{

    // validate: {
    //     id: Joi.number(),
    //     provider: Joi.string(),
    //     displayName: Joi.string(),
    //     firstName: Joi.string(),
    //     lastName: Joi.string(),
    //     email: Joi.string(),
    //     password: Joi.string(),
    //     picture: Joi.string(),
    //
    // },

    findOrCreate: function (data, options) {
        return this.findOne({providerId:data.id}, extend(options, { require: false }))
            .bind(this)
            .then(function (model) {
                var defaults = options && options.defaults;
                return model || this.create(extend(defaults, this.transform(data)), options);
            });
    },





});

*/

module.exports = Player;