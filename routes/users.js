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
	const result = await db.doInTransaction(async function(err,client){//这种写法的好处是业务逻辑封装起来了，和web层的内容实现分离。
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
router.get('/',async (req,res,next)=>{
	const result = await db.doInTransaction(async (err,client)=>{
		const {rows} = await client.query('select * from sys_user where status=$1',[0]);
		return rows;
	});
	res.send(result);
});
router.post('/',async (req,res,next)=>{
	const result = await db.doInTransaction(async (err,client)=>{
		const body = req.body;
		const {rows} = await client.query('insert into sys_user(name,password,nick,create_time,status)values($1,$2,$3,now(),0)',
			[body.name,body.password,body.nick]);
		return rows[0];
	});
	res.send(result);
});
router.delete('/:id',async (req,res,next)=>{
	const result = await db.doInTransaction(async (err,client)=>{
		const {rows} = await Promise.all(client.query('delete from sys_user where id=$1',[req.body.id]),
			client.query('delete from sys_user_role where user_id=$1',[req.body.id])//删除用户时，同时删除用户角色关联
		);
		return rows[0];
	});
	res.send(result);
});
router.patch('/:id',async (req,res,next)=>{
	res.header('status',500);
	res.send('method patch is not supported');
});
router.put('/:id',async (req,res,next)=>{
	const result = await db.doInTransaction(async (err,client)=>{
		const body = req.body;
		const {rows} = await client.query('update sys_user set name=$1,password=$2,nick=$3,status=$4 where id=$5',
			[body.name,body.password,body.nick,body.status,body.id]);
		return rows[0];
	});
	res.send(result);
});
router.post('/:id/roles',async (req,res,next)=>{
	//给某用户关联角色一个角色
	const count = await db.doInTransaction(async (err,client)=>{
		const {rows} = await client.query('insert into sys_user_role_mid(user_id,role_id)values($1,$2)',[req.body.id,req.body.role_id]);
		return rows[0];
	});
	res.send(count);
});
router.post('/:id/roles/batch',async (req,res,next)=>{
	//给某用户关联多个角色
	const count = await db.doInTransaction(async (err,client)=>{
		const sql = [];
		const userId = req.body.id;
		const values = [];
		req.body.roleIds.forEach((item,index,array)=>{
			sql.push(`(${2*index+1},${2*index+2})`);
			values.push(userId);
			values.push(item);
		});
		const {rows} = await client.query('insert into sys_user_role_mid(user_id,role_id)values'+sql.join(','),values);
		return rows[0];
	});
	res.send(count);
});
router.delete('/:id/roles/:role_id',async (req,res,next)=>{
	//删除一个 用户-角色关联
	const count = await db.doInTransaction(async (err,client)=>{
		const {rows} = await client.query('delete from sys_user_role_mid where user_id=$1 and role_id=$2',[req.body.id,req.body.role_id]);
		return rows[0];
	});
	res.send(count);
});
router.delete('/:id/roles/batch',async (req,res,next)=>{
	//删除某个用户的所有角色关联
	const count = await db.doInTransaction(async (err,client)=>{
		const {rows} = await client.query('delete from sys_user_role_mid where user_id=$1',[req.body.id]);
		return rows[0];
	});
	res.send(count);
});
module.exports = router;
