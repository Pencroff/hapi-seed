/**
 * Created by Pencroff on 10.12.2014.
 */
/*global exports: true*/


exports.register = function (server, options, next) {
    next();
};

exports.register.attributes = {
    name: 'hapi-config',
    version: '0.0.1'
    //pkg: require('../package.json')
};