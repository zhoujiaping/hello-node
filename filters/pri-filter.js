const express = require('express');
const db = require('../db');
const router = express.Router();
//系统默认没有上下文，如果考虑上下文，需要修改相关代码。
router.all('/*',async (req,res,next)=>{
	if(req.originalUrl == '/login' || req.originalUrl == '/logout'){//登录注销不需要权限验证
		return next();
	}
	const url = req.originalUrl;
	const method = req.method;
	const pris = await db.doInTransaction(async (err,client)=>{
		const {rows} = await client.query('select t0.* from sys_privilege t0 left join sys_role_pri_mid t1 on t0.id=t1.pri_id left join sys_role t2 on t1.role_id = t2.id left join sys_user_role_mid t3 on t2.id = t3.role_id where t3.user_id=$1',
			[req.session.user.id]);
		return rows;
	});
	const hasPri = pris.some((item,index,array)=>{
		return item.method.toUpperCase() == method && new RegExp(item.url).test(url);
	});
	if(hasPri){
		next();
	}else{
		res.send(`has no privilege for the url:${url}`);
	}
});

module.exports = router;
