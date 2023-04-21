const walletService=require("../services/walletService");
const defaults=require("../defaults");
const { result } = require("@hapi/joi/lib/base");


module.exports.showDefault=(req,res)=>{
    res.send("Specify an endpoint");
}

module.exports.getWallet=async(req,res)=>{

    let response={...defaults.apiResponse};

    try{
        const service_response = await walletService.getWallet(req);
        response.status=200;
        response.message=defaults.walletMessages.BALANCE;
        response.body=service_response;
    }
    catch(error){
        console.log("Balance retrieval error...",error)
        response.message=error.message;
    }

return res.status(response.status).send(response);
}