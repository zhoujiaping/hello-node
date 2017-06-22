const pg = require('pg');
var pool = new pg.Pool({
	  user: 'postgres',
	  host: 'localhost',
	  database: 'test',
	  password: '123456',
	  port: 5432,
	})
// pool.end()
const text = 'select * from sys_user where id=$1';
const repo = {
	queryList: async function(cb) {
		const values = [1];
		const client = await pool.connect().catch(err=>{console.error(err);});
		try{
			await client.query('BEGIN');
			const {rows} = await client.query(text,values);
			await client.query('COMMIT');
			cb(null,rows)
		}catch(e){
			await client.query('ROLLBACK');
			throw e;
		}finally{
			client.release();
		}
	}


};

module.exports = repo;