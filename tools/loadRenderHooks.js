/*
 * loadRenderHooks.js
 * Copyright (C) 2014 Kurten Chan <chinkurten@gmail.com>
 * 
 * Distributed under terms of the BSD license.
 */
var log = require('../app/util/logger').getLogger(__filename, process.pid);
var async = require('async');
var moduleLoader = require('./moduleLoader');
var matchAll = "*";
/**
 * 渲染时需要添加options的hook
 */
var renderHooks = {};

exports.clearRenderHooks = function(key) {
    if (!!key) {
        delete renderHooks[key];
    } else {
        renderHooks = {};
    }
};

exports.loadRenderHooks = function(path) {
    moduleLoader.search(path, function(subpath) {
        var mod = require(subpath);
        if (!mod) {
            return;
        }
        // example mod => {path:'/hello', fun:hello}
        if (!!mod.path && !!mod.fun) {
            log.debug('render hook path:[' + mod.path + ']');
            renderHooks[mod.path] = mod.fun;
        } else {
            for (var key in mod) {
                var obj = mod[key];
                log.debug('render hook path:[' + obj.path + ']');
                renderHooks[obj.path] = obj.fun;
            }
        }
    });
};

exports.newAppRender = function(app, path) {
    this.loadRenderHooks(path);
    app.response.render = function(view, options, fn){
        var self = this
        , options = options || {}
        , req = this.req
        , app = req.app;
        // support callback function as second arg
        if ('function' == typeof options) {
            fn = options, options = {};
        }

        // merge res.locals
        options._locals = self.locals;
        // default callback to respond
        fn = fn || function(err, str){
            if (err) return req.next(err);
            self.send(str);
        };
        /**************************************************/
        // add by kurten 2014-1-21 
        var res = self;
        var hookForAll = renderHooks[matchAll];
        var hook = renderHooks[view];
        var hookArr = [];
        if (checkValid(hookForAll)) {
            hookArr.push(function(callback) {
                if (4 === hookForAll.length) {
                    hookForAll.call(null, options, req, res, callback);
                } else {
                    hookForAll.call(null, options, req, res);
                    callback(null, options);
                }
            });
        }
        if (checkValid(hook)) {
            hookArr.push(function(callback) {
                if (4 === hook.length) {
                    hook.call(null, options, req, res, callback);
                } else {
                    hook.call(null, options, req, res);
                    callback(null, options);
                }
            })
        }
        if (hookArr.length > 0) {
            async.parallel(hookArr, function(err, results) {
                if (!!err) {
                    log.error(err);
                }
                app.render(view, options, fn);
            });
            return;
        }
        /**************************************************/
        // render
        app.render(view, options, fn);
    };
};

function checkValid(hook) {
    return !!hook && typeof hook === 'function';
}
