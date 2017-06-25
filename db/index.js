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
async function getClient() {
	const client = await pool.connect();
	const query = client.query.bind(client);
	client.query = async(...args) => { //这里用箭头函数会有bug，在用arguments时不要用箭头函数。或者用...args方式
		client.lastQuery = args;
		return query.apply(client, args);
	};
	const timeout = setTimeout(() => {
		console.error('A client has been checked out for more than 5 seconds.');
		console.error(`The last executed query on this client was:${client.lastQuery}`);
	}, 5000);
	const release = client.release.bind(client);
	client.release = () => {
		release();
		clearTimeout(timeout);
		client.query = query;
		client.release = release;
	};
	return client;
	/*pool.connect((err,client,done)=>{
		const query = client.query.bind(client);
		client.query=async (...args)=>{//这里用箭头函数会有bug，在用arguments时不要用箭头函数。或者用...args方式
			client.lastQuery = args;
			return query.apply(client,args);
		};
		const timeout = setTimeout(()=>{
			console.error('A client has been checked out for more than 5 seconds.');
			console.error(`The last executed query on this client was:${client.lastQuery}`);
		},5000);
		client.release = (err)=>{
			done(err);//done函数会将连接放回连接池,但不是调用client的release方法.
			clearTimeout(timeout);
			client.query = query;
		};
		callback(err,client,done);
	});*/
}
const db = {
	doInTransaction: async function(cb) {
		const client = await getClient();//pool.connect();
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
	},
	getClient: getClient
};
module.exports = db;