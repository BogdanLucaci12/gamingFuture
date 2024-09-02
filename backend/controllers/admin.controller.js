const {adminPool} =require('../databases.conexion')

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

async function addUserAdmin(req, res){
    try{
        const { username, password } = req.body;
        if (!username) {
            return res.status(400).send({ message: 'Username is required' });
        }
        if (!password) {
            return res.status(400).send({ message: 'Password is required' });
        }
        await adminPool.query("INSERT INTO admin(username, password) VALUES ($1, $2)", [username, password])
        return res.status(200).send({message:"User added with succes"})

    }
    catch(error){
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}
module.exports = { logInAdmin, deleteUser, addUserAdmin }