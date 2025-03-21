const express =require('express');
const connectDb = require('./config/db');
const cors  =require('cors')
const courseRoutes =require('./routes/courseRoutes')
const dashboardRoutre =require('./routes/dashboardRoutre')
const port=3000;
const app=express();
const dotenv=require('dotenv');
dotenv.config();
connectDb()

app.use(express.json())
app.use(cors())

app.use('/api/dashboard',dashboardRoutre)
app.use('/api/course',courseRoutes)

app.listen(port,()=>{
    console.log('server is running on port 3000');
})