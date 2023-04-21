const categoryService=require("../services/categoryService");
const defaults=require("../defaults");
const { result } = require("@hapi/joi/lib/base");

const getCategory=async(req,res)=>{

    let response={...defaults.apiResponse};

    try{
        const service_response = await categoryService.getCategory(req.params._id);
        response.status=200;
        response.message=defaults.categoryMessages.INFO;
        response.body=service_response;
    }
    catch(error){
        console.log("Get User error...",error)
        response.message=error.message;
    }

return res.status(response.status).send(response);
}
 


const list =async(req,res)=>{
console.log("category list", req.query);
    let response={...defaults.apiResponse};
     try{
        const service_response = await categoryService.list(req.query);
        response.status=200;
        response.message=defaults.categoryMessages.LIST;
        response.body=service_response;
    }
    catch(error){
        console.log("Error listing categories...",error)
        response.message=error.message;
    }

return res.status(response.status).send(response);
}
 

module.exports.getCategory=getCategory;
module.exports.list=list;