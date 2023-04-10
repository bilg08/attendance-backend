const bcrypt = require('bcryptjs');
module.exports.hashPassword = async (pass) => {
    return await bcrypt.hash(pass, 1);
}