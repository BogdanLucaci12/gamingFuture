const crypto = require('crypto')

 function hashData(email) {
    const result = crypto.createHash('sha256').update(email).digest('hex');
    return result 
} 

module.exports = hashData