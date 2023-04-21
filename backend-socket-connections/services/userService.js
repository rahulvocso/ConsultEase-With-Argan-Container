const User=require("../database/models/userModel");
const {registerMobileValidation, 
    personalInfoValidation,
    professionalInfoValidation, 
    professionalRatesValidation,
    handleValidation, 
    otpValidation}=require("../helpers/validation");
const {generateOTP}=require("../helpers/sms");
const jwt=require("jsonwebtoken");
const dotEnv=require("dotenv").config();
const mongoose=require("mongoose");
const {formatMongoData} = require( "../helpers/dbHelper");
const defaults=require("../defaults");
const dummy = require('mongoose-dummy');



module.exports.registerMobile =async (serviceData)=>{

   // validate mobile number
   const {error}=registerMobileValidation(serviceData);
   if (error) {
      //console.log(error.details[0].message);
      throw new Error(error);
   }

   // Insert Mobile Number
    try{
        // Check if mobile already exists
        let user=await User.findOne({mobile:serviceData.mobile});
        
        // insert if it doesnt exist
        if (!user) {
            let userNew=new User({...serviceData});
            userNew.save();
            user=userNew;
        }

        // generate Mobile OTP
        generateOTP(user);
       
        return await {
            _id:user._id,
            mobile:user.mobile,
        };
    }
    catch(error){
        console.log("Error / User Service / ");
        throw new Error(error);
    }
   
}


module.exports.verifyMobileOTP =async (serviceData)=>{
console.log("VerifyMobileOTP Data...",serviceData)
     // validate mobile number
     const {error}=otpValidation(serviceData);
     if (error) {
        throw new Error(error);
     }
    
     try{
         // get the user
         let user=await User.findOne({_id:serviceData._id,otp:serviceData.otp});
        
         if(!user)
            throw new Error("Invalid OTP");
        
        console.log("OTP Verified");

        // get JWT Auth token
        let auth_token=jwt.sign(user._id.toJSON(), process.env.JWT_SECRET);
        
        console.log(auth_token);

        //user.otp="";
        user.active=1;
        user.auth_token= auth_token;
        user.save();
        return await {
            _id:user._id,
            mobile:user.mobile,
            auth_token:auth_token
        };
        
     }
     catch(error){
         console.log("Error / User Service / ");
         throw new Error(error);
     }
    
 }



module.exports.updatePersonalInfo =async (req)=>{
     
    // validate info
     const {error}=personalInfoValidation(req.body);
     if (error) {
        //console.log(error.details[0].message);
        throw new Error(error);
     }
     
     console.log("Service Data to be updated...",req.body);
     try{
        // update Personal Info
        let user=await User.findOneAndUpdate(
            {auth_token:req.header("auth_token")},
            {
                fname:req.body.fname,
                lname:req.body.lname,
                email:req.body.email,
            },{
                new:true
            });
       
        if(!user)
           throw new Error("User not found");
       
       console.log("User Info updated");
  
       return await user;
       
    }
    catch(error){
        console.log("Error / User Service / ");
        throw new Error(error);
    }
   
}


module.exports.getUser =async (_id)=>{
     
     try{
        // retrieve user data
        let user=await User.findOne({"_id":new mongoose.Types.ObjectId(_id)});
       
        if(!user)
           throw new Error("User not found");
       
       console.log("User Info found", user);
  
       return await user;
       
    }
    catch(error){
        console.log("Error / User Service ");
        throw new Error(error);
    }
   
}


module.exports.getCurrentUser =async (req)=>{
    let dataSchedule =[...defaults.dataSchedule];
 
    try{
       // retrieve user data
       let user={};
       if (req.header("auth_token"))
           user=await User.findOne( {auth_token:req.header("auth_token")});
      
       if(!user)
          throw new Error("Current User not found");
       console.log(user.profile.schedule.length);
       if (user.profile.schedule.length<=0)
       {
            user.profile.schedule=dataSchedule;
            console.log(dataSchedule);
       }
          
       console.log("Current user Info retrieved");
 
      return await user;
      
   }
   catch(error){
       console.log("Error / User Service / ");
       throw new Error(error);
   }
  
}


