/*
 * index.js
 * Copyright (C) 2014 Kurten Chan <chinkurten@gmail.com>
 * 
 * Distributed under terms of the MIT license.
 */
var express = require('express');
var appsec = require('../appSecurity');
/*
 * express app config set 
 * @param app {express Object}        created when boot
 * @param config {Configurable Object} load from config folder 
 */
module.exports = function(app, config) {
    require('./moduleInit')(app, config);  //self developed module init
    
	var cons = require('consolidate');  //set template engine
    app.engine('dust', cons.dust);
    app.use(appsec.csrf());
    // app.use(appsec.csp({ /* ... */}));
    app.use(appsec.xframe('SAMEORIGIN'));
    app.use(appsec.p3p(""));
    app.use(express.compress());
    app.use(express.static(config.get('app_base') + '/app/public'));
    app.set('port', config.get('port'));
    app.set('views', config.get('app_base') + '/app/views');
    app.set('view engine', 'dust');
    app.set('env', config.get('env'));
    app.enable('view cache');
    app.disable('trust proxy');
    app.disable('x-powered-by');
    if (config.get('env') === 'development') {
        app.use(express.logger('dev'));
        app.disable('view cache');
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
        var dust = require('dustjs-helpers');
        dust.optimizers.format = function(ctx, node) {
            return node;
        };
    }
    app.use(express.cookieParser('1234'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
};