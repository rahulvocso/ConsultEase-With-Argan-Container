const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    mobile:{type:String,required:true,unique:true},
    email:String,
    fname:String,
    lname:String,
    handle:String,
    photo:String,
    active:{type:Boolean, default:false},
    deleted:{type:Boolean, default:false},
    profile:{
        title:String,
        description:String,
        photo:String,
        website:String,
        handle:String,
        categories:[],
        languages:[],
        rates:{
            audio_call:{type:Number,default:0},
            video_call:{type:Number,default:0},
        },
        schedule:[],
        vacation:{type:Boolean, default:false},
        overrideSchedule:{type:Boolean, default:false},
        alwaysAvailable:{type:Boolean, default:false},
        status:{type:Number, default:0},
    },
    stats:{
        rating_count:{type:Number,default:0},
        rating_average:{type:Number,default:0},
        view_count:{type:Number,default:0},
    },

    auth_token:String,
    otp:String,
    interests:[],
    last_login:{
        type:Date,
        default:Date.now
    },
},
{
    timestamps:true
});

module.exports =mongoose.model("User",userSchema);