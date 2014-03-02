/*
 * moduleInit.js
 * Copyright (C) 2014 Kurten Chan <chinkurten@gmail.com>
 *
 * Distributed under terms of the MIT license.
 */
var logger = require('../../app/util/logger');

module.exports = function(app, config) {

	//init log folder
	var log4js = config.get('log4js');
	if (!!log4js) {
	    for (var i = 0; i < log4js['appenders'].length; i++) {  //reset log path
	        var fn = log4js['appenders'][i].filename;
	        if (!!fn) {
	            log4js['appenders'][i].filename = config.get('app_base') + 
	            	fn.replace('port', config.get('port'));
	        }
	    }
	    config.set('log4js', log4js);
	}

	logger.configure(config.get('log4js'));

	//db and other init
};
