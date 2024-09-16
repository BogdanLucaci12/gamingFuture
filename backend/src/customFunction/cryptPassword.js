const bcrypt = require('bcrypt');

const saltRounds = 16;

async function hashPassword(password) {
    try {
        const hashPass = await bcrypt.hash(password, saltRounds);
        return hashPass;
    } catch (err) {
        return { error: "Error generating hash password" };
    }
}

async function compareHashPassword(password, hash) {
    try {
        const result = await bcrypt.compare(password, hash);
        return result;
    } catch (err) {
        return { error: "Password wrong" };
    }
}



module.exports = { hashPassword, compareHashPassword };