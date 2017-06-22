var express = require('express');
var router = express.Router();
//const userService = require('../service/userService');
/* GET users listing. */
/*router.get('/', function(req, res, next) {
	//console.info(userService);
	userService.queryList(function(err,rows){
		res.send(rows);
	})
  //res.send('respond with a resource');
});*/
const db = require('../db/index');
router.get('/:id',(req,res,next)=>{
	db.doInTransaction(async function(err,client){
		const {rows} = await client.query('select * from sys_user where id=$1',[req.params.id]);
		res.send(rows[0]);
	});
});

module.exports = router;
