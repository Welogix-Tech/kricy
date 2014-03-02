/*
 * notfound.js
 * Copyright (C) 2014 Kurten Chan <chinkurten@gmail.com>
 *
 * Distributed under terms of the MIT license.
 */

exports.notfound = function(req, res, next) {
	var path = req.path;
	var params = !!req.params ? JSON.stringify(req.params) : '';
	var query = !!req.query ? JSON.stringify(req.query) : '';
	var body = !!req.body ? JSON.stringify(req.body) : '';
	console.error('request ' + path + ' not found error params[' + params + '] query[' + query + '] body[' + body +']');
	if (req.is('json')) {
		res.json({status : 404, msg : 'not found'});
	} else {
		res.status(404).render('404');
	}
}