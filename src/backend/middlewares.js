import multer from "multer"
import multerS3 from "multer-s3"
import aws from "aws-sdk"

const s3 = new aws.S3({
    credentials:{
        accessKeyId:process.env.AWS_ID,
        secretAccessKey:process.env.AWS_SECRET,
    }
})

const multerUploader = multerS3({
    s3,
    bucket:`ddoltube`,
    acl: "public-read",
})

export const editLocals = (req,res,next) =>{
    res.locals.siteTitle = "yongtube"
    res.locals.loggedIn = req.session.loggedIn;
    res.locals.user = req.session.user
    // console.log(res.locals)
    next();
}

export const isLogin = (req,res,next)=>{
    if (req.session.loggedIn)
        next()
    else{
        return res.status(403).redirect("/users/login")
    }
}

export const isPublic = (req,res,next) =>{
    if(!req.session.loggedIn)
        next();
    else{
        return res.status(403).redirect("/")
    }
}

export const uploadVideo = multer({dest:"files/videos/",limits:{
    fileSize: 10000000,
},
storage : multerUploader});

export const uploadAvatar = multer({dest:"files/avatar",limits:{
    fileSize: 3000000
},
storage : multerUploader})