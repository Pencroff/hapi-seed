/**
 * Created by sergii.danilov on 09/12/2014.
 */

var Hapi = require('hapi');
var Good = require('good');
var server = new Hapi.Server(3000);

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});

//server.start(function () {
//    console.log('Server running at:', server.info.uri);
//});

server.pack.register({
    plugin: Good,
    options: {
        reporters: [{
            reporter: require('good-console'),
            args:[{ log: '*', request: '*' }]
        }]
    }
}, function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});