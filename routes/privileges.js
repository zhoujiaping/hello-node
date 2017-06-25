const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/',async (req,res,next)=>{
	const rows = await db.doInTransaction(async (err,client)=>{
		const {rows} = await client.query('select * from sys_privilege',[]);
		return rows;
	});
	res.send(rows);
});
router.delete('/:id',async (req,res,next)=>{
	const count = await db.doInTransaction(async (err,client)=>{
		const {rows} = await client.query('delete from sys_privilege where id=$1',[req.query.id]);
		return rows[0];
	});
	res.send(count);
});
router.put('/:id',async (req,res,next)=>{
	const count = await db.doInTransaction(async (err,client)=>{note,pri,url,method
		const {rows} = await client.query('update sys_privilege set note=$1,pri=$2,url=$3,method=$4 where id=$5',
			[req.query.note,req.query.pri,req.query.url,req.query.method,req.query.id]);
		return rows[0];
	});
	res.send(count);
});
router.post('/',async (req,res,next)=>{
	const count = await db.doInTransaction(async (err,client)=>{
		const {rows} = await client.query('insert into sys_privilege(pri,note,url,method)values($1,$2,$3,$4)',
			[req.body.pri,req.body.note,req.body.url,req.body.method]);
		return rows[0];
	});
	res.send(count);
});

module.exports = router;
