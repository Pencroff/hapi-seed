/**
 * Created by sergii.danilov on 09/12/2014.
 */

/*global __dirname: true, require: true*/

var Path = require('path');
var Boom = require('boom');
var Hapi = require('hapi');
var server = new Hapi.Server();
var pluginProvider = require('./common/pluginProvider');
var pluginConfiguration = require('./config/plugins.conf');

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

admin.route({
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

server.route({
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


pluginProvider(server, pluginConfiguration).then(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    }).catch(function (reason) {
        throw reason; // something bad happened loading the plugins
    });

//pluginRegistration(server, function (err) {
//    if (err) {
//        throw err; // something bad happened loading the plugins
//    }
//
//    server.start(function () {
//        server.log('info', 'Server running at: ' + server.info.uri);
//    });
//});


