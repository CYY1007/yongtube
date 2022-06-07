export const editLocals = (req,res,next) =>{
    res.locals.siteTitle = "yongtube"
    next();
}