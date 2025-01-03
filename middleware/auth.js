const jwt = require('jsonwebtoken');

require('dotenv').config();

// NOTE: we do not need to send res for ok status as they are already done 
// in Protectes Routes if this all middlware list in Protected Routes work as  ,and no 500 response are send then the user are authZ we will exe call back function over there for 200 ok

// for auth middleware
exports.auth = (req, res, next) => {
    try {
        // extract jwt token.
        // console.log(req.body.token);
        // console.log("cookies",req.cookies.tokenname);
        console.log("Header",req.header("Authorization"));
        const token = req.body.token||req.cookies.tokenname||req.header("Authorization").replace("Bearer ","");
        
        if (!token||token==undefined) return res.status(401).json({
            success: false,
            message: "Token is Missing"
        })

        // verify token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
            // Reason so that we can check authorization in next that's  why i placed the decoded back to user request
            req.user = decoded;
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Token is Invalid"
            })
        }
        // go to next middleware/routes/Handler

        next();

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something Went Wrong while Verfiying the Token",
            error: err.message
        })
    }
}



// for Admin middleware
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to access this Admin route"
            })
        }
        next();

    } catch (err) {

        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something Went Wrong while Verfiying the Token",
            error: err.message
        })
    }

}

// for Visitor middleware
exports.isVisitor = async (req, res, next) => {
    try {
        if (req.user.role !== 'Visitor') {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to access this Visitor route"
            })
        }
        next();

    } catch (err) {

        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something Went Wrong while Verfiying the Token",
            error: err.message
        })
    }

}