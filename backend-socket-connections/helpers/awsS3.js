const aws = require('aws-sdk'); 
require('dotenv').config(); 

// Configure aws with your accessKeyId and your secretAccessKey
aws.config.update({
    region: process.env.AWS_S3_REGION,  
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
  })
  
const S3_BUCKET = process.env.AWS_S3_BUCKET;


// Now lets export this function so we can call it from somewhere else
module.exports.uploadToS3 = (req,res) => {
  const s3 = new aws.S3();  // Create a new instance of S3
  const fileName = req.body.fileName;
  const fileType = req.body.fileType;
  console.log(req.body);
// Set up the payload of what we are sending to the S3 api
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 500,
    ContentType: fileType,
    ACL: 'public-read'
  };

    // Make a request to the S3 API to get a signed URL which we can use to upload our file
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if(err){
            console.log(err);
            res.json({success: false, error: err})
    }
    // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved. 
    const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
      console.log("returnData",returnData);
        // Send it all back
        res.json({success:true, data:{returnData}});
    });
}