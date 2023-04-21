const Category=require("../database/models/categoryModel");
const { otpValidation}=require("../helpers/validation");
const dotEnv=require("dotenv").config();
const mongoose=require("mongoose");
const defaults=require("../defaults");


module.exports.getCategory =async (_id)=>{
     
     try{
        // retrieve user data
        let category=await Category.find(new mongoose.Types.ObjectId(_id));
       
        if(!user)
           throw new Error("Category not found");
       
       console.log("Category Info found");
  
       return await category;
       
    }
    catch(error){
        console.log("Error / Category Service / ");
        throw new Error(error);
    }
   
}


module.exports.list =async ({sort="order",sort_type=1,keyword=""})=>{
    let dataResponse={...defaults.dataResponse};

    let where={}

        where={
            $and:[
                     
                    {
                        $or:[
                                {name:  new RegExp(keyword,"i")},
                                {text:  new RegExp(keyword,"i")}
                            ]
                    },
                    {active:true}
            ]
        };

    try{

        let categories=await Category.find(
            where
        ).sort({[sort]:sort_type}).limit(process.env.PAGE_SIZE_MAX);
       
        count=await Category.find(
        where
        ).count();
       
        if(!categories)
            throw new Error(" Categories not found");
 
        dataResponse.recordCount=count;
        dataResponse.data= [...categories];
  
      return await dataResponse;
      
   }
   catch(error){
       console.log("Error / Category Service / ");
       throw new Error(error);
   }
  
}


