/*
 * index.js
 * Copyright (C) 2014 Kurten Chan <chinkurten@gmail.com>
 * 
 * Distributed under terms of the MIT license.
 */
var path = require('path'),
    basePath = path.normalize(path.join(__dirname, '/..')),
    env = process.env.NODE_ENV || 'development';
var Configuable = require('../tools/configurable');

var config = {
    development: {
        app_base: basePath,
        name : 'kricy',
        port : 3000,
        env : env
    },

    production: {
        app_base: basePath,
        name : 'kricy',
        port : 3000,
        env : env
    }
};

var expConfig = config[env];
Configuable(expConfig);

//载入除config之外的所有配置文件
var moduleLoader = require('../tools/moduleLoader');
moduleLoader.search(__dirname, function(path) {
    var vals = require(path)[env];
    for (var key in vals) {
        expConfig.set(key, vals[key]);
    }
}, function(name) {
    if (name.indexOf('index.js') != -1) {
        return false;
    }
    return true;
});

module.exports = expConfig;
