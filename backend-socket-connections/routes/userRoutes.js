const express=require("express");
const router=express.Router();
const userController=require("../controllers/userController")
const verify =require("./verifyTokens");
const {uploadToS3}=require("../helpers/awsS3")
const imageService=require("../helpers/imageService")



//router.post("/",userController.showDefault);


router.post("/registerMobile",userController.registerMobile);
router.post("/verifyMobileOTP",userController.verifyMobileOTP);

// get current user's profile
router.get("/",verify,userController.getCurrentUser);
router.get("/categories/",verify, userController.categories);

//Secure Routes

router.get("/list/",verify, userController.list);
router.get("/listProfiles/",verify, userController.listProfiles);
//router.get("/list/:createdAt",verify, userController.list);


router.get("/:_id",verify,userController.getUser);
router.post("/updatePersonalInfo",verify, userController.updatePersonalInfo);
router.post("/updateHandle",verify, userController.updateHandle);

router.post("/updateUserMeta",verify, userController.updateUserMeta);
router.post("/updateProfessionalSchedule",verify, userController.updateProfessionalSchedule);

//router.post("/updateVacationMode",verify, userController.updateVacationMode);
//router.post("/updateAlwaysAvailable",verify, userController.updateAlwaysAvailable);

//depricated...
router.post("/uploadPhoto",verify, uploadToS3);

router.post("/uploadImage",verify, async (req, res, next) =>{
    let response;
    try {
        response = await imageService.uploadImage(req);
    } catch (err) {
        console.error(`Error uploading image: ${err.message}`);
        return next(new Error(`Error uploading image: ${imageName}`));
    }
    res.send({imageUrl: response});
});

router.post("/updateProfessionalCategories",verify, userController.updateProfessionalCategories);
router.post("/updateProfessionalInfo",verify, userController.updateProfessionalInfo);
router.post("/updateProfessionalRates",verify, userController.updateProfessionalRates);


// router.post("/updatePhoto",userController.updatePhoto);
// router.post("/updateSchedule",userController.updateSchedule);


// to be coded
// router.post("/availability",userController.checkAvailability);

module.exports=router;