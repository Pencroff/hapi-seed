/**
 * Created by Pencroff on 11.12.2014.
 */

var path = require('path'),
    expect = require('chai').expect,
    root = __dirname,
    Hapi = require('hapi'),
    hapiConfig = require('../plugins/hapi-config.js'),
    configManager = require('../plugins/config-manager.js');

describe('Hapi Config', function () {
    var server;

    beforeEach(function(done){
        server = new Hapi.Server();
        done();
    });

    it('should expose config-manager', function (done) {
        var options = {someFlag: true};
        server.register({
                register: hapiConfig,
                options: options
            }, function (err) {
                if (err) {
                    done(err);
                }
            }
        );
        expect(server.plugins['hapi-config']).to.exist;
        expect(server.plugins['hapi-config']).to.eql(configManager);
        done();
    });
    it('should setup by confPath options', function (done) {
        var testPath = path.join(root, './testConfigFiles'),
            options = { confPath: testPath };
        server.register({
                register: hapiConfig,
                options: options
            }, function (err) { if (err) { done(err); } }
        );
        expect(server.plugins['hapi-config'].has('web')).to.equal(true);
        expect(server.plugins['hapi-config'].get('web.port')).to.equal(4343);
        done();
    });

});