const mongoose=require("mongoose");

const ratingSchema=new mongoose.Schema({
    from_user:{type:mongoose.Schema.ObjectId,required:true},
    to_user:{type:mongoose.Schema.ObjectId,required:true},
    call_id:{type:mongoose.Schema.ObjectId,required:true},
    stars:{type:Number,required:true},
    text:String,
    active:{type:Boolean,default:false},
    deleted:{type:Boolean,default:false},
},
{
    timestamps:true
});

module.exports =mongoose.model("Rating",ratingSchema);