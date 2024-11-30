const router = require("express").Router();

const {auth,isAdmin,isStudent}=require('../middleware/auth')
const {home,submited,gettest, getresults ,addtest}=require('../controller/Quiz');


router.post("/",home );
router.post("/gettests",auth,isStudent,gettest);
router.post("/submittest",auth,isStudent,submited);
router.post("/getresults", auth,getresults);
router.post("/addtest", isAdmin,addtest);

module.exports = router;