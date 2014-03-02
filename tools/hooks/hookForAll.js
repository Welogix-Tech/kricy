/*
 * hookForAll.js
 * Copyright (C) 2014 Kurten Chan <chinkurten@gmail.com>
 * 
 * Distributed under terms of the MIT license.
 */
var config = require('../../config');

exports.path = '*';
exports.fun = function (options, req, res, cb) {
    options['env'] = config.get('env');
    cb && cb(null, options);
};