const moment = require('moment'); //timestamp
const events = require('events');
const EventEmitter = events.EventEmitter;
//-------------------------------------------------------------------------------------------------------
const userDBFunctions = require('../functions/userFunctions');
//-------------------------------------------------------------------------------------------------------
const userService = {};

userService.getUserData = (dataObject, callback) => {

    userDBFunctions.getUserDataByUserId(dataObject, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
};

userService.editUserData = (dataObject, callback) => {

    userDBFunctions.editUserDataByUserId(dataObject, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
};

userService.uploadImage = (reqObject, fileObject, callback) => {

    let object = {};
    object.userId = reqObject.userId;
    object.fileName = 'CAUPLOAD_' + moment(new Date()).format('DDMMYYYYHHMMSS') + reqObject.extension;
    object.fileCount = parseInt(reqObject.fileCount);
    object.filePath = './public/images/' + object.fileName;
    (reqObject.imageId) ? object.imageId = reqObject.imageId : '';

    let flowController = new EventEmitter();

    flowController.on('START', () => {

        require('fs').writeFile(object.filePath, fileObject.file.data, 'binary', (err) => {
            if (err)
                flowController.emit('ERROR', err);
            else
                flowController.emit('1');
        });
    });

    flowController.on('1', () => {

        userDBFunctions.updateImageData(object, (err, response) => {
            if (err)
                flowController.emit('ERROR', err);
            else
                flowController.emit('END', response);
        });
    });

    // Common error handler
    flowController.on('ERROR', (errorJSON) => {
        flowController.removeAllListeners()// Clears all the listeners
        callback(null, errorJSON);
    });

    // Response could be modified separately here
    flowController.on('END', (resultJSON) => {
        flowController.removeAllListeners()// Clears all the listeners
        callback(null, resultJSON);
    });

    flowController.emit('START');
};

userService.setDefaultProfileImage = (dataObject, callback) => {

    userDBFunctions.updateDefaultImage(dataObject, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

module.exports = userService;