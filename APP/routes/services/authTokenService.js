const momenttimezone = require('moment-timezone');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const randomstring = require("randomstring");
const async = require('async');
//---------------------------------------------------------------------------------------------------------------------------
const authTokenModel = require('../../models/authtoken');
const userModel = require('../../models/users');
//---------------------------------------------------------------------------------------------------------------------------
const webAuthenticationTokenService = {};
//---------------------------------------------------------------------------------------------------------------------------
// Login & Signup Time Token
webAuthenticationTokenService.generateToken = (dataObject, callback) => {

    var consoleLog = 1;

    (consoleLog) ? console.log(dataObject) : '';

    var privateKey = randomstring.generate({
        length: 30, charset: 'alphanumeric'
    });
    var loginToken = jwt.sign({ userId: dataObject.userId, username: dataObject.username }, privateKey);

    let newToken = new authTokenModel({
        authToken: loginToken,
        timeModified: parseInt(moment(momenttimezone().tz("Asia/Kolkata").format()).unix())
    });

    newToken.save((err) => {
        if (err)
            callback({ message: "An error has occurred: " + JSON.stringify(err), status: 'error', statusCode: '404' });
        else {

            let userId = (typeof (dataObject.userId) == 'object') ? dataObject.userId : mongoose.Types.ObjectId(dataObject.userId);

            userModel.updateOne(
                { '_id': userId, activeStatus: 1 },
                { 'privateKey': privateKey },
                (err) => {
                    if (err)
                        callback(err);
                    else {
                        var data = {
                            status: 'success', statusCode: 200,
                            data: [{ token: loginToken, userId: userId }],
                            message: 'Welcome to Dashboard'
                        };
                        callback(null, data);
                    }
                });
        }
    });
};
//---------------------------------------------------------------------------------------------------------------------------
// Verify Token
webAuthenticationTokenService.verifyToken = (dataObject, callback) => {

    async.waterfall([
        (wcallback) => {
            // check if record availble or not
            authTokenModel.findOne({ authToken: dataObject.authToken, activeStatus: 1 }, (err, authRow) => {
                if (err) {
                    wcallback(err);
                } else {
                    wcallback(null, authRow);
                }
            });
        }, (authRow, wcallback) => {
            // get user details
            if (authRow == null) {

                wcallback({ message: "Session expired! Try login again.", status: 'error', statusCode: '404' });
            } else {

                userModel.findOne({ '_id': mongoose.Types.ObjectId(dataObject.userId), activeStatus: 1 }, (err, userRow) => {
                    if (err) {
                        wcallback(err);
                    } else {
                        wcallback(null, userRow);
                    }
                });
            }
        }, (userRow, wcallback) => {
            // verify the token
            jwt.verify(dataObject.authToken, userRow.privateKey, (err, decoded) => {
                if (err)
                    wcallback(err);
                else if (dataObject.userId != decoded.userId) {
                    console.log(dataObject.userId);
                    console.log(decoded);
                    console.log(userRow.privateKey);
                    wcallback({ message: "Authentication failed! Try login again.", status: 'error', statusCode: '404' });
                } else
                    wcallback(null);
            });
        }, (wcallback) => {
            // update the TTL parameter in mongodb 
            authTokenModel.updateOne(
                { authToken: dataObject.authToken, activeStatus: 1 },
                { timeModified: parseInt(moment(momenttimezone().tz("Asia/Kolkata").format()).unix()) },
                function (err) {
                    if (err)
                        wcallback({ message: "An error has occurred: " + JSON.stringify(err), status: 'error', statusCode: '404' });
                    else
                        wcallback(null);
                });
        }
    ], (err) => {
        if (err)
            callback(err)
        else
            callback(null, 'success')
    });
};

module.exports = webAuthenticationTokenService;