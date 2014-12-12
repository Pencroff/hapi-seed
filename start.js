/**
 * Created by sergii.danilov on 09/12/2014.
 */

/*global __dirname: true, require: true*/

var Path = require('path');
var Boom = require('boom');
var Hapi = require('hapi');
var hapiConfig = require('./plugins/hapi-config');
var server = new Hapi.Server();

server.views({
    engines: {
        jade: require('jade')
    },
    defaultExtension: 'jade',
    //path: '/views'
    path: __dirname + '/views',
    compileOptions: {
        pretty: true
    }
});

var web = server.connection({
    port: 3000,
    host: 'localhost',
    labels: ['web']
});
var admin = server.connection({ port: 3001, host: 'localhost', labels: ['admin'] });

web.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        return reply.view('main/main');
    }
});

web.route({
    method: 'GET',
    path: '/login',
    handler: function (request, reply) {
        return reply.view('login/login');
    }
});

web.route({
    method: 'POST',
    path: '/login',
    handler: function (request, reply) {
        return reply.redirect('/app');
    }
});

web.route({
    method: 'GET',
    path: '/app',
    handler: function (request, reply) {
        return reply.view('app/index');
    }
});

admin.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});

web.route({
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
        directory: {
            path: './static',
            index: 'false',
            listing: 'false'
        }
    }
});

web.route({
    method: 'GET',
    path: '/{path*}',
    handler: function (request, reply) {
        var context = {
                error: 'Page not found',
                details: 'Path: ' + request.path
            };
        return reply.view('404', context);
    }
});

//server.start(function () {
//    console.log('Server running at:', server.info.uri);
//});


console.log('Server plugins');
console.log(__dirname);

server.register({
        register: hapiConfig,
        options: {
            someFlag: true
        }
    }, function (err) {
        if (err) {
            server.log('error', err);
            throw err; // something bad happened loading the plugin
        }
    }
);


server.register({
    register: require('good'),
    options: {
        opsInterval: 1000,
        reporters: [{
            reporter: require('good-console'),
            args:[{ log: '*', response: '*' }]
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