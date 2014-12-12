/**
 * Created by Pencroff on 11.12.2014.
 */


var path = require('path'),
    conf = {},
    nestedFns = {},
    is = function (obj, type) {
        return typeof obj === type;
    },
    isObj = function (obj) {
        return is(obj, 'object') && obj !== null;
    },
    getNestedValue = function (obj, key) {
        'use strict';
        if (!key) return obj;
        var fn = getFnNestedValue(key);
        return fn(obj);
    },
    getFnNestedValue = function (key) {
        'use strict';
        if (!key) return function () {};
        var fn = nestedFns[key];
        if (!fn) {
            var parts = key.split('.'),
                body = new Array(parts.length),
                last = parts.pop(),
                len = parts.length;
            for (var i = 0; i < len; i += 1) {
                body[i] = "if (typeof (o = o." + parts[i] + ") === 'undefined') return o;";
            }
            body[i] = "return o." + last + ";";
            fn = Function("o", body.join('\n'));
            nestedFns[key] = fn;
        }
        return fn;
    },
    getLastNodeKey = function (key, obj) {
        'use strict';
        var keysArr = key.split('.'),
            lastKeyPart = keysArr.pop(),
            len = keysArr.length,
            i, k, objNext;
        for (i = 0; i < len; i += 1) {
            k = keysArr[i];
            objNext = obj[k];
            if (!isObj(objNext)) {
                objNext = obj[k] = {};
            }
            obj = objNext;
        }
        return {
            node: obj,
            key: lastKeyPart
        };
    },
    deepMerge = function (target, source) {
        'use strict';
        var isA, isB, prop;
        for (prop in source) {
            if (source.hasOwnProperty(prop)) {
                isA = isObj(target[prop]);
                isB = isObj(source[prop]);
                if (isA && isB) {
                    deepMerge(target[prop], source[prop]);
                } else if (!isA && !isB) {
                    target[prop] = source[prop];
                } else {
                    throw new Error('Node collision', 'ConfigManager');
                }
            }
        }
    };
module.exports = {
    /**
     * Full init config based on environment
     * @param {string} dirPath - path to folder with config
     */
    setup: function (dirPath) {
        'use strict';
        var me = this,
            env = process.env.NODE_ENV || 'development',
            mainPath = path.join(dirPath, 'main.conf'),
            envPath = path.join(dirPath, env + '.conf');
        me.init(mainPath);
        me.update(envPath);
        return me;
    },
    /**
     * ConfigManager initialization. Delete previous config.
     * @param {string} path - path to CommnJs module with configuration
     */
    init: function (path) {
        'use strict';
        var config = require(path);
        conf = JSON.parse(JSON.stringify(config));
        return this;
    },
    /**
     * Update exist configuration. Merge new config to exist. Throw exception if key for update not exist or have different type in original and configuration for update.
     * @param {string} path - path to CommnJs module with configuration
     */
    update: function (path) {
        'use strict';
        var updateConf = require(path);
        deepMerge(conf, updateConf);
        return this;
    },
    /**
     * Get 'value' of 'key'.
     * @param {string} key - key in configuration. Like 'simpleKey' or 'section.subsection.complex.key'. See ConfigManagerTest.js
     * @returns {*} value - 'value' of 'key'. Can be primitive or js object. Objects not connected to original configuration.
     */
    get: function (key) {
        'use strict';
        var value = conf[key], obj;
        if (key.indexOf('.') !== -1) {
            //obj = getLastNodeKey(key, conf);
            value = getNestedValue(conf, key);//obj.node[obj.key];
        }
        if (isObj(value)) {
            value = JSON.parse(JSON.stringify(value));
        }
        return value;
    },
    /**
     * Set 'value' for 'key'
     * @param {string} key - key in configuration. Like 'simpleKey' or 'section.subsection.complex.key'. See ConfigManagerTest.js
     * @param {*} value
     */
    set: function (key, value) {
        'use strict';
        var obj;
        if (key.indexOf('.') === -1) {
            conf[key] = value;
        } else {
            obj = getLastNodeKey(key, conf);
            obj.node[obj.key] = value;
        }
        return this;
    },
    /**
     * Check availability of key in configuration
     * @param key
     * @returns {boolean}
     */
    has: function (key) {
        'use strict';
        return !!this.get(key);
    }
};