module.exports.updateHandle =async (req)=>{
     
    // validate info
    const {error}=handleValidation(req.body);
    if (error) {
        throw new Error(error);
    }
    
    try{
        // update Handle Info
        let user=await User.findOneAndUpdate(
            {auth_token:req.header("auth_token")},
            {
                handle:req.body.handle 
            },{
                new:true
            });
        
      
       if(!user)
          throw new Error(" User not found");
      
      console.log("User handle updated");
 
      return await user;
      
   }
   catch(error){
       console.log("Error / User Service / ");
       throw new Error(error);
   }
  
}



module.exports.list =async ({pageNumber=1,sort="mobile",sort_type=-1,keyword=""})=>{
    let dataResponse={...defaults.dataResponse};
    let skipCount=process.env.PAGE_SIZE*(pageNumber-1);
    let count=0;
    console.log("pageNumber - skipCount - sort - type",{pageNumber,skipCount,sort,sort_type})

    let where={}

        where={
            $and:[
                    {
                        $or:[
                                {fname:  new RegExp(keyword,"i")},
                                {lname:  new RegExp(keyword,"i")},
                                {mobile:  new RegExp(keyword,"i")},
                                {handle:  new RegExp(keyword,"i")},
                                    
                            ]
                    },
                    {active:true}
            ]
        };

    try{
        // list users
        let randomObject = dummy(User, {
            ignore: ['_id','created_at', '__v','otp','schedule','profile.categories','interests'],
            returnDate: true
        })
        //console.log(randomObject);
        // console.log("[generating new data]")
        // let userNew=new User(randomObject);
        //     userNew.save();
        // console.log("userNew",userNew)

        
        let users=await User.find(
                where
            ).sort({[sort]:sort_type}).skip(skipCount).limit(process.env.PAGE_SIZE);
        count=await User.find(
            where
        ).count();
         
       if(!users)
          throw new Error(" User not found");

          dataResponse.recordCount=count;
          dataResponse.pageCount=Math.ceil(count/process.env.PAGE_SIZE);
          dataResponse.pageNumber=parseInt(pageNumber);
          dataResponse.data= [...users];
      

      console.log("Listing users...",count,Math.ceil(count/process.env.PAGE_SIZE),pageNumber);
 
      return await dataResponse;
      
   }
   catch(error){
       console.log("Error / User Service / ");
       throw new Error(error);
   }
  
}


module.exports.listProfiles =async ({createdAt=new Date(),keyword=""})=>{
     
    let where={}

        where={
            $and:[
                    {createdAt:{$lt:new Date(createdAt)}}, 
                    {
                        $or:[
                                {fname:  new RegExp(keyword,"i")},
                                {lname:  new RegExp(keyword,"i")},
                                {mobile:  new RegExp(keyword,"i")},
                                {handle:  new RegExp(keyword,"i")},
                                    
                            ]
                    },
                    {active:true},
                    {"profile.status":true}
            ]
        };

    try{
        // list user profiles
        let users=await User.find(
                where
            ).sort({ createdAt: 'desc'}).limit(process.env.PAGE_SIZE);
      
       if(!users)
          throw new Error(" Profile not found");
      
      console.log("Listing profiles...");
 
      return await formatMongoData(users);
      
   }
   catch(error){
       console.log("Error / User Profile Service / ");
       throw new Error(error);
   }
  
}






module.exports.updateProfessionalCategories =async (req)=>{
     
    // validate info - to be changed
    //  const {error}=personalInfoValidation(req.body);
    //  if (error) {
    //     //console.log(error.details[0].message);
    //     throw new Error(error);
    //  }
     
     console.log("Service Data to be updated...",req.body);
     try{
        // update Professional Categories
        let user=await User.findOneAndUpdate(
            {auth_token:req.header("auth_token")},
            {
                "profile.categories":req.body.categories
            },{
                new:true
            });
       
        if(!user)
           throw new Error("User not found");
       
       console.log("Professional Categories updated");
  
       return await user;
       
    }
    catch(error){
        console.log("Error / User Service / ");
        throw new Error(error);
    }
   
}



