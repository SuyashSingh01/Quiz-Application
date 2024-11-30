const express=require('express');
const app=express();

require('dotenv').config();
const Port =process.env.PORT||4000;

// cookie parser
const cookiesparser=require('cookie-parser');
app.use(cookiesparser());


app.use(express.json());
// db connection
const dbconnect=require('./config/database').connect();
// app.use(express.urlencoded({extended:false}));


// import routes
const user=require('./Routes/user');
app.use('/api/v1',user);

// server activiation
app.listen(Port,()=>{
    console.log('server is running on port ',Port);
})

