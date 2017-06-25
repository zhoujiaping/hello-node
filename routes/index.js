var express = require('express');
const router = express.Router();
const db = require('../db');
const session = require('express-session');
/* GET home page. */
router.get('/', function(req, res, next) {
	//res.render('index', { title: 'Express' });
	res.redirect('/index.html');
});

router.post('/login', async(req, res, next) => {
	const user = await db.doInTransaction(async(err, client) => {
		const { rows } = await client.query('select * from sys_user where name=$1 and password=$2', [req.body.name, req.body.password]);
		//res.send(rows[0]);
		
		return rows[0];
	});
	if(user) {
		/*const roles = await db.doInTransaction(async(err, client) => {
			const {rows} = await client.query('select * from sys_role left t1 join sys_user_role_mid t2 on t1.id=t2.role_id where t2.user_id=$1',
				[user.id]);
			return rows;
		});
		const pris = await db.doInTransaction(async(err, client) => {
			const sql = ['select * from sys_privilege t1 join sys_role_pri_mid t2 on t1.id=t2.pri_id where t2.role_id in ('];
			const values = [];
			roles.forEach((item,index,array)=>{
				sql.push(`$${index+1}`);
				values.push(item);
			});
			sql.push(')');
			const {rows} = await client.query(sql.join(','),values);
			return rows;
		});*/
		req.session.user = user;
		/*req.session.roles = roles;
		req.session.pris = pris;*/
		res.redirect('/index.html');
	} else {
		res.header('status',401);
		res.send('用户名或密码不正确');
	}
});
router.post('/logout', async (req, res, next) => {
	req.session.user = null;
	res.redirect('/login.html');
});
module.exports = router;