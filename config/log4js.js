/*
 * log4js.js
 * Copyright (C) 2014 Kurten Chan <chinkurten@gmail.com>
 *
 * Distributed under terms of the MIT license.
 */
module.exports = {
	development : {
		log4js: {
	        "appenders": [
	            {
	                "category": "kricy",
	                "type": "dateFile",
	                "filename": "/log/kricy-port.log",
	                "maxLogSize": 4194304,
	                "backups": 3,
	                "pattern": "-yyyy-MM-dd",
	                "alwaysIncludePattern": false
	            },
	            {
	                "type": "console"
	            }
	        ],
	        "replaceConsole": true,
	        "levels": {
	            "kricy": "DEBUG"
	        }
	    }
	},
    production : {
    	log4js: {
	        "appenders": [
	            {
	                "category": "kricy",
	                "type": "dateFile",
	                "filename": "/log/kricy-port.log",
	                "maxLogSize": 4194304,
	                "backups": 3,
	                "pattern": "-yyyy-MM-dd",
	                "alwaysIncludePattern": false
	            },
	            {
	                "type": "console"
	            }
	        ],
	        "replaceConsole": true,
	        "levels": {
	            "kricy": "DEBUG"
	        }
	    }
    }
}
