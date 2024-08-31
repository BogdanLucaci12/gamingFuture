const pool=require('../databases.conexion')

async function postLogin (req, res){
    try{
        const { username, password } = req.body;
        if (!username) {
            return res.status(400).send({ message: 'Username is required' });
        }
        if (!password) {
            return res.status(400).send({ message: 'Password is required' });
        }

        console.log(username, password)
        
        await pool.query('INSERT INTO  employee_user(username, password) VALUES ($1, $2)', [username, password])
        res.status(200).send({message:"Succesful created"})
    }
    catch (error){
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
   
}

module.exports = { postLogin }