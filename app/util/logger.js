/*
 * logger.js
 * Copyright (C) 2014 Kurten Chan <chinkurten@gmail.com>
 * 
 * Distributed under terms of the BSD license.
 */
var log4js = require("log4js");
var path = require("path");
var _categoryName = "default";

function getLogger(fileName, pid) {
    var ctname = _categoryName;
    if (3 === arguments.length) {
        ctname = arguments[2];
    }
    var fileName = fileName || __filename;
    pid = pid || process.pid;
    return new Logger(ctname, fileName, pid);
}

function configure(config, categoryName) {
    log4js.configure(config);
    if (!!categoryName) {
        _categoryName = categoryName;
    }
}

module.exports = {
    getLogger : getLogger,
    configure : configure
};

function Logger(categoryName, fileName, pid) {
    this.fileName = path.basename(fileName);
    this.pid = pid;
    this.log = log4js.getLogger(categoryName);
    this.prestr = ["[", this.fileName, "] [", this.pid, "] "].join("");
}
Logger.prototype.info = function (msg) {
    if (typeof msg !== "string") {
        msg = JSON.stringify(msg);
    }
    this.log.info(this.prestr + msg);
};
Logger.prototype.trace = function (msg) {
    if (typeof msg !== "string") {
        msg = JSON.stringify(msg);
    }
    this.log.trace(this.prestr + msg);
};
Logger.prototype.debug = function (msg) {
    if (typeof msg !== "string") {
        msg = JSON.stringify(msg);
    }
    this.log.debug(this.prestr + msg);
};
Logger.prototype.warn = function (msg) {
    if (typeof msg !== "string") {
        msg = JSON.stringify(msg);
    }
    this.log.warn(this.prestr + msg);
};
Logger.prototype.error = function (msg) {
    if (typeof msg !== "string") {
        msg = JSON.stringify(msg);
    }
    this.log.error(this.prestr + msg);
};
Logger.prototype.fatal = function (msg) {
    if (typeof msg !== "string") {
        msg = JSON.stringify(msg);
    }
    this.log.fatal(this.prestr + msg);
};