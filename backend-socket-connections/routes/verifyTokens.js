const jwt=require("jsonwebtoken");
const defaults=require("../defaults")


module.exports=function verifyToken(req,res,next){
    let response={...defaults.apiResponse};

    const token=req.header("auth_token");

    if (!token) {
        response.status=401;
        response.message=defaults.apiMessages.ACCESS_DENIED;
        return res.status(response.status).send(response);
        
    }

    try{
        const verified=jwt.verify(token,process.env.JWT_SECRET);
        req.user=verified;
        next();
    }
    catch(err){
        response.status=400;
        response.message=defaults.apiMessages.INVALID_TOKEN;
        return res.status(response.status).send(response);



    }

}