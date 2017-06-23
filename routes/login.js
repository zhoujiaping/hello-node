const express = require('express');
const router = express.Router();
const db = require('../db');
const session = require('express-session');

router.post('/',(req,res,next)=>{
	db.doInTransaction(async (err,client)=>{
		const {rows} = await client.query('select * from sys_user where name=$1 and password=$2',[req.body.name,req.body.password]);
		//res.send(rows[0]);
		if(rows.length==0){
			res.redirect('/login.html');
		}else{
			req.session.user = rows[0];
			res.redirect('/index.html');
		}
	});
});
module.exports = router;
