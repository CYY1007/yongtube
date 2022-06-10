import multer from "multer"

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
}});

export const uploadAvatar = multer({dest:"files/avatar",limits:{
    fileSize: 3000000
}})