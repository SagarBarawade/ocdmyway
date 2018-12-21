var mongoose = require('mongoose');
var connections = require('../_app/connections');
var dbConfName = 'db-ocdapp';

var OCDModel = mongoose.Schema({
    userId: mongoose.Types.ObjectId,
    raw: [],
    spade: [],
    heart: [],
    diamond: [],
    club: [],
    timeStarted: Number,// Timestamp
    timeFinished: Number,// Timestamp
    status: { type: Number, default: 1 },// 0 - cleared/left in between, 1 - active, 2 - completed
    version: { type: String, default: "v1" },
    activeStatus: { type: Number, default: 1 }// record status
});

module.exports = connections[dbConfName].model("OCDModel", OCDModel, 'ocdtests'); // Object - Its modeling - Its collection name