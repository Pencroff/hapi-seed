/**
 * Created by Pencroff on 14.12.2014.
 */

var path = require('path'),
    root = __dirname,
    chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai"),
    expect = chai.expect;
chai.use(sinonChai);

var Hapi = require('hapi');

describe('Registration plugins', function () {
    var pluginManager = require('../common/pluginProvider'),
        config, server;
    beforeEach(function(done){
        server = new Hapi.Server();
        config = {
            basePath: root,
            'hapi-kea-config': {
                confPath: path.resolve(root, '../config')
            },
            '../test/fake-plugins/plugin-A': {
                optA: 'plugin-A'
            },
            '../test/fake-plugins/plugin-B': {
                optB: 'plugin-B'
            }
        };
        done();
    });
    afterEach(function(){
    });

    it('should require server', function (done) {
        expect(function () {
            pluginManager();
        }).to.throw('Plugin manager require server parameter');
        expect(function () {
            pluginManager(server);
        }).to.not.throw();
        done();
    });

    it('should be function returned promise if not used callback', function (done) {
        var result = pluginManager(server);
        expect(pluginManager).to.be.a('function');
        expect(result.then).to.be.a('function');
        expect(result.catch).to.be.a('function');
        done();
    });

    it('should be function returned promise if not used callback with options', function (done) {
        var result = pluginManager(server, {});
        expect(pluginManager).to.be.a('function');
        expect(result.then).to.be.a('function');
        expect(result.catch).to.be.a('function');
        done();
    });

    it('should use callback once without promise', function (done) {
        var callback = sinon.spy(),
            result = pluginManager(server, callback);
        setTimeout(function () {
            expect(result).to.be.an('undefined');
            expect(callback).to.have.been.callCount(1);
            done();
        }, 10);
    });

    it('should use callback once without promise and with options', function (done) {
        var callback = sinon.spy(),
            result = pluginManager(server, {}, callback);
        setTimeout(function () {
            expect(result).to.be.an('undefined');
            expect(callback).to.have.been.callCount(1);
            done();
        }, 10);
    });

    it('should register plugins from config and call callback', function (done) {
        var result = pluginManager(server, config, function () {
            expect(server.plugins['hapi-kea-config']).to.be.not.an('undefined');
            expect(server.plugins['plugin-a']).to.be.not.an('undefined');
            expect(server.plugins['plugin-b']).to.be.not.an('undefined');
            done();
        });
    });

    it('should register plugins from config with promise', function (done) {
        var result = pluginManager(server, config).then(function () {
            expect(server.plugins['hapi-kea-config']).to.be.not.an('undefined');
            expect(server.plugins['plugin-a']).to.be.not.an('undefined');
            expect(server.plugins['plugin-b']).to.be.not.an('undefined');
            done();
        });
    });
});
