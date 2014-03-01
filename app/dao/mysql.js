/*
 * mysql.js
 * Copyright (C) 2014 Kurten Chan <chinkurten@gmail.com>
 * 
 * Distributed under terms of the BSD license.
 */
var log = require("../util/logger").getLogger(__filename, process.pid);
var _poolModule = require('generic-pool');
var async = require('async');
var SqlClient = module.exports;
var inited = false;


SqlClient.init = function(config) {
    if (!config) {
        throw new Error("mysql config must not null!");
    }
    inited = true;
    this.pool = createMysqlPool(config);
}

SqlClient.insert = function (sql, args, cb) {
    return query(this.pool, sql, args, cb);
};

SqlClient.query = function (sql, args, cb) {
    return query(this.pool, sql, args, cb);
};

SqlClient.update = function (sql, args, cb) {
    return query(this.pool, sql, args, cb);
};

SqlClient.delete = function (sql, args, cb) {
    return query(this.pool, sql, args, cb);
};
/**
 * 执行事务
 * @param params {Array} example [{method : 'insert', sql : 'insert into xxx', args : [1, 'qq']}]
 * @param cb {Function} cb(success, result) -> success {bool}, result {Array} sql execute result
 */
SqlClient.transaction = function (params, cb) {
    if (!params) {
        return;
    }
    var pool = this.pool;
    pool.acquire(function(err, client) {
        if (!!err) {
            log.error('[sqlerror transaction]' + '[params:' + JSON.stringify(params) + '] error message:' + err.stack);
            return;
        }
        client.beginTransaction(function(err) {
            if (!!err) {
                cb && cb(false, err);
            }
            var tasks = [];
            params.forEach(function(val, i) {
                if (!!val.method && !!val.sql && !!val.args) {
                    (function(v) {
                        tasks.push(function(callback) {
                            client[v.method](v.sql, v.args, function(err, result) {
                                if (!!err) {
                                    client.rollback(function() {
                                        pool.release(client);
                                        callback(err, result);
                                    });
                                } else {
                                    callback(null, result);
                                }
                            });
                        });
                    })(val);
                }
            });
            async.series(tasks, function(err, results) {
                if (!!err) {
                    cb && cb(false, err);
                } else {
                    client.commit(function(err) {
                        if (!!err) { 
                            client.rollback(function() {
                                pool.release(client);
                                cb && cb(false, err);
                            });
                        } else {
                            pool.release(client);
                            cb && cb(true, results);
                        }
                    });
                }
            });
        });
    });
};

SqlClient.shutdown = function () {
    if (!inited) {
        return;
    }
    inited = false;
    this.pool.destroyAllNow();
};

SqlClient.safeShutdown = function() {
    if (!inited) {
        return;
    }
    inited = false;
    var spool = this.pool;
    spool.drain(function(){
        spool.destroyAllNow();
    });
};

/*
 * Create mysql connection pool.
 */
var createMysqlPool = function(mysqlConfig) {
    return _poolModule.Pool({
        name: 'mysql',
        create: function(callback) {
            var mysql = require('mysql');
            var client = mysql.createConnection({
                host: mysqlConfig.host,
                user: mysqlConfig.user,
                password: mysqlConfig.password,
                database: mysqlConfig.database,
                multipleStatements: true
            });
            client.insert = client.query;
            client.update = client.query;
            client.delete = client.query;
            callback(null, client);
        },
        destroy: function(client) {
            client.end();
        },
        max: 10,
        idleTimeoutMillis : 30000,
        log : false
    });
};
/**
 * 执行查询语句
 * @param pool {Object}
 * @param sql {String}
 * @param args {Array}
 * @param cb {Function}
 */
var query = function(pool, sql, args, cb){
    pool.acquire(function(err, client) {
        if (!!err) {
            log.error('[sqlerror:' + sql + ']' + '[args:' + JSON.stringify(args) + '] error message:' + err.stack);
            return;
        }
        client.query(sql, args, function(err, res) {
            pool.release(client);
            cb && cb(err, res);
        });
    });
};




