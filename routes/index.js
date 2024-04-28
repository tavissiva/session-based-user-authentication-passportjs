var express = require('express');
var router = express.Router();
const { isAuth } = require('../src/utility');

/* GET home page. */
router.get('/', isAuth, function(req, res, next) {
  res.render('index');
});

module.exports = router;
