const userRepo = require('../repo/userRepo');
const service = {
	queryList:function(cb){
		console.info(userRepo);
		userRepo.queryList(cb);
		//return [1,2,3];
	}
	
};
module.exports = service;