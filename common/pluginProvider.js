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
 * @param {object|function} options - options for plugins or callback
 * @param callback - callback if don't use Promise syntax
 * @returns {Promise|undefined} - return promise if not used callback
 */
module.exports = function (server, options, callback) {
    var promisesArray = [],
        i = 0,
        resolvePluginPath = function (pluginName, base) {
            var result = pluginName;
            if (pluginName.indexOf('/') !== -1) {
                result = path.resolve(root, pluginName);
            }
            return result;
        },
        undef,
        basePath, promise,
        keys, len,
        plugin, option, pluginPath,
        pluginPromise;

    if (!server) {
        throw new Error('Plugin manager require server parameter', 'index');
    }
    if (!options) {
        options = {};
    }
    if (!callback && typeof options === 'function') {
        callback = options;
        options = {};
    }
    basePath = options.basePath;
    delete options.basePath;
    keys = Object.keys(options);
    len = keys.length;
    while (i < len) {
        plugin = keys[i];
        option = options[plugin];
        pluginPath = resolvePluginPath(plugin, basePath);
        pluginPromise = new Promise(function (resolve, reject) {
            server.register({
                register: require(pluginPath),
                options: option
            }, function (err) {
                if (err) {
                    reject(err);
                }
                resolve();
            })

        });
        promisesArray.push(pluginPromise);
        i += 1;
    }



    if (typeof callback === 'function') {
        Promise.all(promisesArray).then(function() {
            callback();
        }).catch(function (reason) {
            callback(reason);
        });
    } else {
        promise = Promise.all(promisesArray);
    }

    //server.register({
    //    register: require('hapi-kea-config'),
    //    options: {
    //        confPath: path.join(root, '../config')
    //    }
    //}, synkCall);
    //
    //server.register({
    //    register: require('good'),
    //    options: {
    //        opsInterval: 10000,
    //        reporters: [{
    //            reporter: require('good-console'),
    //            args:[{ log: '*', response: '*' }, {format: 'YYYY-MM-DD HH:mm:ss.SSS'}]
    //        }, {
    //            reporter: require('good-mongodb'),
    //            args: ['mongodb://localhost:27017/good-mongodb', {
    //                collection: 'ops-log',
    //                events: {
    //                    ops: '*'
    //                }
    //            }]
    //        }, {
    //            reporter: require('good-mongodb'),
    //            args: ['mongodb://localhost:27017/good-mongodb', {
    //                collection: 'full-log',
    //                events: {
    //                    'start': '*',
    //                    'stop': '*',
    //                    'request': '*',
    //                    'request-internal': '*',
    //                    'request-error': '*',
    //                    'response': '*',
    //                    'log': '*',
    //                    'error': '*'
    //                }
    //            }]
    //        }]
    //    }
    //}, synkCall);

    return promise;
};