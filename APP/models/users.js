var mongoose = require('mongoose');
var connections = require('../_app/connections');
var dbConfName = 'db-ocdapp';

var userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    privateKey: String,
    name: String,
    mobile: Number,
    image: [{
        imageLink: String,
        image: Number,// 1 for first, 2 for second
        isDefault: String,
        //"_id": false// Will not add the _id field to object
    }],
    skills: [],
    version: { type: String, default: "v1" },
    activeStatus: { type: Number, default: 1 }
});

module.exports = connections[dbConfName].model("userModel", userSchema, 'users'); // Object - Its modeling - Its collection name