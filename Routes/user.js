const express=require('express');
const router=express.Router();


const {login,signup}=require('../controller/Auth');
const {auth,isAdmin,isVisitor}=require('../middleware/auth')



// Routes

router.post('/login',login);
router.post('/signup',signup);

// Testing Purpose Routes
router.get('/test',auth,(req,res)=>{
    res.json({
        message:"Welcome to Test Routes",
        success:true
    })
})

// Protected Routes
router.get('/',auth,isVisitor,(req,res)=>{
    res.json({
        message:"Welcome to Protected Routes of Visitor",
        success:true
    })
})
router.get('/admin',auth,isAdmin,(req,res)=>{
    res.json({
        message:"Welcome to Protected Routes of Admin",
        success:true
    })
})

module.exports=router;