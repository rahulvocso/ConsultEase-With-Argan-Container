const User=require("../database/models/userModel");
const Call=require("../database/models/callModel");
const Rating=require("../database/models/ratingModel");
const {callInitValidation, callJoinValidation, callUpdateValidation, ratingValidation}=require("../helpers/validation");
const defaults=require("../defaults");

//const {getWallet,updateWallet}=require("../services/walletService");
 

const mongoose=require("mongoose");
const ObjectId = mongoose.Types.ObjectId;


const init =async (req)=>{


    // validate info
    const {error}=callInitValidation(params);
    if (error) {
       throw new Error(error);
    }

        try{
        // initialize new call in db
        // expect from_user, to_user, category
       console.log("aaaa",req.body.from_user);
       let call=await new Call({...req.body});
       call.save();

       if(!call)
           throw new Error("Error performing call");
       
       // update wallet balance - sender
       //let wallet1=await  updateWallet(serviceData.from_wallet,-serviceData.amount)
       //console.log("wallet 1 ", wallet1)

       console.log("Call initialized",call);
  
       return await call;
       
    }
    catch(error){
        console.log("Error / Call init service / ");
        throw new Error(error);
    }
   
}
// for internal purposes only
const joinCall =async (params)=>{


    // validate info
    const {error}=callJoinValidation(params);
    if (error) {
       throw new Error(error);
    }

    try{
    // get the call_id
    // join the call
    let call=await Call.findOneAndUpdate(
        {_id:params.call_id},
        {
            status:"Answered",
            to_user:params.to_user,
            to_socket:params.to_socket,
            
        },{
            new:true
        });

   if(!call)
       throw new Error("Error performing call join");

    console.log("Call object... ",call);
    console.log(call.to_user," joined the call ",call._id);

   return await call;
   
}
catch(error){
    console.log("Error / Call join service / ");
    throw new Error(error);
}

}

const join =async (req)=>{


    // validate info
    const {error}=callJoinValidation(req.body);
    if (error) {
       throw new Error(error);
    }

    try{
    // get the call_id
    // join the call
    // status:"Answered",
    // to_user:req.body.to_user,
    // to_socket:req.body.to_socket,

    let call=await Call.findOneAndUpdate(
        {_id:req.body.call_id},
        {...req.body},
        {
            new:true
        });

   if(!call)
       throw new Error("Error performing call join");

       console.log("Call object... ",call);
       console.log(call.to_user," joined the call ",call._id);

   return await call;
}
catch(error){
    console.log("Error / Call join service / ");
    throw new Error(error);
}

}

const update =async (req)=>{


    // validate info
    const {error}=callUpdateValidation(req.body);
    if (error) {
       throw new Error(error);
    }

    try{
    // get the call_id
    // update the call
    // only status or duration can be updated
    let call=await Call.findOneAndUpdate(
        {_id:req.body.call_id},
        {...req.body},
        {
            new:true
        });

   if(!call)
       throw new Error("Error performing call update");

       console.log("Call object... ",call);
       console.log("Call updated...",call._id," with status ",call.status);

   return await call;
}
catch(error){
    console.log("Error / Call update service / ");
    throw new Error(error);
}

}


const list = async (req)=>{
    const {pageNumber=1,sort="createdAt",sort_type=-1}=req.query;
    console.log("req",req.query);
    let dataResponse={...defaults.dataResponse};
    let skipCount=process.env.PAGE_SIZE*(pageNumber-1);
    let count=0;
    const { createdAt = new Date() } = req.query;

    let user={};
    let user_id="";
    if (req.query.user_id){
        user_id=req.query.user_id;
        console.log("if");
    }
    else if (req.header("auth_token"))
    {
        user=await User.findOne( {auth_token:req.header("auth_token")});
        user_id=user._id;
        
    }   
    console.log(user_id)

    let where = {
        $and: [
            { createdAt: { $lt: new Date(createdAt) } },
            { deleted: false }
        ],
        $or: [
            { from_user: ObjectId(user_id) },
            { to_user: ObjectId(user_id) }
        ]
    };

    try {

        // list calls
        const calls = await Call.aggregate([
            {
                $match: where
            },
            {
                $lookup: {
                    from: "users",
                    localField: "from_user",
                    foreignField: "_id",
                    as: "from_user"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "to_user",
                    foreignField: "_id",
                    as: "to_user"
                }
            },
            {
                $project: {
                    _id: 1,
                    type: 1,
                    duration: 1,
                    createdAt:1,
                    from_user: { $arrayElemAt: ["$from_user.fname", 0] },
                    from_user_id: { $arrayElemAt: ["$from_user._id", 0] },
                    to_user: { $arrayElemAt: ["$to_user.fname", 0] },
                    to_user_id: { $arrayElemAt: ["$to_user._id", 0] }
                }
                }
                ]).sort({[sort]:sort_type}).skip(skipCount).limit(parseInt(process.env.PAGE_SIZE));
                    

                count=await Call.find(
                    where
                ).count();
                 
                if (!calls) {
                    throw new Error("No calls");
                    }
                
                  dataResponse.recordCount=count;
                  dataResponse.pageCount=Math.ceil(count/process.env.PAGE_SIZE);
                  dataResponse.pageNumber=parseInt(pageNumber);
                  dataResponse.data= [...calls];
              
              console.log("Listing calls...",calls);
 
            
                return dataResponse;
            } catch (error) {
                console.log("Error / Call Listing Service / ");
                throw new Error(error);
            }
        }




const rate =async (req)=>{


    // validate info
    const {error}=ratingValidation(req.body);
    if (error) {
       throw new Error(error);
    }

    try{
   
        let rating=await new Rating({...req.body});
        rating.save();
     

   if(!rating)
       throw new Error("Error submitting rating");

       console.log("Rating... ",rating);
       console.log(rating.from_user," rated ",rating.to_user, " for call ",rating.call_id);

   return await rating;
   
}
catch(error){
    console.log("Error / Call rating service / ");
    throw new Error(error);
}

}


module.exports.init=init;
module.exports.join=join;
module.exports.update=update;
module.exports.list=list;
module.exports.rate=rate;



