/*
 * robots_txt.js
 * Copyright (C) 2014 Kurten Chan <chinkurten@gmail.com>
 *
 * Distributed under terms of the MIT license.
 */
var config = require('../../config');

exports.method = 'get';
exports.path = '/robots.txt';
exports.fun = function(req, res) {
	res.sendfile(config.get('app_base') + '/app/views/robots.txt');
};