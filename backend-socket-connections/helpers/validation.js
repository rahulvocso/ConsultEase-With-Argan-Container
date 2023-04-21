const Joi=require("@hapi/joi");

//Register Mobile Validation
const registerMobileValidation=data=>{
    const schema=Joi.object({
        mobile:Joi.string().length(10).pattern(/^[0-9]+$/).required()
    });
    return schema.validate(data);
};
//OTP Validation
const otpValidation=data=>{

    const schema=Joi.object({
        _id:Joi.string().max(100).pattern(/^[a-z0-9]+$/).required(),
        otp:Joi.string().length(6).pattern(/^[0-9]+$/).required()
    });
    return schema.validate(data);
};

//Personal Info Validation
const personalInfoValidation=data=>{

    const schema=Joi.object({
        fname:Joi.string().min(3).max(25).required(),
        lname:Joi.string().min(2).max(25).required(),
//        handle:Joi.string().min(3).max(25).pattern(/^[a-z0-9]+$/).required(),
        email:Joi.string().email(),
        
    });
    return schema.validate(data);
};


//Professional Info Validation
const professionalInfoValidation=data=>{

    const schema=Joi.object({
        handle:Joi.string().min(3).max(25).pattern(/^[a-z0-9\-]+$/).required(),
        title:Joi.string().min(6).max(60).required(),
        description:Joi.string().max(254),
        website:Joi.string().uri(),
        languages:Joi.array(),
        
    });
    return schema.validate(data);
};


//Professional Rates Validation
const professionalRatesValidation=data=>{

    const schema=Joi.object({
        rates:{
            audio_call:Joi.number().min(5).max(1000).required(),
            video_call:Joi.number().min(10).max(1000).required()
        },
    });
    return schema.validate(data);
};




//User handle validation
const handleValidation=data=>{

    const schema=Joi.object({
        handle:Joi.string().min(3).max(25).pattern(/^[a-z0-9\-]+$/).required(),
        
    });
    return schema.validate(data);
};




// Wallet/Transfer Validation
const transferValidation=data=>{

    const schema=Joi.object({
        from_wallet:Joi.required(),
        to_wallet:Joi.required(),
        amount:Joi.number().min(1).required(),
        notes:Joi.string(),
        call_id:Joi.string(),
        type:Joi.string(),
        
    });
    return schema.validate(data);
};




// Call Init Validation
const callInitValidation=data=>{

    const schema=Joi.object({
        from_user:Joi.string().required(),
        from_socket:Joi.string().required(),
        to_user:Joi.string(),
        to_socket:Joi.string(),
    });
    return schema.validate(data);
};



// Call Join Validation
const callJoinValidation=data=>{

    const schema=Joi.object({
        call_id:Joi.string().required(),
        to_user:Joi.string().required(),
        to_socket:Joi.string().required(),
    });
    return schema.validate(data);
};


// Call Update Validation
const callUpdateValidation=data=>{

    const schema=Joi.object({
        call_id:Joi.string().required(),
        status:Joi.string(),
        duration:Joi.number(),
    });
    return schema.validate(data);
};



// Rating Join Validation
const ratingValidation=data=>{

    const schema=Joi.object({
        from_user:Joi.string().required(),
        to_user:Joi.string().required(),
        call_id:Joi.string().required(),
        stars:Joi.number().min(1).max(5).required(),
        text:Joi.string().max(500),
        status:Joi.boolean(),
        
    });
    return schema.validate(data);
};




module.exports.registerMobileValidation=registerMobileValidation;
module.exports.otpValidation=otpValidation;
module.exports.personalInfoValidation=personalInfoValidation;

module.exports.professionalInfoValidation=professionalInfoValidation;
module.exports.professionalRatesValidation=professionalRatesValidation;

module.exports.handleValidation=handleValidation;

module.exports.transferValidation=transferValidation;
module.exports.callInitValidation=callInitValidation;
module.exports.callJoinValidation=callJoinValidation;
module.exports.callUpdateValidation=callUpdateValidation;
module.exports.ratingValidation=ratingValidation;