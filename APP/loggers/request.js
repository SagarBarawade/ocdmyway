/**
 * This file contains all services provide by logger
 */
var config = require('config');
var path = require('path');
var winston = require('winston');
var expressWinston = require('express-winston');
var MongoDB = require('winston-mongodb').MongoDB;
var logger = require('./general');
// var _ = require('lodash');
//var skipKey = require('key-del')

var url = 'mongodb://' + config.get('db-analytics.host') + '/' + config.get('db-analytics.name');

//specifies which parameters to log
function requestFilter(req, propName) {
    switch (propName) {
        case "headers":
            return skipKey(req[propName], ['connection', 'accept', 'accept-encoding', 'accept-language', 'cookie', 'if-none-match', 'token', 'origin', 'referer', 'content-type']);
            break;
        case "body":
            var bodyObjectToWrite = skipKey(req[propName], 'password');
            return bodyObjectToWrite;
            break;
        case "originalUrl":
            return undefined;
        case "httpVersion":
            return undefined; 
        default:
            return req[propName];
    }
}

var transports = [new winston.transports.MongoDB({
        db: url, // from configuration file
        collection: 'RequestLogs', // defaults to 'log'.
        name: "requestLogs"
    }),
    new winston.transports.DailyRotateFile({
        name: "requestFileLogs",
        storeHost: true,
        filename: path.join(__dirname, "../logs", "log_file.log"),
        handleExceptions: true
    })
];

expressWinston.requestWhitelist.push('body');
var requestLogger = expressWinston.logger({
    transports: transports,
    requestFilter: requestFilter
});

module.exports = requestLogger;