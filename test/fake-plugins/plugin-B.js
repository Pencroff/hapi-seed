/**
 * Created by Pencroff on 14.12.2014.
 */

exports.register = function (server, options, next) {
    var plugin = {
        name: 'plugin-B',
        options: options
    };
    server.expose(plugin);

    next();
};

exports.register.attributes = {
    name: 'plugin-b',
    version: '0.0.0'
};