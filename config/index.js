/*
 * index.js
 * Copyright (C) 2014 Kurten Chan <chinkurten@gmail.com>
 * 
 * Distributed under terms of the BSD license.
 */
vvar path = require('path'),
    basePath = path.normalize(path.join(__dirname, '/..')),
    env = process.env.NODE_ENV || 'development';

var config = {
    development: {
        app_base: basePath,
        name : 'kricy'
    },

    production: {
        app_base: basePath,
        name : 'kricy'
    }
};

var expConfig = config[env];
//载入除config之外的所有配置文件
var moduleLoader = require('../tools/moduleLoader');
moduleLoader.search(__dirname, function(path) {
    var vals = require(path)[env];
    for (var key in vals) {
        expConfig[key] = vals[key];
    }
}, function(name) {
    if (name.indexOf('index.js') != -1) {
        return false;
    }
    return true;
});
var Configuable = require('../tools/configuable');
module.exports = Configuable(expConfig);
