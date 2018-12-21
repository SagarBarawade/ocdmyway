const authTokenService = require('../services/authTokenService');

const configurationMiddleware = {};

configurationMiddleware.tokenMiddleware = (req, res, callback) => { // Allow access request from any computers

    let modules = req.headers["module"];
    if (modules == 'signup' || modules == 'login') {
        next();
    } else {
        var authToken = req.headers["authtoken"];
        var userId = req.headers["userid"];

        if (authToken && userId) {
            data = {};
            data.authToken = authToken.trim();
            data.userId = userId.trim();

            authTokenService.verifyToken(data, function (err) {
                if (err)
                    callback(err);
                else
                    callback(null);
            });
        }
    }
}

module.exports = configurationMiddleware;