module.exports.updateProfessionalSchedule =async (req)=>{
     
    // validate info - to be changed
    //  const {error}=personalInfoValidation(req.body);
    //  if (error) {
    //     //console.log(error.details[0].message);
    //     throw new Error(error);
    //  }
     
     console.log("Service Data to be updated...",req.body);
     try{
        // update Professional Categories
        let user=await User.findOneAndUpdate(
            {auth_token:req.header("auth_token")},
            {
                "profile.schedule":req.body.schedule,
                "profile.status":true
            },{
                new:true
            });
       
        if(!user)
           throw new Error("User not found");
       
       console.log("Professional Schedule updated");
  
       return await user;
       
    }
    catch(error){
        console.log("Error / User Service / ");
        throw new Error(error);
    }
   
}



module.exports.categories =async (req)=>{
    try{
        // retrieve user data
        let user={};
        if (req.header("auth_token"))
            user=await User.findOne( {auth_token:req.header("auth_token")});
       
        if(!user)
           throw new Error("Current User not found");
       
       console.log("Current user Info retrieved");
  
       return await user.profile.categories;
       
    }
    catch(error){
        console.log("Error / User Service for Categories / ");
        throw new Error(error);
    }
  
}



module.exports.updateProfessionalInfo =async (req)=>{
     
    // validate req data
     const {error}=professionalInfoValidation(req.body);
     if (error) {
        throw new Error(error);
     }
     
     console.log("Service Data to be updated...",req.body);
     try{
        // update ProfessionalInfo Info
        let user=await User.findOneAndUpdate(
            {auth_token:req.header("auth_token")},
            {
                "profile.handle":req.body.handle,
                "profile.title":req.body.title,
                "profile.description":req.body.description,
                "profile.website":req.body.website,
                "profile.languages":req.body.languages,
               
            },{
                new:true
            });
       
        if(!user)
           throw new Error("Professional Info not found");
       
       console.log("Professional Info Info updated");
  
       return await user;
       
    }
    catch(error){
        console.log("Error / User Service / ");
        throw new Error(error);
    }
   
}



module.exports.updateProfessionalRates =async (req)=>{
     
    // validate req data
     const {error}=professionalRatesValidation(req.body);
     if (error) {
        throw new Error(error);
     }
     
     console.log("Service Data to be updated...",req.body);
     try{
        // update Rates
        let user=await User.findOneAndUpdate(
            {auth_token:req.header("auth_token")},
            {
                "profile.rates":req.body.rates               
            },{
                new:true
            });
       
        if(!user)
           throw new Error("Professional not found");
       
       console.log("Rates Info updated");
  
       return await user;
       
    }
    catch(error){
        console.log("Error / User Service / ");
        throw new Error(error);
    }
   
}


module.exports.updateUserMeta =async (req)=>{
     
    
    console.log("Service Data to be updated...",{
        [req.body.key]:req.body.value,
       
    });
    try{
       // update Always Available Info
       let user=await User.findOneAndUpdate(
           {auth_token:req.header("auth_token")},
           {
               [req.body.key]:req.body.value,
              
           },{
               new:true
           });
      
       if(!user)
          throw new Error("Professional not found");
      
      console.log("Update successful");
 
      return await user;
      
   }
   catch(error){
       console.log("Error / User Service / ");
       throw new Error(error);
   }
  
}


// internal functions...
const findUserByToken = async({auth_token})=>{
    try{
        let user=await User.findOne({auth_token:auth_token});
        return user;
    }
    catch(error){
        console.log("Error / User Service / ");
        throw new Error(error);
    }
}