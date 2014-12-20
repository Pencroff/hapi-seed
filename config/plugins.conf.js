/**
 * Created by Pencroff on 20.12.2014.
 */

var root = __dirname;
var path = require('path');
module.exports = {
    'hapi-kea-config': {
        confPath: path.resolve(root, './')
    },
    'good': {
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
};