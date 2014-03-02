/*
 * errorHandler.js
 * Copyright (C) 2014 Kurten Chan <chinkurten@gmail.com>
 *
 * Distributed under terms of the MIT license.
 */

exports.handler = function(err, req, res, next) {
	var path = req.path;
	var params = !!req.params ? JSON.stringify(req.params) : '';
	var query = !!req.query ? JSON.stringify(req.query) : '';
	var body = !!req.body ? JSON.stringify(req.body) : '';
	console.error('request ' + path + ' internal server error[' + err.stack + '] params[' + params + '] query[' + query + '] body[' + body +']');
	if (req.is('json')) {
		res.json({status : 500, msg : 'internal server error'});
	} else {
		res.status(500).render('404');
	}
};