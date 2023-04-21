module.exports={
    apiResponse:{
        status:400,
        message:"",
        body:{}
    },
    dataResponse:{
        recordCount:0,
        pageCount:0,
        pageNumber:0,
        data:{}
    },
    userMessages:{
        REGISTERED:"Enter OTP",
        OTP_VERIFIED:"OTP Verified",
        PERSONAL_INFO_UPDATED:"Personal info updated",
        PROFESSIONAL_INFO_UPDATED:"Professional info updated",
        PROFESSIONAL_RATES_UPDATED:"Rates updated",
        USER_META_UPDATED:"User info updated",
        USER_INFO:"User info retrieved",
        HANDLE_UPDATE:"User Handle updated",
        LIST:"Listing users",
        CATEGORIES_RETRIEVED:"User categories retrieved",
        CATEGORIES_UPDATED:"Categories updated",
        SCHEDULE_UPDATED:"Availability Schedule updated",
    },
    walletMessages:{
        BALANCE:"Balance Amount retrieved",
        TRANSFER:"Amount transferred",
        TRANSFER_FEE:"Fee credited ( less commission )",
        REVERSE:"Amount reversed",
        REVERSE_FEE:"Fee reversed ( including commission )",
        LIST:"Transactions list returned",
    },
    callMessages:{
        DETAIL:"Call detail retrieved",
        INIT:"Call initialized",
        JOIN:"Call joined",
        UPDATE:"Call updated",
        RATE:"Call rating submitted",
        LIST:"Calls list returned",
    },
    categoryMessages:{
        INFO:"Category details retrieved",
        LIST:"Categories list returned",
    },
    apiMessages:{
        ACCESS_DENIED:"Access denied!\nThis incident is being reported.",
        INVALID_TOKEN:"Invalid authentication token"
    },
    dataSchedule:[
        {code:"mon", name:"Monday", isAvailable:true, slots:[{from:"10:00 am",to:"06:00 pm"},]},
        {code:"tue", name:"Tuesday", isAvailable:true, slots:[{from:"10:00 am",to:"06:00 pm"},]},
        {code:"wed", name:"Wednesday", isAvailable:true, slots:[{from:"10:00 am",to:"06:00 pm"},]},
        {code:"thu", name:"Thursday", isAvailable:true, slots:[{from:"10:00 am",to:"06:00 pm"},]},
        {code:"fri", name:"Friday", isAvailable:true, slots:[{from:"10:00 am",to:"06:00 pm"},]},
        {code:"sat", name:"Saturday", isAvailable:true, slots:[{from:"10:00 am",to:"06:00 pm"},]},
        {code:"sun", name:"Sunday"},
      ]
}