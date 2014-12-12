/**
 * Created by Pencroff on 10.12.2014.
 */
/*global exports: true*/


configManager = require('./config-manager.js');

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