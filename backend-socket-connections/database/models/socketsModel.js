const mongoose=require("mongoose");

const socketSchema=new mongoose.Schema({
    user_id:{type:ObjectId,required},
    socket_id:String,
    status:{enum:["online","busy","idle","offline"],default:"online"},
},
{
    timestamps:true
});

module.exports =mongoose.model("Sockets",socketSchema);