const express = require('express')

const adminRouter = require('./routes/admin.router')
const employeeRouter=require('./routes/employee.router')
const PORT=8626;

const app = express()
app.use(express.json())

app.use('/admin', adminRouter)
app.use('/employee', employeeRouter)

app.listen(PORT, ()=>{
    console.log(`Listening on ${PORT}`)
})