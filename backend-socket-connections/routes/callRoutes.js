const express=require("express");
const router=express.Router();
const callController=require("../controllers/callController")
const verify=require("../routes/verifyTokens");

router.post("/init",verify, callController.init);
router.post("/join",verify, callController.join);
router.post("/update/",verify, callController.update);
router.post("/rate/",verify, callController.rate);
router.get("/list",verify, callController.list);
router.get("/detail/",verify, callController.detail);


module.exports=router;