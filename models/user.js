/**
 * Created by andy <andy.sumskoy@gmail.com> on 09/12/13.
 */

var async = require("async");


var db, collection;

exports.init = function(){
    db = require("../config").db;
    collection = db.collection("user");
};


exports.findOrCreate = function(profile, callback){
    async.waterfall([

        function(callback){
            collection.findOne({passportId: profile.id, provider: profile.provider}, callback);
        },

        function(user, callback){
            if (user == null){
                collection.insert({passportId: profile.id, provider: profile.provider, name: profile.username, displayName: profile.displayName, profile: profile}, function(err, result){
                    callback(err, (result || [])[0]);
                });
            } else {
                callback(null, user);
            }
        }

    ], callback);
};

exports.findById = function(data, callback){
    collection.findOne({passportId: data.id, provider: data.provider}, callback);
};