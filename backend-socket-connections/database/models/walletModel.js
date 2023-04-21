const mongoose=require("mongoose");

const walletSchema=new mongoose.Schema({
    user_id:mongoose.Schema.ObjectId,
    balance:{type:Number,default:0,required:true},
    active:{type:Boolean, default:true},
    deleted:{type:Boolean, default:false},
},
{
    timestamps:true
});

module.exports =mongoose.model("Wallet",walletSchema);