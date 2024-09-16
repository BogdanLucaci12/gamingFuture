const jwt = require('jsonwebtoken');
require('dotenv').config()

const { adminPool } = require('../../configAndConnection/postgres.conexion')
const { hashPassword, compareHashPassword } = require('../../customFunction/cryptPassword')
const hashUser = require('../../customFunction/cryptData')

async function logInAdmin(req, res) {
    try {
        const { username, password } = req.body;
        if (!username) {
            return res.status(400).send({ error: 'Username is required' });
        }
        if (!password) {
            return res.status(400).send({ error: 'Password is required' });
        }
        const hashUsername=hashUser(username)
        //Compare username in db
        const queryAdminForPassword = await adminPool.query("SELECT password from admin where username=$1", [hashUsername])
        const passwordDb = queryAdminForPassword.rows[0].password;
        if (!passwordDb){throw new Error ("No username found in database")}
        const checkPasword=compareHashPassword(password, passwordDb)
        if(!checkPasword){throw new Error("Password wrong")}
        const token = jwt.sign(
            { user: username },
            process.env.JWT_TOKEN_KEY,
            { expiresIn: '30m' })
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 30 * 60 * 1000
        });
        res.status(202).send({ success: "Successfully logged in", username:username});
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}


async function deleteUserEmployee(req, res) {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).send({ error: "No username" })
        }
        const hashUsername = hashUser(username)
        await adminPool.query('DELETE FROM employee_user WHERE username = $1', [hashUsername])
        return res.status(200).json({ success: 'Succesfully deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}

async function deleteUserAdmin(req, res) {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).send({ error: "No username" })
        }
        const hashUsername = hashUser(username)
        await adminPool.query('DELETE FROM admin WHERE username = $1', [hashUsername])
        return res.status(200).json({ success: 'Succesfully deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}


async function addEmployeeUser(req, res) {
    try {
        const { username, password, confirmPassword } = req.body;
        if (!username) {
            return res.status(400).send({ error: 'Username is required' });
        }
        if (!password) {
            return res.status(400).send({ error: 'Password is required' });
        }
        if (!confirmPassword) { return res.status(400).send({ error: "No confirm password provided" }) }
        if (password !== confirmPassword) { return res.status(400).send({ error: "Password doesnt match" }) }
        const cryptPassword = await hashPassword(password)
        const cryptUser = hashUser(username)
        const verifiedUSerUnique = await adminPool.query("Select username from employee_user where username=$1", [cryptUser])
        if (verifiedUSerUnique.rowCount > 0) { throw new Error("Username allready in use") }
        if (cryptPassword.error) { throw new Error(cryptPassword.error) }
        await adminPool.query("INSERT INTO employee_user(username, password) VALUES ($1, $2)", [cryptUser, cryptPassword])
        return res.status(201).send({ success: "User added with success" })
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}

async function addAdminAccount (req, res) {
    try {
        const {username, password, confirmPassword } = req.body
        if(!username ) {return res.status(400).send({error:"Username not provided"})}
        if (!password) { return res.status(400).send({ error: "Password not provided" })}
        if (!confirmPassword) { return res.status(400).send({ error: "No confirm password provided" }) }
        if (password !== confirmPassword) { return res.status(400).send({ error: "Password doesnt match" }) }
        const hashUsername = hashUser(username)
        const hashedPassword=await hashPassword(password)
        if (hashedPassword.error) { throw new Error(hashedPassword.error)}
        const insertAdmin = await adminPool.query("INSERT INTO admin(username, password) values ($1, $2) returning id", [hashUsername, hashedPassword])
        if(!insertAdmin.rows[0].id){throw new Error("Error encountered when inserting new admin")}
        res.status(201).send({ success:"New admin added succesfully"})
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = { logInAdmin, addEmployeeUser, addAdminAccount, deleteUserEmployee, deleteUserAdmin }