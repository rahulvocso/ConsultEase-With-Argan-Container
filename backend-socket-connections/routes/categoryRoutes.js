const express=require("express");
const router=express.Router();
const categoryController=require("../controllers/categoryController")
const verify =require("./verifyTokens");


//Secure Routes
router.get("/list/",verify, categoryController.list);
router.get("/:_id",verify, categoryController.getCategory);


module.exports=router;