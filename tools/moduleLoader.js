/*
 * moduleLoader.js
 * Copyright (C) 2014 Kurten Chan <chinkurten@gmail.com>
 * 
 * Distributed under terms of the BSD license.
 */
var fs = require('fs');
var Path = require('path');
var self = exports;
/**
 * 遍历文件夹，获取并且绑定controller中导出的方法
 * 仅支持多级目录
 * controller导出的模式为
 * module.exports = {
 *     hello:{method:'get', path:'/hello', fun:function (req, res) { res.send('hello world'); }}
 * }
 * -------- or --------
 * exports.method = 'get';
 * exports.path = '/hello';
 * exports.fun = function (req, res) {
 *     res.send('hello world');  
 * }
 *
 */
self.loadControllers = function(app, path) {
    this.load(path, function(spath) {
        bindMod2App(app, spath);
    });
};
/**
 * 载入自定义中间件 例如 auth等
 * 导出模式(支持单个中间件中多个导出函数以及多级目录)
 * exports.auth = function(req, res, next) {
 *     next();  
 * }
 */
self.loadMiddlewares = function(app, path) {
    this.load(path, function(spath) {
        bindMiddleware2App(app, spath);
    });
};


/**
 * 绑定路由
 * @param app
 * @param subpath
 */
function bindMod2App(app, subpath) {
	var mod = require(subpath);
    if (!mod) {
        return;
    }
    // example mod => {method:'get', path:'/hello', fun:hello}
    if (!!mod.method && !!mod.path && !!mod.fun) {
        console.log(mod);
        app[mod.method](mod.path, mod.fun);
    } else {
        for (var key in mod) {
            var obj = mod[key];
            console.log("route type:["+obj.method+"] path:["+obj.path+"]");
            app[obj.method](obj.path, obj.fun);
        }
    }
}

/**
 * 绑定拦截器
 * @param app
 * @param subpath
 */
function bindMiddleware2App(app, subpath) {
    var mod = require(subpath);
    if (!mod) {
        return;
    }
    for (var key in mod) {
        if (key !== 'path') {
            var fun = mod[key];
            if (typeof fun === 'function') {
                if (!!mod.path) {
                    console.log("middleware:["+key+"] path: ["+mod.path+"]");
                    app.all(mod.path, fun);
                } else {
                    console.log("middleware:["+key+"]");
                    app.use(fun);
                }
            }
        }
    }
}
/**
 * 自定义载入以及定义回调
 * @param path{String|Array}     目标路径(可为String或者Array<String>)
 * @param cb{Function}     找到路径后的回掉函数
 * @param filter{Function} 过滤路径的filter函数
 * @param ext{String}      文件扩展名(默认为".js")
 */
self.load = function(path, cb, filter, ext) {
    if (!!path) {
        if (Array.isArray(path)) {
            path.forEach(function (spath) {
                self.search(spath, cb, filter, ext);
            });
        } else {
            self.search(path, cb, filter, ext);
        }
    }
};
/**
 * 递归获取目录路径
 * @param path{String}     目标路径
 * @param cb{Function}     找到路径后的回掉函数
 * @param filter{Function} 过滤路径的filter函数
 * @param ext{String}      文件扩展名(默认为".js")
 */
self.search = function(path, cb, filter, ext) {
    if (!ext) {
        ext = '.js|.coffee';
    }
    fs.readdirSync(path).filter(function(name) {
        if (!!filter && typeof filter == 'function') {
            return filter.call(filter, name);
        } 
        return true;
    }).forEach(function (file) {
        var subpath = Path.join(path, file);
        var stats = fs.statSync(subpath);
        if (stats.isFile() && endWiths(file, ext)) {
            subpath = basename(subpath, ext);
            cb && cb(subpath);
        } else {
            fs.readdirSync(subpath).filter(function(name) {
                if (!!filter && typeof filter == 'function') {
                    return filter.call(filter, name);
                } 
                return true;
            }).forEach(function(name) {
                var ssubpath = Path.join(subpath, name);
                var sstats = fs.statSync(ssubpath);
                if (sstats.isDirectory()) {
                    self.search(ssubpath, cb);
                } else if (endWiths(ssubpath, ext)) {
                    ssubpath = basename(ssubpath, ext);
                    cb && cb(ssubpath);
                }
            });
        }
    });
}

function basename(src, ext) {
    if (!!ext && ext.indexOf('|')) {
        var es = ext.split('|');
        for (var i = 0; i < es.length; i++) {
            var t = es[i];
            if (src.substr(src.length - t.length) == t) {
                return Path.basename(src, t);
            }
        }
    }
    return src;
}

function endWiths(src, ext) {
    if (!!ext && ext.indexOf('|')) {
        var es = ext.split('|');
        for (var i = 0; i < es.length; i++) {
            var t = es[i];
            if (src.substr(src.length - t.length) == t) {
                return true;
            }
        }
        return false;
    }
    return src.substr(src.length - ext.length) == ext;
}