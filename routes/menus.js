const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/',async (req,res,next)=>{
	//insert one menu
	const count = await db.doInTransaction(async (err,client)=>{
		const {rows} = await client.query('insert into sys_menu(name,parent_id,url)',[req.body.name,req.body.parent_id,req.body.url]);
		return rows[0];
	});
	res.send(count);
});
router.delete('/:id',async (req,res,next)=>{
	//delete one menu
	const count = await db.doInTransaction(async (err,client)=>{
		const {rows} = await client.query('delete from sys_menu where id=$1',[req.body.id]);
		return rows[0];
	});
	res.send(count);
});
router.put('/:id',async (req,res,next)=>{
	//update one menu
	const count = await db.doInTransaction(async (err,client)=>{
		const body = req.body;
		const {rows} = await client.query('update sys_menu set name=$1,parent_id=$2,url=$3 where id=$4',
			[body.name,body.parent_id,body.url,body.id]);
		return rows[0];
	});
	res.send(count);
});
router.get('/',async (req,res,next)=>{
	//select menus
	const rows = await db.doInTransaction(async (err,client)=>{
		const {rows} = await client.query('select * from sys_menu',[]);
		return rows;
	});
	res.send(rows);
});
module.exports = router;
