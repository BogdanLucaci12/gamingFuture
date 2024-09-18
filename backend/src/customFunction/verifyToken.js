const jwt = require('jsonwebtoken');
require('dotenv').config()

function verifyToken(req, res) {
    try {
        const token = req.cookies.token;
        if (token == null) return res.status(401).send({error:"Not authenticated"});
        jwt.verify(token, process.env.JWT_TOKEN_KEY, (err, user) => {
            if (err) return res.status(403).send({error:"Token invalid"});
            res.status(202).send({ success:'Valid token',name:user.user ,rank:user.rank })
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = verifyToken