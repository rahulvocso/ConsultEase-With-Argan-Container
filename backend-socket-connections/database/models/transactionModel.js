const mongoose=require("mongoose");

const transactionSchema=new mongoose.Schema({
    from_wallet:mongoose.Schema.ObjectId,
    to_wallet:mongoose.Schema.ObjectId,
    call_id:mongoose.Schema.ObjectId,
    amount:{type:Number,required:true},
    notes:String,
    type:{type:String, enum:["transaction","commission","add","freecredit","reversal"], default:"transaction"},
    active:{type:Boolean,default:true},
    deleted:{type:Boolean, default:false},
},
{
    timestamps:true
});

module.exports =mongoose.model("Transaction",transactionSchema);