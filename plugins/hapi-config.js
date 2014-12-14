/**
 * Created by Pencroff on 10.12.2014.
 */
/*global exports: true*/


configManager = configManager = require('kea-config');

exports.register = function (server, options, next) {
    if (options && options.confPath) {
        configManager.setup(options.confPath);
    }
    server.expose(configManager);

    next();
};

exports.register.attributes = {
    name: 'hapi-config',
    version: '0.0.1'
    //pkg: require('../package.json')
};