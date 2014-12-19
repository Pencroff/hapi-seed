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
    var promise,
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
    if (!callback && typeof options === 'function') {
        callback = options;
    }
    if (!callback) {
        promise = new Promise(function () { });
    }
    server.register({
        register: require('hapi-kea-config'),
        options: {
            confPath: path.join(root, '../config')
        }
    }, synkCall);

    server.register({
        register: require('good'),
        options: {
            opsInterval: 10000,
            reporters: [{
                reporter: require('good-console'),
                args:[{ log: '*', response: '*' }, {format: 'YYYY-MM-DD HH:mm:ss.SSS'}]
            }, {
                reporter: require('good-mongodb'),
                args: ['mongodb://localhost:27017/good-mongodb', {
                    collection: 'ops-log',
                    events: {
                        ops: '*'
                    }
                }]
            }, {
                reporter: require('good-mongodb'),
                args: ['mongodb://localhost:27017/good-mongodb', {
                    collection: 'full-log',
                    events: {
                        'start': '*',
                        'stop': '*',
                        'request': '*',
                        'request-internal': '*',
                        'request-error': '*',
                        'response': '*',
                        'log': '*',
                        'error': '*'
                    }
                }]
            }]
        }
    }, synkCall);

    return promise;
};