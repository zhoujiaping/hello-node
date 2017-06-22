const pg = require('pg');
const conString = 'postgres://postgres:123456@localhost/test';
const repo = {
	queryList: function(cb) {
		pg.connect(conString, function(err, client, done) {
			if(err) {
				return console.error('err fetching client from pool', err);
			}
			client.query('SELECT * from sys_user', [], function(err, result) {
				done();
				if(err) {
					return console.error('error running query', err);
				}
				cb(null,result.rows);
				//console.info(result);
			});

		});
	}

};

module.exports = repo;