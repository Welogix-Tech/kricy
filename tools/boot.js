/*
 * boot.js
 * Copyright (C) 2014 Kurten Chan <chinkurten@gmail.com>
 * 
 * Distributed under terms of the BSD license.
 */
var express = require('express'),
    appsec = require('./appSecurity'),
    config = require('../config'),
    dbClient = require('../app/dao/mysql'),
    logger = require('../app/util/logger');
var path = require('path');
var moduleLoader = require('./moduleLoader');
var loadRenderHooks = require('./loadRenderHooks');

module.exports = function (ver, port) {
    //初始化db
    dbClient.init(config.db);
    //创建web application以及绑定相关路由
    var app = express();

    //初始化logger
    logger.configure(log4jsInit(config, 'web'));
    console.log('boot web server');
    bootWeb(app, config);
    var log = logger.getLogger(__filename, process.pid);
    global.console = log;
    global.console.log = global.console.debug;
    
    config.port = port || config.port;
    app.listen(config.port);
    log.debug('server start on ' + config.port);
    log.debug(app.get('env'));

    process.on("uncaughtException", function (err) {
        log.error("uncaughtException:" + err.stack);
    });
    process.on("SIGINT", function(){
        dbClient.safeShutdown();
    });
    process.on("exit", function(){
        dbClient.safeShutdown();
    });
};

function log4jsInit(config, folder) {
    for (var i = 0; i < config.log4js['appenders'].length; i++) {  //reset log path
        var fn = config.log4js['appenders'][i].filename;
        if (!!fn) {
            config.log4js['appenders'][i].filename = path.join(config.root, 'log', folder, fn.replace('port', config.port));
        }
    }
    return config.log4js;
}
/**
 * 启动web服务
 */
function bootWeb(app, config) {
    app.configure(function () {
        var cons = require('consolidate');
        app.engine('dust', cons.dust);
        app.use(appsec.csrf());
        // app.use(appsec.csp({ /* ... */}));
        app.use(appsec.xframe('SAMEORIGIN'));
        app.use(appsec.p3p("CP='CURa ADMa DEVa PSAo PSDo OUR BUS UNI PUR INT DEM STA PRE COM NAV OTC NOI DSP COR'"));
        app.use(express.compress());
        app.use(express.static(config.root + '/app/public'));
        app.set('port', config.port);
        app.set('views', config.root + '/app/views');
        app.set('view engine', 'dust');
        app.set('env', config.env);
        app.enable('view cache');
        app.disable('trust proxy');
        app.disable('x-powered-by');
        app.use(express.favicon(config.root + '/app/public/img/favicon.ico'));
        if (config.env === 'development') {
            app.use(express.logger('dev'));
            app.disable('view cache');
            app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
            var dust = require('dustjs-helpers');
            dust.optimizers.format = function(ctx, node) {
                return node;
            };
        }
        app.use(express.cookieParser('689de26d71b5be08f49ab57f8699c26c'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
    });
    //自定义render函数
    loadRenderHooks.newAppRender(app, config.root + '/tools/hooks/');
    moduleLoader.loadMiddlewares(app, config.root + '/app/middleware/web');   //自动载入中间件包括验证等
    moduleLoader.loadControllers(app, config.root + '/app/controllers');   //自动载入controllers
}