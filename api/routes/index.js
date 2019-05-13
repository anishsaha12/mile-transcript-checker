var express = require('express');
var router = express.Router();

const IndexController = require('../controllers/index');

/* GET home page. */
router.get('/', IndexController.home_page);

module.exports = router;
