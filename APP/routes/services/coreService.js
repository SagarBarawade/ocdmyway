const async = require('async');
const coreService = {};

const coreFunctions = require('../functions/coreFunctions');
//------------------------------------------------------------------------------------------------------
coreService.StartNewGame = (DataObject, callback) => {

    (async () => {
        try {
            let checkIfGameExists = await coreFunctions.checkIfPreviousGameExists(DataObject);
            let shuffledCards = await coreFunctions.shuffleCards(checkIfGameExists);
            let finalGame = await coreFunctions.saveGameToDatabase(DataObject, shuffledCards);

            callback(null, finalGame);
        } catch (err) {
            callback(err);
        };
    })();
};

coreService.getLastSavedGame = (DataObject, callback) => {

    coreFunctions.getLastSavedGame(DataObject, (err, results) => {
        if (err)
            callback(err);
        else
            callback(null, results);
    });
};

coreService.dropCardToCardHolder = (DataObject, callback) => {

    (async function () {
        try {
            let pullResult = await coreFunctions.pullObject(DataObject);
            let pushResult = await coreFunctions.pushObject(DataObject);
            callback(null, pushResult);
        } catch (err) {
            callback(err);
        };
    })();
};

module.exports = coreService;