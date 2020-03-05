
const jwt = require('jsonwebtoken')

const key = "KbPeShVmYp3s6v9y$B&E)H@McQfTjWnZ"

module.exports.generateToken(username) = function() {
	return jwt.sign({
		'exp': Math.floor(Date.now()/1000) + 2 * 60 * 60,
		'usr': username
	},key);
}


module.exports.decode = function(token){
	try {
	  let decoded = jwt.verify(token, key);
	  return {'name' : decoded.usr, isValid: (decoded.exp > Math.floor(Date.now()/1000))} ;

	} catch(err) {
	  return {'name' : null, isValid: false};
	}
}


