const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/',async (req,res,next)=>{
	//insert one role
	const count = await db.doInTransaction(async (err,client)=>{
		const {rows} = client.query('insert into sys_role(name,note)values($1,$2)',[req.body.name,req.body.note]);
		return rows[0];
	});
	res.send(count);
});
router.delete('/:id',async (req,res,next)=>{
	//delete one role
	const count = await db.doInTransaction(async (err,client)=>{
		const {rows} = client.query('delete from sys_role where id=$1',[req.body.id]);
		return rows[0];
	});
	res.send(count);
});
router.get('/:id',async (req,res,next)=>{
	//update one role
	const count = await db.doInTransaction(async (err,client)=>{
		const {rows} = client.query('update sys_role set name=$1,note=$2 where id=$3',[req.body.name,req.body.note,req.body.id]);
		return rows[0];
	});
	res.send(count);
});
router.get('/:id',async (req,res,next)=>{
	//select one role
	const row = await db.doInTransaction(async (err,client)=>{
		const {rows} = client.query('select * from sys_role where id=$1',[req.body.id]);
		return rows[0];
	});
	res.send(row);
});
router.delete('/batch',async (req,res,next)=>{
	//delete roles
	const row = await db.doInTransaction(async (err,client)=>{
		const {rows} = client.query('select * from sys_role where id=$1',[req.body.id]);
		return rows[0];
	});
	res.send(row);
});
router.get('/',async (req,res,next)=>{
	//select roles
	const rows = await db.doInTransaction(async (err,client)=>{
		const {rows} = await client.query('select * from sys_role',[]);
		return rows;
	});
	res.send(rows);
});
router.post('/:id/pris',async (req,res,next)=>{
	//join one pri
	const count = await db.doInTransaction(async (err,client)=>{
		const prisResult = await client.query('select t0.* from sys_privilege t0 left join sys_role_pri_mid t1 on t0.id=t1.pri_id left join sys_role t2 on t1.role_id = t2.id left join sys_user_role_mid t3 on t2.id = t3.role_id where t3.user_id=$1',
			[req.session.user.id]);
		const pris = prisResult.rows;
		const valid = pris.some((item,index,array)=>{//给其他角色授权，授权的范围在自己拥有的权限范围之内。
			return item.id == req.query.pri_id;
		});
		if(valid){
			return 0;
		}
		const {rows} = await client.query('insert into sys_role_pri_mid(role_id,pri_id)values($1,$2)',[req.query.id,req.query.pri_id]);
		return rows[0];
	});
	res.send(count);
});
router.post('/:id/pris/batch',async (req,res,next)=>{
	//join pris
	const count = await db.doInTransaction(async (err,client)=>{
		const prisResult = await client.query('select t0.* from sys_privilege t0 left join sys_role_pri_mid t1 on t0.id=t1.pri_id left join sys_role t2 on t1.role_id = t2.id left join sys_user_role_mid t3 on t2.id = t3.role_id where t3.user_id=$1',
			[req.session.user.id]);
		const pris = prisResult.rows;
		const valid = req.body.pri_ids.every((pri_id)=>{
			return pris.some((item,index,array)=>{//给其他角色授权，授权的范围在自己拥有的权限范围之内。
				return item.id == pri_id;
			});
		});
		if(valid){
			return 0;
		}
		const sql = [];
		const values = [];
		req.body.pri_ids.forEach((item,index,array)=>{
			sql.push(`($${2*index+1},$${2*index+2})`);
			values.push(req.body.id);
			values.push(item);
		});
		const {rows} = await client.query('insert into sys_role_pri_mid(role_id,pri_id)values'+sql.join(','),values);
		return rows[0];
	});
	res.send(count);
});
router.delete('/:id/pris/:pri_id',async (req,res,next)=>{
	//unjoin one pri
	const count = await db.doInTransaction(async (err,client)=>{
		const {rows} = await client.query('delete from sys_role_pri_mid where role_id=$1 and pri_id=$2',[req.body.id,req.body.pri_id]);
		return rows[0];
	});
	res.send(count);
});
router.delete('/:id/pris/batch',async (req,res,next)=>{
	//unjoin pris(privileges)
	const count = await db.doInTransaction(async (err,client)=>{
		const sql = ['delete from sys_role_pri_mid where role_id=$1 and pri_id in '];
		const values = [req.body.id];
		req.body.pri_ids.forEach((item,index,array)=>{
			sql.push(`($${index+1})`);
			values.push(item);
		});
		const {rows} = await client.query(sql.join(','),values);
		return rows[0];
	});
	res.send(count);
});
router.post('/:id/menus',async (req,res,next)=>{
	//join one menu pri
	const count = await db.doInTransaction(async (err,client)=>{
		const {rows} = await client.query('insert into sys_role_menu_mid(role_id,menu_id)values($1,$2)',[req.body.id,req.body.menu_id]);
		return rows[0];
	});
	res.send(count);
});
router.post('/:id/menus/batch',async (req,res,next)=>{
	//join menu pris
	const count = await db.doInTransaction(async (err,client)=>{
		const sql = ['insert into sys_role_menu_mid(role_id,menu_id)values'];
		const values = [];
		req.body.menu_ids.forEach((item,index,array)=>{
			sql.push(`($${2*index+1},$${2*index+2})`);
			values.push(req.body.id);
			values.push(item);
		});
		const {rows} = await client.query(sql.join(','),values);
		return rows[0];
	});
	res.send(count);
});
router.delete('/:id/menus/:menu_id',async (req,res,next)=>{
	//unjoin one menu pri
	const count = await db.doInTransaction(async (err,client)=>{
		const {rows} = await client.query('delete from sys_role_menu_mid where role_id=$1 and menu_id=$2',[req.body.id,req.body.menu_id]);
		return rows[0];
	});
	res.send(count);
});
router.delete('/:id/menus/batch',async (req,res,next)=>{
	//unjoin menu pris
	const count = await db.doInTransaction(async (err,client)=>{
		const sql = ['delete from sys_role_menu_mid where role_id=$1 and menu_id in '];
		const values = [req.body.id];
		req.body.menu_ids.forEach((item,index,array)=>{
			sql.push(`($${index+1})`);
			values.push(item);
		});
		const {rows} = await client.query(sql.join(','),values);
		return rows[0];
	});
	res.send(count);
});

module.exports = router;


