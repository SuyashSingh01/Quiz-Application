const bcrypt = require('bcrypt');
const jwt =require('jsonwebtoken');
require('dotenv').config();


const User = require('../models/User');

// --------------------------------------------signup handler----------------------------------

exports.signup = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        // check if user is already exist or not 
        const existuser = await User.findOne({ email });
        if (existuser) {
            return res.status(400).json({
                message: 'User already exist',
                success: false
            })
        }
        // hash password before saving into database
        let hashedpassword;
        try {
            hashedpassword = await bcrypt.hash(password, 10);
        }
        catch (e) {
            console.log(e);
            return res.status(500).json({
                message: 'Error in Hashing',
                success: false,
                error: e.message

            })
        }
        // create a new user
        const newuser = await User.create({
            name,
            email,
            password: hashedpassword,
            role
        });

        return res.status(200).json({
            message: 'User is created successfully',
            success: true,
            data: newuser
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Server Error',
            success: false,
            error: err.message
        })
    }

}

// --------------------------------------------Login Route----------------------------------

exports.login = async (req, res) => {

    const { email, password } = req.body;
    try {
        // we whether the user is exist or not in db
        if (!email || !password) return res.status(400).json({
            message: "Field is Empty",
            success: false,
        })

        // check whether user exist in db  or not before login
        let existuser = await User.findOne({ email });
        if (!existuser) {
            return res.status(401).json({
                message: "User Has No Account",
                success: false,
            })
        }
        // check password is matched or not
        let hashpassword = await bcrypt.compare(password, existuser.password);
        if (hashpassword) {
            // we can use jwt token or cookies for user verification and authorization again, by sending to user in response
            // make a payload for jwt
            const payload = {
                email: existuser.email,
                role: existuser.role,
                id: existuser._id,
            }
            let token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn: '24h',
            });
            // add an line 
            existuser=existuser.toObject();
            existuser.token = token;
            existuser.password=undefined;
            console.log(existuser);
            // add cookie to client side
            let options={
                expires:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true
            }
            // res.cookie("tokenname",token,options).status(200).json({
            //     message: "User are Logged In",
            //     success: true,
            //     token,
            //     data: existuser
            // });
            res.status(200).json({
                message: "User are Logged In",
                success: true,
                token,
                data: existuser
            })
        }
        //password not matched
        else {
            return res.status(400).json({
                message: "Password Not Matched",
                success: false,
            })
        }
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal Servor Error",
            success: false,
            error: err.message
        })
    }
}
