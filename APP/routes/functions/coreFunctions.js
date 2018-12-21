const shuffle = require('shuffle-array');
const mongoose = require('mongoose');
const momenttimezone = require('moment-timezone'); //timestamp zone
const moment = require('moment'); //timestamp

const coreFunctions = {};

const relationsArrayJSON = require('../../_app/cards.json');
const gameModel = require('../../models/games');

coreFunctions.shuffleCards = (dataObject) => {

    return new Promise((resolve, reject) => {
        let CardsObject = shuffle(relationsArrayJSON.cardsArray);
        resolve(CardsObject);
    });
};

coreFunctions.saveGameToDatabase = (dataObject, shuffledCards) => {

    return new Promise((resolve, reject) => {

        newGame = new gameModel({
            userId: mongoose.Types.ObjectId(dataObject.userId),
            raw: shuffledCards,
            timeStarted: parseInt(moment(momenttimezone().tz("Asia/Kolkata").format()).unix()),
        });

        newGame.save((err, results) => {
            if (err)
                reject({ message: 'An error occurred ' + JSON.stringify(err), status: 'error', statusCode: 500 });
            else {
                let responseObject = {};
                responseObject.gameId = String(results._id);
                responseObject.raw = results.raw;

                resolve({ message: 'Operation Successful', status: 'success', data: responseObject, statusCode: 200 });
            }
        });
    });
};

coreFunctions.getLastSavedGame = (dataObject, callback) => {

    let userId = (typeof (dataObject.userId == 'object') ? dataObject.userId : mongoose.Types.ObjectId(dataObject.userId));

    gameModel.findOne({ 'userId': userId, 'status': 1, 'activeStatus': 1 }, (err, results) => {
        if (err)
            callback({ message: 'An error occurred ' + JSON.stringify(err), status: 'error', statusCode: 500 });
        else if (results == null)
            callback({ message: 'No existing game available. Click NEW GAME to begin', status: 'error', statusCode: 404 });
        else {
            let responseObject = {};
            responseObject.gameId = String(results._id);
            responseObject.raw = results.raw;

            callback(null, { message: 'Operation Successful', status: 'success', data: responseObject, statusCode: 200 });
        }
    });
};

coreFunctions.checkIfPreviousGameExists = (dataObject) => {

    return new Promise((resolve, reject) => {

        let find = { 'userId': mongoose.Types.ObjectId(dataObject.userId), 'status': 1, 'activeStatus': 1 };
        let update = { 'status': 0 };
        let multi = { multi: true };

        gameModel.update(find, update, multi, (err) => {
            if (err)
                reject({ message: 'An error occurred ' + JSON.stringify(err), status: 'error', statusCode: 500 });
            else
                resolve(dataObject);
        });
    });

}

coreFunctions.pullObject = (dataObject) => {

    return new Promise((resolve, reject) => {

        rawObject = {};
        rawObject[dataObject.cardNo] = 'image/PNG/' + dataObject.cardNo + '.png';

        let find = { '_id': mongoose.Types.ObjectId(dataObject.gameId), 'userId': mongoose.Types.ObjectId(dataObject.userId), 'status': 1, 'activeStatus': 1 };
        let update = { '$pull': { 'raw': rawObject } };

        gameModel.updateOne(find, update, (err) => {
            if (err)
                reject({ message: 'An error occurred ' + JSON.stringify(err), status: 'error', statusCode: 500 });
            else
                resolve();
        });
    });
};

coreFunctions.pushObject = (dataObject) => {

    return new Promise((resolve, reject) => {

        var find = { '_id': mongoose.Types.ObjectId(dataObject.gameId), 'userId': mongoose.Types.ObjectId(dataObject.userId), 'status': 1, 'activeStatus': 1 };


        let conditionObject = {};
        let innerObject = {};
        innerObject[dataObject.cardNo] = 'image/PNG/' + dataObject.cardNo + '.png';
        conditionObject[dataObject.card] = innerObject;
        console.log(conditionObject);
        console.log(find);
        gameModel.findOne(find, (err, result) => {
            if (err) {

                reject({ message: 'An error occurred ' + JSON.stringify(err), status: 'error', statusCode: 500 });
            } else {

                var rawLength = result.raw.length;
                let update = (rawLength == 0) ? { '$addToSet': conditionObject, 'status': 2 } : { '$addToSet': conditionObject };

                gameModel.updateOne(find, update, (err) => {
                    if (err)
                        reject({ message: 'An error occurred ' + JSON.stringify(err), status: 'error', statusCode: 500 });
                    else
                        resolve(null, { message: 'Operation Successful', status: 'success', statusCode: 200 });
                });
            }
        });
    });
};

module.exports = coreFunctions;