const aws = require('aws-sdk'); 
require('dotenv').config(); 
const s3 = new aws.S3({});


const User=require("../database/models/userModel");
const {personalInfoValidation}=require("../helpers/validation");
const mongoose=require("mongoose");
const defaults=require("../defaults");

// Configure aws with your accessKeyId and your secretAccessKey
aws.config.update({
    region: process.env.AWS_S3_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
  })
  

module.exports.uploadImage =async (req)=>{

    const {image,imageName="",type}=req.body;
   

    const params = {
        Bucket: `${process.env.AWS_S3_BUCKET}`,
        Key: `avatars/${Date.now()}-${imageName}`,
        Body: new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64'),
        ContentType: type
    };

    //console.log("params", params);

    let data;

    try {
        data = await promiseUpload(params);
    } catch (err) {
        console.error(err);

        return "";
    }
    console.log("s3 data",data.Location);


    // save the image link in database, for the user...
    try{
             let user=await User.findOneAndUpdate(
            {auth_token:req.header("auth_token")},
            {
                photo:data.Location,
            },{
                new:true
            });

            // TODO - write code to delete prevous uploaded image ( if any )...

       
        if(!user)
        {
           throw new Error("User not found - can't update image");
           // TODO - write code to delete uploaded image...
        }
       console.log("Image uploaded and saved to database");
       
    }
    catch(error){
        console.log("Error / Image Service / ");
        throw new Error(error);
    }


    return await data.Location;
}


/**
 * @description Uploads an image to S3
 * @param imageName Image name
 * @param base64Image Image body converted to base 64
 * @param type Image type
 * @return string S3 image URL or error accordingly
 */
//deprecated....
module.exports.uploadPhoto =async (imageName, base64Image, type)=>{  

    const params = {
        Bucket: `${process.env.AWS_S3_BUCKET}`,
        Key: `avatars/${Date.now()}-${imageName}`,
        Body: new Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64'),
        ContentType: type
    };

    //console.log("params", params);

    let data;

    try {
        data = await promiseUpload(params);
    } catch (err) {
        console.error(err);

        return "";
    }
    console.log("s3 data",data.Location);


    // save the image link in database, for the user...
    try{
        let user=await User.findOneAndUpdate(
            {auth_token:req.header("auth_token")},
            {
                photo:await data.Location.link
            });
       
        if(!user)
        {
           throw new Error("User not found - can't update image");
           // write code to delete uploaded image...
        }

       console.log("Image uploaded and saved to database");
  
       //return await user;
       
    }
    catch(error){
        console.log("Error / Image Service / ");
        throw new Error(error);
    }


    return data.Location;
}
/**
 * @description Promise an upload to S3
 * @param params S3 bucket params
 * @return data/err S3 response object
 */
function promiseUpload(params) {
    return new Promise(function (resolve, reject) {
        s3.upload(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

 