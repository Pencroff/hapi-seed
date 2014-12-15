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
    var pluginManager = require('../plugins'),
        server, mock, sandbox, registerStub;
    beforeEach(function(done){
        server = new Hapi.Server();
        mock = sinon.mock(server);
        done();
    });
    afterEach(function(){
        mock.restore();
    });

    it('should be function returned promise', function (done) {
        mock.expects('register').atLeast(0);
        var result = pluginManager(server);
        expect(pluginManager).to.be.a('function');
        expect(result.then).to.be.a('function');
        expect(result.catch).to.be.a('function');
        mock.verify();
        done();
    });

    it('should register plugins from config', function (done) {
        var pluginDir = path.join(root, 'fake-plugins');
            //result = pluginManager(exposeStub, {
            //    pluginA: {
            //        require: path.join(pluginDir, 'plugin-A')
            //    },
            //    pluginB: {
            //        require: path.join(pluginDir, 'plugin-B')
            //    }
            //});
        done();
    });
});
