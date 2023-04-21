const userService=require("../services/userService");
const defaults=require("../defaults");
const { result } = require("@hapi/joi/lib/base");


module.exports.showDefault=(req,res)=>{
    res.send("Specify an endpoint");
}
 
module.exports.registerMobile=async(req,res)=>{
    let response={...defaults.apiResponse};
 
        try{
            console.log(req.body);
            const service_response = await userService.registerMobile(req.body);
     
            response.status=200;
            response.message=defaults.userMessages.REGISTERED;
            response.body=service_response;
        }
        catch(error){
            console.log("Something went wrong...",error)
            response.message=error.message;
        }
    
    return res.status(response.status).send(response);

} 

module.exports.verifyMobileOTP=async(req,res)=>{

    let response={...defaults.apiResponse};
 
    try{
        const service_response = await userService.verifyMobileOTP(req.body);
 
        response.status=200;
        response.message=defaults.userMessages.OTP_VERIFIED;
        response.body=service_response;
        res.header("auth_token",service_response.auth_token);
    }
    catch(error){
        console.log("Verification Error",error)
        response.message=error.message;
      
    }

return res.status(response.status).send(response);
}
 

module.exports.updatePersonalInfo=async(req,res)=>{

    let response={...defaults.apiResponse};


    try{
        const service_response = await userService.updatePersonalInfo(req);
        response.status=200;
        response.message=defaults.userMessages.PERSONAL_INFO_UPDATED;
        response.body=service_response;
    }
    catch(error){
        console.log("Info update error...",error)
        response.message=error.message;
    }

return res.status(response.status).send(response);
}
 

module.exports.getUser=async(req,res)=>{

    let response={...defaults.apiResponse};

    try{
        const service_response = await userService.getUser(req.params._id);
        response.status=200;
        response.message=defaults.userMessages.USER_INFO;
        response.body=service_response;
    }
    catch(error){
        console.log("Get User error...",error)
        response.message=error.message;
    }

return res.status(response.status).send(response);
}
 



module.exports.getCurrentUser=async(req,res)=>{

    let response={...defaults.apiResponse};


    try{
        const service_response = await userService.getCurrentUser(req);
        response.status=200;
        response.message=defaults.userMessages.USER_INFO;
        response.body=service_response;
    }
    catch(error){
        console.log("Get Current User error...",error)
        response.message=error.message;
    }

return res.status(response.status).send(response);
}
 



module.exports.updateHandle=async(req,res)=>{

    let response={...defaults.apiResponse};
     try{
        const service_response = await userService.updateHandle(req);
        response.status=200;
        response.message=defaults.userMessages.HANDLE_UPDATE;
        response.body=service_response;
    }
    catch(error){
        console.log("Handle update error...",error)
        response.message=error.message;
    }

return res.status(response.status).send(response);
}
 



module.exports.list=async(req,res)=>{
console.log(req.query);
    let response={...defaults.apiResponse};
     try{
        const service_response = await userService.list(req.query);
        response.status=200;
        response.message=defaults.userMessages.LIST;
        response.body=service_response;
    }
    catch(error){
        console.log("Listing users...",error)
        response.message=error.message;
    }

return res.status(response.status).send(response);
}
 



module.exports.listProfiles=async(req,res)=>{
    console.log(req.query);
        let response={...defaults.apiResponse};
         try{
            const service_response = await userService.listProfiles(req.query);
            response.status=200;
            response.message=defaults.userMessages.LIST;
            response.body=service_response;
        }
        catch(error){
            console.log("Listing user profiles...",error)
            response.message=error.message;
        }
    
    return res.status(response.status).send(response);
    }
     




    module.exports.updateProfessionalCategories=async(req,res)=>{

        let response={...defaults.apiResponse};
    
        try{
            const service_response = await userService.updateProfessionalCategories(req);
            response.status=200;
            response.message=defaults.userMessages.CATEGORIES_UPDATED;
            response.body=service_response;
        }
        catch(error){
            console.log("Categories update error...",error)
            response.message=error.message;
        }
    
    return res.status(response.status).send(response);
    }



    module.exports.updateProfessionalSchedule=async(req,res)=>{

        let response={...defaults.apiResponse};
    
        try{
            const service_response = await userService.updateProfessionalSchedule(req);
            response.status=200;
            response.message=defaults.userMessages.SCHEDULE_UPDATED;
            response.body=service_response;
        }
        catch(error){
            console.log("Categories update error...",error)
            response.message=error.message;
        }
    
    return res.status(response.status).send(response);
    }



    module.exports.updateProfessionalInfo=async(req,res)=>{

        let response={...defaults.apiResponse};
    
        try{
            const service_response = await userService.updateProfessionalInfo(req);
            response.status=200;
            response.message=defaults.userMessages.PROFESSIONAL_INFO_UPDATED;
            response.body=service_response;
        }
        catch(error){
            console.log("Professional Info update error...",error)
            response.message=error.message;
        }
    
    return res.status(response.status).send(response);
    }


    module.exports.updateProfessionalRates=async(req,res)=>{

        let response={...defaults.apiResponse};
    
        try{
            const service_response = await userService.updateProfessionalRates(req);
            response.status=200;
            response.message=defaults.userMessages.PROFESSIONAL_RATES_UPDATED;
            response.body=service_response;
        }
        catch(error){
            console.log("Professional Rate update error...",error)
            response.message=error.message;
        }
    
    return res.status(response.status).send(response);
    }

 

    module.exports.updateUserMeta=async(req,res)=>{

        let response={...defaults.apiResponse};
    
        try{
            const service_response = await userService.updateUserMeta(req);
            response.status=200;
            response.message=defaults.userMessages.USER_META_UPDATED;
            response.body=service_response;
        }
        catch(error){
            console.log("User meta update error...",error)
            response.message=error.message;
        }
    
    return res.status(response.status).send(response);
    }



module.exports.categories=async(req,res)=>{

    let response={...defaults.apiResponse};

    try{
        const service_response = await userService.categories(req);
        response.status=200;
        response.message=defaults.userMessages.CATEGORIES_RETRIEVED;
        response.body=service_response;
    }
    catch(error){
        console.log("Get Current User error...",error)
        response.message=error.message;
    }

    return res.status(response.status).send(response);
}
 
