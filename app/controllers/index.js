/*
 * index.js
 * Copyright (C) 2014 Kurten Chan <chinkurten@gmail.com>
 *
 * Distributed under terms of the MIT license.
 */

exports.path = "/";
exports.fun = function(req, res) {
	res.render('index');
};
