const express=require('express')
const app=express()
const cors=require('cors')
const usersRouter = require('./routes/users')
const accountRouter = require('./routes/account')
app.use(express.json())
app.use(cors())


app.use('/api/v1/users',usersRouter)
app.use('/api/v1/account',accountRouter)

const port=3000;
app.listen(port,()=>{
    console.log(`app is listening to port ${port}`)
})