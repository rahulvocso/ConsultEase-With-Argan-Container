const mongoose=require("mongoose");

const categorySchema=new mongoose.Schema({
    name:{type:String,required:true},
    text:String,
    icon:String,
    stats:{
        professionals:{type:Number, default:0},
        interests:{type:Number, default:0},
        views:{type:Number, default:0},
    },
    active:{type:Boolean,default:false},
     
},
{
    timestamps:true
});

module.exports =mongoose.model("Category",categorySchema);