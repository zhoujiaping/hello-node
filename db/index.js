const pg = require('pg');
const pool = new pg.Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'test',
	password: '123456',
	port: 5432,
	max: 20, //set pool max size to 20
	min: 4, //set min pool size to 4
	idleTimeoutMillis: 1000 //close idle clients after 1 second
});
const db = {
	doInTransaction: async function(cb) {
		const client = await pool.connect();
		try {
			await client.query('BEGIN');
			const res = await cb(null, client);
			await client.query('COMMIT');
			return res;
		} catch(e) {
			await client.query('ROLLBACK');
			throw e;
		} finally {
			//client.end();//关闭连接
			client.release(); //没有关闭连接，只是将连接放回连接池
		}
	}
};
module.exports = db;