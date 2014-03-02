/*
 * boot.js
 * Copyright (C) 2014 Kurten Chan <chinkurten@gmail.com>
 * 
 * Distributed under terms of the MIT license.
 */
var express = require('express'),
    appsec = require('./appSecurity'),
    config = require('../config');
var moduleLoader = require('./moduleLoader');
var loadRenderHooks = require('./loadRenderHooks');

module.exports = function (port) {
    //创建web application以及绑定相关路由
    var app = express();
    console.log('boot server');
    if (!isNaN(port)) {
        config.set('port', port);
    }
    bootWeb(app, config);
    
    port = port || config.get('port');
    app.listen(port);

    console.log('server start on ' + port);
    console.log(app.get('env'));

    process.on("uncaughtException", function (err) {
        console.log("uncaughtException:" + err.stack);
    });
};

/**
 * 启动web服务
 */
function bootWeb(app, config) {
    app.configure(function () {
        require('./init')(app, config);
    });
    //自定义render函数
    loadRenderHooks.newAppRender(app, config.get('app_base') + '/tools/hooks');
    moduleLoader.loadMiddlewares(app, config.get('app_base') + '/app/middleware');   //自动载入中间件包括验证等
    moduleLoader.loadControllers(app, config.get('app_base') + '/app/controllers');   //自动载入controllers
}