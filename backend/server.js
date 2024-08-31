const express = require('express')

const logginAdminRouter = require('./routes/loginAdmin.router')

const PORT=8626;

const app = express()
app.use(express.json())

app.use('/login', logginAdminRouter)

app.listen(PORT, ()=>{
    console.log(`Listening on ${PORT}`)
})