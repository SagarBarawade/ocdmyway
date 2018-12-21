/**
 * This file contains all services provide by logger
 */
var config = require('config');
var path = require('path');
var winston = require('winston');
require('winston-daily-rotate-file');
var MongoDB = require('winston-mongodb').MongoDB;

var url = 'mongodb://' + config.get('db-log.host') + '/' + config.get('db-log.name');

var transports = [new winston.transports.MongoDB({
    db: url, // from configuration file
    level: config.get('logger.level'), // from configuration file
    collection: 'Logs', // defaults to 'log'.
    storeHost: true,
    name: "databaseLogs",
    handleExceptions: true
}),
new winston.transports.DailyRotateFile({
    name: "fileLogs",
    storeHost: true,
    level: config.get('logger.level'),
    filename: path.join(__dirname, "../logs", "log_file.log"),
    handleExceptions: true
})
];

if (config.get('logger.logOnConsole')) {
    transports.push(new (winston.transports.Console)({
        level: config.get('logger.level'),
        handleExceptions: true
    }));
}

var logger = winston.createLogger({
    transports: transports
});

logger.exitOnError = false;
module.exports = logger;