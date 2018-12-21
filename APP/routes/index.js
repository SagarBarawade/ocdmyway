var express = require('express');
var router = express.Router();
var authenticationService = require('./services/authenticationService');
//-------------------------------------------------------------------------------------------------------
// Login API
router.post('/login/', (req, res, next) => {

  authenticationService.login(req.body, (err, result) => {
    if (err)
      res.json(err);
    else
      res.json(result)
  });
});
//-------------------------------------------------------------------------------------------------------
// Logout API
router.post('/logout', (req, res, next) => {

  authenticationService.logOut(req.body, (err, result) => {
    if (err)
      res.json(err);
    else
      res.json(result)
  });
});
//-------------------------------------------------------------------------------------------------------
// Signup API
router.post('/signup/', (req, res, next) => {

  authenticationService.signUp(req.body, (err, result) => {
    if (err)
      res.json(err);
    else
      res.json(result)
  });
});
//-------------------------------------------------------------------------------------------------------
module.exports = router;
