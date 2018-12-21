const express = require('express');
const router = express.Router();
const multer = require('multer');
const os = require('os');

const userService = require('./services/userService');
//-------------------------------------------------------------------------------------------------------
/* GET users listing. */
router.get('/profile/:userId', (req, res, next) => {

  let ParamsObject = { userId: req.params.userId };

  userService.getUserData(ParamsObject, (err, result) => {
    if (err)
      res.json(err);
    else
      res.json(result)
  });
});
//-------------------------------------------------------------------------------------------------------
/* GET users listing. */
router.post('/profile/update/', (req, res, next) => {

  userService.editUserData(req.body, (err, result) => {
    if (err)
      res.json(err);
    else
      res.json(result)
  });
});
//-------------------------------------------------------------------------------------------------------
/* GET users listing. */
router.post('/profile/set/image/', (req, res, next) => {
  multer({
    dest: os.tmpdir() + '/',
    limits: { files: 1 }
  }, next());
}, (req, res, next) => {

  //console.log(req.body);
  //console.log(req);

  userService.uploadImage(req.body, req.files, (err, result) => {
    if (err)
      res.json(err);
    else
      res.json(result)
  });
});
//-------------------------------------------------------------------------------------------------------
/* GET users listing. */
router.post('/profile/set/default-image/', (req, res, next) => {

  userService.setDefaultProfileImage(req.body, (err, result) => {
    if (err)
      res.json(err);
    else
      res.json(result)
  });
});
module.exports = router;
