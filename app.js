var argv = require('optimist').argv
require('./tools/boot')(argv.p || argv.port);