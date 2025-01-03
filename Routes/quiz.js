const router = require("express").Router();

const {auth,isAdmin, isVisitor}=require('../middleware/auth')
const {home,submited,getquiz, getresults ,addtest}=require('../controller/Quiz');


router.post("/",home );
router.post("/getquiz",auth,isVisitor,getquiz);
router.post("/submittest",auth,isVisitor,submited);
router.post("/getresults", auth,getresults);
router.post("/addtest", isAdmin,addtest);

module.exports = router;