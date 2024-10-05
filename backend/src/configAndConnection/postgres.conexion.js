const { Pool } = require('pg')
import { HttpsProxyAgent } from 'https-proxy-agent';
const proxy = process.env.QUOTAGUARDSTATIC_URL;
const agent = new HttpsProxyAgent(proxy);

require('dotenv').config()
const adminPool = new Pool({
    user: process.env.USERADMIN,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORDADMIN,
    port: process.env.PORT_DB,

})

const employeePool = new Pool({
    user: process.env.USEREMPLOYEE,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORDEMPLOYEE,
    port: process.env.PORT_DB,
    ssl: {
        rejectUnauthorized: false,
        agent: agent
    }
});

const publicPool = new Pool({
    user: process.env.USERPUBLIC,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORDPUBLIC,
    port: process.env.PORT_DB,
    ssl: {
        rejectUnauthorized: false,
        agent: agent
    }
});

adminPool.connect()
    .then(client => {
        console.log('Conexiune reușită la baza de date locală!');
        client.release(); // Eliberează clientul după utilizare
    })
    .catch(err => {
        console.error('Eroare la conectarea la baza de date:', err);
    });

module.exports = { adminPool, employeePool, publicPool }