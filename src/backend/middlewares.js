import multer from "multer"
import multerS3 from "multer-s3"
import aws from "aws-sdk"

const s3 = new aws.S3({
    credentials:{
        accessKeyId:process.env.AWS_ID,
        secretAccessKey:process.env.AWS_SECRET,
    }
})

const isHeroku = process.env.NODE_ENV === "production"

const s3ImageUploader = multerS3({
    s3,
    bucket:`ddoltube/images`,
    acl: "public-read",
})

const s3VideoUploader = multerS3({
    s3,
    bucket:`ddoltube/videos`,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE
})

export const editLocals = (req,res,next) =>{
    res.locals.siteTitle = "yongtube"
    res.locals.loggedIn = req.session.loggedIn;
    res.locals.user = req.session.user
    res.locals.isHeroku = isHeroku
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
storage : isHeroku ?  s3VideoUploader : undefined});

export const uploadAvatar = multer({dest:"files/avatar",limits:{
    fileSize: 3000000
},
storage : isHeroku ?  s3ImageUploader : undefined})