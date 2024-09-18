const jwt = require('jsonwebtoken');
require('dotenv').config()

const { adminPool } = require('../../configAndConnection/postgres.conexion')
const { hashPassword, compareHashPassword } = require('../../customFunction/cryptPassword')
const hashUser = require('../../customFunction/cryptData')

async function logInAdmin(req, res) {
    try {
        const { username, password } = req.body;
        if (!username) return res.status(400).send({ error: 'Username is required' });
        if (!password) return res.status(400).send({ error: 'Password is required' });
        const hashUsername=hashUser(username)
   
        //Compare username in db
        const queryAdminForPassword = await adminPool.query("SELECT password, name from admin where username=$1", [hashUsername])
        const passwordDb = queryAdminForPassword.rows[0].password;
        if (!passwordDb){throw new Error ("No username found in database")}
        const checkPasword=compareHashPassword(password, passwordDb)
        if(!checkPasword){throw new Error("Password wrong")}
        const name = queryAdminForPassword.rows[0].name;
        const token = jwt.sign(
            {
                user: name,
            rank:'Admin'
            },
            process.env.JWT_TOKEN_KEY,
            { expiresIn: '1d' })
        res.cookie('token', token, {
            maxAge: 30 *60 * 60 * 1000,
        });
        res.status(202).send({ success: "Successfully logged in", name: name, rank:'Admin', token:token});
    }
    catch (error) {
        res.status(500).json({ message: 'Error when log in the user', error: error.message });
    }
}


async function deleteUserEmployee(req, res) {
    try {
        const { username } = req.body;
        if (!username) return res.status(400).send({ error: "No username" })
        const hashUsername = hashUser(username)
        const queryForUsername = await adminPool.query("select id from employee_user where username=$1", [hashUsername])
        if (queryForUsername.rowCount === 0) throw new Error("No username found")
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
        if (!username) return res.status(400).send({ error: "No username" })
        const hashUsername = hashUser(username)
        const queryForUsername=await adminPool.query("select id from admin where username=$1", [hashUsername])
        if(queryForUsername.rowCount===0) throw new Error ("No username found")
       const response= await adminPool.query('DELETE FROM admin WHERE username = $1', [hashUsername])
        return res.status(200).json({ success: 'Succesfully deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}


async function addEmployeeUser(req, res) {
    try {
        const { username, password, confirmPassword, name } = req.body;
        if (!username) return res.status(400).send({ error: 'Username is required' });
        if (!password) return res.status(400).send({ error: 'Password is required' });
        if (!confirmPassword) { return res.status(400).send({ error: "No confirm password provided" }) }
        if (password !== confirmPassword) { return res.status(400).send({ error: "Password doesnt match" }) }
        if (!name) return res.status(400).send({ error: 'Name is required' });
        const cryptPassword = await hashPassword(password)
        const cryptUser = hashUser(username)
        const verifiedUserUnique = await adminPool.query("Select username from employee_user where username=$1", [cryptUser])
        if (verifiedUserUnique.rowCount > 0) { throw new Error("Username allready in use") }
        if (cryptPassword.error) { throw new Error(cryptPassword.error) }
        await adminPool.query("INSERT INTO employee_user(username, password, name) VALUES ($1, $2, $3)", [cryptUser, cryptPassword, name])
        return res.status(201).send({ success: "User added with success" })
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}

async function addAdminAccount (req, res) {
    try {
        const {username, password, confirmPassword, name } = req.body
        if(!username ) {return res.status(400).send({error:"Username not provided"})}
        if (!password) { return res.status(400).send({ error: "Password not provided" })}
        if (!confirmPassword) { return res.status(400).send({ error: "No confirm password provided" }) }
        if (!name) { return res.status(400).send({ error: "No confirm password provided" }) }
        if (password !== confirmPassword) { return res.status(400).send({ error: "Password doesnt match" }) }
        const hashUsername = hashUser(username)
        const hashedPassword=await hashPassword(password)
        if (hashedPassword.error) { throw new Error(hashedPassword.error)}
        const insertAdmin = await adminPool.query("INSERT INTO admin(username, password, name) values ($1, $2, $3) returning id", [hashUsername, hashedPassword, name])
        if(!insertAdmin.rows[0].id){throw new Error("Error encountered when inserting new admin")}
        res.status(201).send({ success:"New admin added succesfully"})
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function getAdminUser (req, res) {
    try {
        const queryAdminTb=await adminPool.query("SELECT id, name from admin")
        const data=queryAdminTb.rows
        res.status(200).send(data)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}
async function getEmployeeUSer(req, res) {
    try {
        const queryEmployeeTb = await adminPool.query("SELECT id, name from employee_user")
        const data = queryEmployeeTb.rows
        res.status(200).send(data)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}
module.exports = {
     logInAdmin, 
     addEmployeeUser, 
     addAdminAccount, 
     deleteUserEmployee, 
     deleteUserAdmin,
     getAdminUser,
     getEmployeeUSer
    }