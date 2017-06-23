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
const db = require('../db');
router.get('/:id',async (req,res,next)=>{
	/*const result = await db.doInTransaction(async function(err,client){
		const {rows} = await client.query('select * from sys_user where id=$1',[req.params.id]);
		return rows[0];
	});
	res.send(result);*/
	
	/*db.getClient(async (err,client,done)=>{
		const {rows} = await client.query('select * from sys_user where id=$1',[+req.params.id]);
		client.release();
		res.send(rows[0]);
	});*/
	const client = await db.getClient();
	const {rows} = await client.query('select * from sys_user where id=$1',[+req.params.id]);
	client.release();
	res.send(rows[0]);
});
/*router.get('/',(req,res,next)=>{
	
});
router.post('/',(req,res,next)=>{
	db.doInTransaction();
});
router.delete();
router.patch();
router.put();*/

module.exports = router;
