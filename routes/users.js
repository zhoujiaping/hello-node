var express = require('express');
var router = express.Router();
const userService = require('../service/userService');
/* GET users listing. */
router.get('/', function(req, res, next) {
	//console.info(userService);
	userService.queryList(function(err,rows){
		res.send(rows);
	})
  //res.send('respond with a resource');
});

module.exports = router;
