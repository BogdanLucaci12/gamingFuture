const {adminPool} =require('../../postgres.conexion')
const { hashPsssword }=require ('../../customFunction/cryptPassword')
const hashUser = require('../../customFunction/cryptData')
async function logInAdmin (req, res){
    try{
        const { username, password } = req.body;
        if (!username) {
            return res.status(400).send({ message: 'Username is required' });
        }
        if (!password) {
            return res.status(400).send({ message: 'Password is required' });
        }
        const result = await adminPool.query('SELECT id FROM admin WHERE username=$1 AND password=$2', [username, password]);

        if (result.rows.length === 0) {
            return res.status(401).send({ message: 'Invalid username or password' });
        }

        res.status(200).send({ message: "Successfully logged in", credential: result.rows[0].id });
    }
    catch (error){
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}

async function deleteUser(req, res){
    try{
        const { username} = req.body;
        if(!username){
            return res.status(400).send({ message: "No username"})
        }
        await adminPool.query('DELETE FROM employee_user WHERE username = $1', [username])
        return res.status(200).json({ message: 'Succesfull deleted' });
    }
    catch (error){
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}

async function addEmployeeUser(req, res){
    try{
        const { username, password } = req.body;
        if (!username) {
            return res.status(400).send({ message: 'Username is required' });
        }
        if (!password) {
            return res.status(400).send({ message: 'Password is required' });
        }
        console.log(username, password)
        const cryptPassword = await hashPsssword(password)
        const cryptUser = hashUser(username)
        const verifiedUSerUnique = await adminPool.query("Select username from employee_user where username=$1", [cryptUser])
        if (verifiedUSerUnique.rowCount>0){throw new Error("Username allready in use")}
        if(cryptPassword.error){throw new Error(cryptPassword.error)}
        await adminPool.query("INSERT INTO employee_user(username, password) VALUES ($1, $2)", [cryptUser, cryptPassword])
        return res.status(200).send({message:"User added with succes"})
    }
    catch(error){
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}
module.exports = { logInAdmin, deleteUser, addEmployeeUser }