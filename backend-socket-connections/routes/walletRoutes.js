const express=require("express");
const router=express.Router();
const walletController=require("../controllers/walletController")
const transactionController=require("../controllers/transactionController")
const verify =require("./verifyTokens");

// get wallet summary - accepts optional wallet_id query param
router.get("/getWallet", verify, walletController.getWallet);

router.post("/transfer",verify, transactionController.transfer);
router.post("/transferFee",verify, transactionController.transferFee);
router.get("/listTransactions/",verify, transactionController.listTransactions);

module.exports=router;