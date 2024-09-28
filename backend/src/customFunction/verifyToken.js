const jwt = require('jsonwebtoken');
require('dotenv').config()

function verifyTokenAdmin(req, res) {
    try {
        const token = req.cookies.token;
        if (token == null) return res.status(401).send({error:"Not authenticated"});
        jwt.verify(token, process.env.JWT_TOKEN_KEY_ADMIN, (err, user) => {
            if (err) return res.status(403).send({error:"Token invalid"});
            res.status(202).send({ success:'Valid token',name:user.user ,rank:user.rank })
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

function verifyTokenEmployee(req, res) {
        const token = req.cookies.token;
        if (token == null) return res.status(401).send({ error: "Not authenticated" });
        try {
           const decodedjwt= jwt.verify(token, process.env.JWT_TOKEN_KEY_EMPLOYEE);
            return res.status(200).send({ success: 'Valid token', name: decodedjwt.user, rank: decodedjwt.rank })
        } catch (err) {
            try {
               const decodedjwt= jwt.verify(token, process.env.JWT_TOKEN_KEY_ADMIN);
                return res.status(200).send({ success: 'Valid token', name: decodedjwt.user, rank: decodedjwt.rank })
            } catch (err) {
                return res.status(403).cookie('token', '', { maxAge: 0 }).send({ error: "Invalid token employee" });
            }
        }
    }


module.exports = { verifyTokenAdmin, verifyTokenEmployee }