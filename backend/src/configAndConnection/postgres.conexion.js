const { Pool } = require('pg')

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
});

const publicPool = new Pool({
    user: process.env.USERPUBLIC,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORDPUBLIC,
    port: process.env.PORT_DB,
});

module.exports = { adminPool, employeePool, publicPool }