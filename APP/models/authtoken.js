var mongoose = require('mongoose');
var connections = require('../_app/connections');
var dbConfName = 'db-ocdapp';

var authTokenSchema = mongoose.Schema({
    authToken: String,
    timeModified: Number,
    version: { type: String, default: "v1" },
    activeStatus: { type: Number, default: 1 }
});

authTokenSchema.index({ timeModified: 1 }, { expireAfterSeconds: 1800 });

module.exports = connections[dbConfName].model("authToken", authTokenSchema, 'authTokens'); // Object - Its modeling - Its collection name