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
        server, sandbox, exposeStub;
    beforeEach(function(done){
        server = new Hapi.Server();
        //sandbox = sinon.sandbox.create();
        //exposeStub = sandbox.stub(server, 'register');
        done();
    });
    afterEach(function(){
        //sandbox.restore();
    });

    it('should be function returned promise', function (done) {
        //var result = pluginManager();
        //expect(pluginManager).to.be.a('function');
        //expect(result.then).to.be.a('function');
        //expect(result.catch).to.be.a('function');
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
