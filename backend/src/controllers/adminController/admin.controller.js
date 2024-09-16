const jwt = require('jsonwebtoken');
require('dotenv').config()

const { adminPool } = require('../../configAndConnection/postgres.conexion')
const { hashPassword, compareHashPassword } = require('../../customFunction/cryptPassword')
const hashUser = require('../../customFunction/cryptData')

async function logInAdmin(req, res) {
    try {
        const { username, password } = req.body;
        if (!username) {
            return res.status(400).send({ message: 'Username is required' });
        }
        if (!password) {
            return res.status(400).send({ message: 'Password is required' });
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
        res.status(200).send({ message: "Successfully logged in", username:username});
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}

async function deleteUser(req, res) {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).send({ message: "No username" })
        }
        const hashUsername = hashUser(username)
        await adminPool.query('DELETE FROM employee_user WHERE username = $1', [hashUsername])
        return res.status(200).json({ message: 'Succesfull deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}

async function addEmployeeUser(req, res) {
    try {
        const { username, password } = req.body;
        if (!username) {
            return res.status(400).send({ message: 'Username is required' });
        }
        if (!password) {
            return res.status(400).send({ message: 'Password is required' });
        }
        const cryptPassword = await hashPassword(password)
        const cryptUser = hashUser(username)
        const verifiedUSerUnique = await adminPool.query("Select username from employee_user where username=$1", [cryptUser])
        if (verifiedUSerUnique.rowCount > 0) { throw new Error("Username allready in use") }
        if (cryptPassword.error) { throw new Error(cryptPassword.error) }
        await adminPool.query("INSERT INTO employee_user(username, password) VALUES ($1, $2)", [cryptUser, cryptPassword])
        return res.status(201).send({ message: "User added with succes" })
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}

async function addAdminAccount (req, res) {
    try {
        const {username, password } = req.body
        if(!username ) {return res.status(400).send({error:"Username not provided"})}
        if (!password) { return res.status(400).send({ error: "Password not provided" }) }
        const hashUsername = hashUser(username)
        if(hashUsername.error){ throw new Error(hashUsername.error)}
        const hashedPassword=await hashPassword(password)
        if (hashedPassword.error) { throw new Error(hashedPassword.error)}
        const insertAdmin = await adminPool.query("INSERT INTO admin(username, password) values ($1, $2) returning id", [hashUsername, hashedPassword])
        if(!insertAdmin.rows[0].id){throw new Error("Error encountered when inserting new admin")}
        res.status(201).send({succes:"New admin added succesfully"})
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = { logInAdmin, deleteUser, addEmployeeUser, addAdminAccount }