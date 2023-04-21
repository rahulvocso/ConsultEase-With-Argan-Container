const dotEnv=require("dotenv").config();
const msg91=require("msg91-api")(process.env.SMS_AUTH_KEY);
const User=require("../database/models/userModel");


//Generate OTP
const generateOTP=async(user)=>{
    let result={};

    console.log("Generating otp...")

    // generate OTP number
    let otp=getRandomInt(process.env.SMS_OTP_OTP_LENGTH);
    var args = {
        "flow_id": process.env.SMS_FLOW_ID,
        "sender": process.env.SMS_SENDER_ID,
        "mobiles":`91${user.mobile}`,
        "var":otp
      };


      // send OTP via SMS and save in user records for varification
       msg91.sendSMS(args, function(err, response){
          
            if (err)
                throw new Error(err);

            if (response && response.type=="error")
                throw new Error(response.message);
                

          
            console.log("sendSMS Response",response);

            user.otp=otp;
            user.save();


      
      });

};

module.exports.generateOTP=generateOTP;
 
// Generates N digit random Integer number
const getRandomInt=(digit)=>{
    return Math.random().toFixed(digit).split('.')[1];
}