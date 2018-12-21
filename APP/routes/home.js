var express = require('express');
var router = express.Router();

const coreService = require('./services/coreService');

// Send fresh game | Restart game
router.put('/new/game/', (req, res, next) => {

  coreService.StartNewGame(req.body, (err, result) => {
    if (err)
      res.json(err);
    else
      res.json(result)
  });
});

// Check if exsiting game is available & send the same
router.get('/old/game/:userId/', (req, res, next) => {

  coreService.getLastSavedGame(req.params, (err, result) => {
    if (err)
      res.json(err);
    else
      res.json(result)
  });
});

module.exports = router;
