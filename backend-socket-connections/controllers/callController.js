const callService=require("../services/callService");
const defaults=require("../defaults");


module.exports.showDefault=(req,res)=>{
    res.send("Specify an endpoint");
}

module.exports.startCall=(req,res)=>{
    res.send("Call started");
} 

module.exports.init=async(req,res)=>{
    //res.send("Call initialized...");
    let response={...defaults.apiResponse};
        try{
            console.log(req.body);
            const service_response = await callService.init(req);
     
            response.status=200;
            response.message=defaults.callMessages.INIT;
            response.body=service_response;
        }
        catch(error){
            console.log("Call init error ...",error)
            response.message=error.message;
        }
    
    return res.status(response.status).send(response);

} 

module.exports.join=async(req,res)=>{
    //res.send("Call joining...");
    let response={...defaults.apiResponse};
        try{
            console.log(req.body);
            const service_response = await callService.join(req);
     
            response.status=200;
            response.message=defaults.callMessages.JOIN;
            response.body=service_response;
        }
        catch(error){
            console.log("Call join error ...",error)
            response.message=error.message;
        }
    
    return res.status(response.status).send(response);

} 


module.exports.update=async(req,res)=>{
    //res.send("Call updating...");
    let response={...defaults.apiResponse};
        try{
            console.log(req.body);
            const service_response = await callService.update(req);
     
            response.status=200;
            response.message=defaults.callMessages.UPDATE;
            response.body=service_response;
        }
        catch(error){
            console.log("Call join error ...",error)
            response.message=error.message;
        }
    
    return res.status(response.status).send(response);

} 

module.exports.detail=async(req,res)=>{

    let response={...defaults.apiResponse};

    try{
        const service_response = await callService.detail(req);
        response.status=200;
        response.message=defaults.callMessages.DETAILS;
        response.body=service_response;
    }
    catch(error){
        console.log("Get call detail error...",error)
        response.message=error.message;
    }

return res.status(response.status).send(response);
}
 

module.exports.update=async(req,res)=>{
    let response={...defaults.apiResponse};
     try{
        const service_response = await callService.update(req);
        response.status=200;
        response.message=defaults.callMessages.UPDATE;
        response.body=service_response;
    }
    catch(error){
        console.log("Update calls ...",error)
        response.message=error.message;
    }

return res.status(response.status).send(response);
}


module.exports.list=async(req,res)=>{
    let response={...defaults.apiResponse};
     try{
        const service_response = await callService.list(req);
        response.status=200;
        response.message=defaults.callMessages.LIST;
        response.body=service_response;
    }
    catch(error){
        console.log("Listing calls ...",error)
        response.message=error.message;
    }

return res.status(response.status).send(response);
}


module.exports.rate=async(req,res)=>{
    let response={...defaults.apiResponse};
     try{
        const service_response = await callService.rate(req);
        response.status=200;
        response.message=defaults.callMessages.RATE;
        response.body=service_response;
    }
    catch(error){
        console.log("Rate calls ...",error)
        response.message=error.message;
    }

return res.status(response.status).send(response);
}
