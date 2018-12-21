var mongoose = require('mongoose');
var config = require('config');
var logger = require('../loggers/general');

mongoose.set("debug", process.env.NODE_ENV === 'development');

var dbConfigs = ['db-ocdapp'];
var dbConnections = new Array(mongoose.connection);
dbConnections = [];
var connections = {
    getConnection: function (dbConfig) {
        return dbConnections[dbConfigs.indexOf(dbConfig)];
    }
};


function connect(configName) {
    var url = 'mongodb://' + config.get(configName + '.host') + '/' + config.get(configName + '.name');
    var options = { useNewUrlParser: true };

    var connection = mongoose.createConnection(url, options);

    connection.on('error', console.error.bind(console, 'connection ' + configName + ' error:'));

    connection.on('close', function () {
        logger.log('connection closed');
    });

    connection.once('open', function (callback) {
        console.log('Connected to ' + configName);
        logger.info('Connected to ' + configName);
    });
    return connection;
}

dbConfigs.forEach(function (item) {
    dbConnections.push(connections[item] = connect(item));
});

module.exports = connections;