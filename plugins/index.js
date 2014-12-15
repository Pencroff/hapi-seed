/**
 * Created by Pencroff on 10.12.2014.
 */
/*global module: true*/

var path = require('path'),
    root = __dirname,
    Promise = require("bluebird");

/**
 *
 * @param {object} server - hapi server
 * @param {object|function} options - options or callback
 * @param callback - callback if don't use Promise syntax
 * @returns {Promise} - not work
 */
module.exports = function (server, options, callback) {
    var promise = new Promise(function () { }),
        i = 0,
        pluginNumber = 2,
        synkCall = function (err) {
            if (err) {
                callback(err);
            }
            i += 1;
            if (i >= pluginNumber && typeof callback === 'function') {
                callback();
            }
        };
    server.register({
            register: require('hapi-kea-config'),
            options: {
                confPath: path.join(root, '../config')
            }
        }, synkCall);

    server.register({
        register: require('good'),
        options: {
            opsInterval: 5000,
            reporters: [{
                reporter: require('good-console'),
                args:[{ ops: '*', log: '*', response: '*' }]
            }]
        }
    }, synkCall);

    return promise;
};