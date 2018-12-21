const events = require('events');
const EventEmitter = events.EventEmitter;
//-------------------------------------------------------------------------------------------------------
const tokenService = require('./authTokenService');
const serviceFunctions = require('../functions/userFunctions');
//-------------------------------------------------------------------------------------------------------
const authenticationService = {};
//-------------------------------------------------------------------------------------------------------
authenticationService.login = function (dataObject, callback) {

    let flowController = new EventEmitter();

    flowController.on('START', () => {

        serviceFunctions.getUserDataByUserName(dataObject, (err, result) => {
            if (err) {
                flowController.emit('ERROR', err);
            } else {
                flowController.emit('1', result);
            }
        });
    });

    flowController.on('1', (result) => {

        dataObject.userId = result._id;

        tokenService.generateToken(dataObject, (err, result) => {
            if (err)
                flowController.emit('ERROR', err);
            else
                flowController.emit('END', result);
        })
    });

    // Response could be modified separately here
    flowController.on('END', (resultJSON) => {

        callback(null, resultJSON);
    });

    // Common error handler
    flowController.on('ERROR', (errorJSON) => {

        callback(null, errorJSON);
    });

    flowController.emit('START');
};
//-------------------------------------------------------------------------------------------------------
authenticationService.signUp = (dataObject, callback) => {

    let flowController = new EventEmitter();

    flowController.on('START', () => {

        serviceFunctions.checkIfUserAlreadyRegistered(dataObject, (err) => {
            if (err)
                flowController.emit('ERROR', err);
            else
                flowController.emit('1');
        });
    });

    flowController.on('1', (previousData) => {

        serviceFunctions.addUser(dataObject, (err, result) => {
            if (err)
                flowController.emit('ERROR', err);
            else
                flowController.emit('2', result);
        });
    });

    flowController.on('2', (oldresult) => {

        dataObject.userId = oldresult.data;

        tokenService.generateToken(dataObject, (err, result) => {
            if (err)
                flowController.emit('ERROR', err);
            else
                flowController.emit('END', result);
        });
    });

    // Common error handler
    flowController.on('ERROR', (errorJSON) => {

        callback(null, errorJSON);
    });

    // Response could be modified separately here
    flowController.on('END', (resultJSON) => {

        callback(null, resultJSON);
    });

    flowController.emit('START');
};
//-------------------------------------------------------------------------------------------------------
authenticationService.logOut = (dataObject, callback) => {

    console.log(dataObject);

    serviceFunctions.logoutUser(dataObject, (err, result) => {
        if (err) {
            callback(err);
        } else {
            callback(null, result)
        }
    });
};

module.exports = authenticationService;