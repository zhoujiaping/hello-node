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
	const result = await db.doInTransaction(async function(err,client){//这种写法的好处是业务逻辑封装起来了，和业务逻辑之外的内容写在外面。
		const {rows} = await client.query('select * from sys_user where id=$1',[req.params.id]);
		return rows[0];
	});
	res.send(result);
	
	/*db.getClient(async (err,client,done)=>{
		const {rows} = await client.query('select * from sys_user where id=$1',[+req.params.id]);
		client.release();
		res.send(rows[0]);
	});*/
	/*const client = await db.getClient();
	const {rows} = await client.query('select * from sys_user where id=$1',[+req.params.id]);
	client.release();
	res.send(rows[0]);*/
});
router.get('/',(req,res,next)=>{
	const result = await db.doInTransaction(async (err,client)=>{
		const {rows} = await client.query('select * from sys_user where status=$1',[0]);
		return rows;
	});
	res.send(result);
});
router.post('/',(req,res,next)=>{
	const result = await db.doInTransaction(async (err,client)=>{
		const body = req.body;
		const {rows} = await client.query('insert into sys_user(name,password,nick,create_time,status)values($1,$2,$3,now(),0)',
			[body.name,body.password,body.nick]);
		return rows[0];
	});
	res.send(result);
});
router.delete('/:id',(req,res,next)=>{
	const result = await db.doInTransaction(async (err,client)=>{
		const {rows} = await client.query('delete from sys_user where id=$1',[req.body.id]);
		return rows[0];
	});
	res.send(result);
});
router.patch('/:id',(req,res,next)=>{
	res.header('status',500);
	res.send('method patch is not supported');
});
router.put('/:id',(req,res,next)=>{
	const result = await db.doInTransaction(async (err,client)=>{
		const body = req.body;
		const {rows} = await client.query('update sys_user set name=$1,password=$2,nick=$3,status=$4 where id=$5',
			[body.name,body.password,body.nick,body.status,body.id]);
		return rows[0];
	});
	res.send(result);
});

module.exports = router;
