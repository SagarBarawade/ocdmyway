const crypto = require('crypto'); //md5 encryption
const mongoose = require('mongoose');
//---------------------------------------------------------------------------------------------------------------------------
const usersModel = require('../../models/users');
const authTokenModel = require('../../models/authtoken');
//---------------------------------------------------------------------------------------------------------------------------
const userDBFunctions = {};

userDBFunctions.checkIfUserAlreadyRegistered = (ParamsObject, callback) => {

    usersModel.find({ 'username': ParamsObject.username, 'activeStatus': 1 }, (err, userRow) => {
        if (err)
            callback({ message: JSON.stringify(err), status: 'error', statusCode: '404' });
        else if (userRow.length > 0)
            callback({ message: 'You are already Registered! Please login', status: 'error', statusCode: '304' });
        else
            callback(null);
    });
};

userDBFunctions.getUserDataByUserId = (ParamsObject, callback) => {

    let userId = (typeof (ParamsObject.userId) == 'object') ? ParamsObject.userId : mongoose.Types.ObjectId(ParamsObject.userId);

    usersModel.findOne({ '_id': userId, 'activeStatus': 1 }, (err, userRow) => {
        if (err)
            callback({ message: JSON.stringify(err), status: 'error', statusCode: '404' });
        else if (userRow == null)
            callback({ message: 'No user with this username exist or you may have access blocked! contact administrator', status: 'error', statusCode: '404' });
        else {
            let data = [{
                name: userRow.name, username: userRow.username, image: userRow.image,
                skills: userRow.skills, email: userRow.email, mobile: userRow.mobile
            }];
            callback(null, { message: 'Operation successful', data: data, status: 'success', statusCode: 200 });
        }
    });
};

userDBFunctions.editUserDataByUserId = (ParamsObject, callback) => {

    let userId = (typeof (ParamsObject.userId) == 'object') ? ParamsObject.userId : mongoose.Types.ObjectId(ParamsObject.userId);

    let find = { '_id': userId, 'activeStatus': 1 };

    let update = {};

    update[ParamsObject.field] = (ParamsObject.field == 'skills') ? JSON.parse(ParamsObject.value) : ParamsObject.value;

    console.log(update);

    usersModel.updateOne(find, update, (err) => {
        if (err)
            callback({ message: JSON.stringify(err), status: 'error', statusCode: '404' });
        else
            callback(null, { message: 'Operation Successful', status: 'success', statusCode: 200 });
    });
};

userDBFunctions.getUserDataByUserName = (ParamsObject, callback) => {

    usersModel.findOne({ 'username': ParamsObject.username, 'activeStatus': 1 }, (err, userRow) => {
        if (err) {

            callback({ message: JSON.stringify(err), status: 'error', statusCode: '404' });
        } else if (userRow == null) {

            callback({ message: 'No user with this username exist or you may have access blocked! contact administrator', status: 'error', statusCode: '404' });
        } else {
            let password = crypto.createHash('md5').update(ParamsObject.password).digest("hex");

            if (userRow.password !== password)
                callback({ message: 'Username/Password combination mismatched!', status: 'error', statusCode: '304' });
            else
                callback(null, userRow);
        }
    });
};

userDBFunctions.addUser = (ParamsObject, callback) => {

    let newUser = new usersModel({
        username: ParamsObject.username,
        password: crypto.createHash('md5').update(ParamsObject.password).digest("hex"),
        name: ParamsObject.name
    });

    newUser.save((err, result) => {
        if (err)
            callback({ message: JSON.stringify(err), status: 'error', statusCode: '404' });
        else
            callback(null, { data: result._id });
    });

};

userDBFunctions.logoutUser = (ParamsObject, callback) => {

    authTokenModel.remove({ 'authToken': ParamsObject.authToken, activeStatus: 1 }, (err) => {
        if (err)
            callback({ message: JSON.stringify(err), status: 'error', statusCode: 500 });
        else
            callback(null, { message: 'You are logged out!', status: 'success', statusCode: 200 });
    });
};

userDBFunctions.updateImageData = (ParamsObject, callback) => {

    let ObjectForInsertion = {
        imageLink: '/images/' + ParamsObject.fileName, image: ParamsObject.fileCount, isDefault: 'NO'
    };

    let objectId = (typeof (ParamsObject.userId) == 'object') ? ParamsObject.userId : mongoose.Types.ObjectId(ParamsObject.userId);
    let Condition, Update;

    if (!ParamsObject.imageId) {
        Condition = { '_id': objectId, activeStatus: 1 };
        Update = { '$addToSet': { 'image': ObjectForInsertion } };
    } else {
        Condition = { '_id': objectId, 'image._id': mongoose.Types.ObjectId(ParamsObject.imageId), activeStatus: 1 };
        Update = { '$set': { 'image.$.imageLink': '/images/' + ParamsObject.fileName } };
    }

    // console.log(Condition);
    // console.log(Update);

    usersModel.findOne(Condition).update(Update, (err) => {
        if (err)
            callback({ message: JSON.stringify(err), status: 'error', statusCode: 500 });
        else
            callback(null, { message: 'File upload/update successful', status: 'success', statusCode: 200 });

    });
};

userDBFunctions.updateDefaultImage = (ParamsObject, callback) => {

    let objectId = (typeof (ParamsObject.userId) == 'object') ? ParamsObject.userId : mongoose.Types.ObjectId(ParamsObject.userId);
    let Condition = { '_id': objectId, activeStatus: 1 };

    usersModel.findOne(Condition, (err, result) => {
        if (err) {
            callback({ message: JSON.stringify(err), status: 'error', statusCode: 500 });
        } else {

            let imageArray = result.image;
            let targetArray = [];

            imageArray.forEach((object) => {

                if (String(object._id) == ParamsObject.imageId) {
                    object.isDefault = 'YES';
                    targetArray.push(object);
                } else {
                    object.isDefault = 'NO';
                    targetArray.push(object);
                }
            });

            result.image = targetArray;

            result.save((err) => {
                if (err)
                    callback({ message: JSON.stringify(err), status: 'error', statusCode: 500 });
                else
                    callback(null, { message: 'Default Set!', status: 'success', statusCode: 200 });
            });
        }
    });
};

module.exports = userDBFunctions;