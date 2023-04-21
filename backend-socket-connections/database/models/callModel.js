const mongoose=require("mongoose");

const callSchema=new mongoose.Schema({
    from_user:{type:mongoose.Schema.ObjectId,required:true},
    to_user:{type:mongoose.Schema.ObjectId,required:true},
    from_socket: { type: String  },
    to_socket: { type: String},
    type:{type:String,enum:["Audio","Video"],default:"Audio"},
    duration:{type:Number,default:0},
    status:{type:String,enum:["Initiated","Answered","Rejected","Unanswered","Complete"],default:"Initiated"},
    deleted:{type:Boolean, default:0},
},
{
    timestamps:true
});

module.exports =mongoose.model("Call",callSchema);