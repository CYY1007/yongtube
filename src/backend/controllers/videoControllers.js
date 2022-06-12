import { async } from "regenerator-runtime"
import User from "../../models/User"
import Video from "../../models/Video"
import Comment from "../../models/Comments"

export const getUpload = (req,res) =>{
    return res.render("Video/upload",{pageTitle:"Upload"})
}

export const postUpload = async (req,res) =>{
    const {session:{user:{_id}},body:{title,description,hashtags},file} = req
    try{
        const newVideo = await Video.create({
            fileUrl : file.location,
            title,
            description,
            hashtags: Video.formatHash(hashtags),
            owner:_id
        });
        const targetUser = await User.findById(_id);
        targetUser.videos.push(newVideo._id);
        targetUser.save();
        return res.status(201).redirect("/");
    }catch(e){
        console.log(e);
        return res.render("Video/upload",{pageTitle:"Upload",error:"Something is wrong"})
    }
}


export const detail = async (req, res) =>{
    const{params:{id}} = req
    try{
        const video = await Video.findById(id).populate("owner").populate("comments")
        if (!video)
            return res.render("404",{pageTitle:"Video not found"});
        return res.render("Video/watch",{pageTitle:`${video.title}'s info`,video,owner:video.owner})
    }catch(e){
        return res.status(400).redirect("/")
    }
}

export const getEdit = async(req,res) => {
    const {params:{id}} = req
    const targetVideo = await Video.findById(id);
    if (String(targetVideo.owner) !== String(req.session.user._id))   
        return res.status(403).redirect('/');
    if(!targetVideo){
        return res.status(400).render("404",{pageTitle:"Video not found"});
    }
    return res.render("Video/edit",{video:targetVideo})
}

export const postEdit = async (req,res) =>{
    const {params:{id},body: {title, description, hashtags}} = req
    const targetVideo = await Video.findById(id);
    console.log(targetVideo.owner);
    if (String(targetVideo.owner) !== String(req.session.user._id))
        return res.status(403).redirect('/');
    await Video.findByIdAndUpdate(id,{
        title,
        description,
        hashTags : Video.formatHash(hashtags),
    })
    return res.redirect(`/videos/${id}`)
}

export const search = async (req,res) =>{
    const {keyword} = req.query;
    let videos = []
    if (keyword)
    {
        videos = await Video.find({
            title : {
                $regex: new RegExp(keyword,"i"),
            }
        }).populate("owner");
    }
    return res.render("Video/search",{pageTitle:"Search",videos})
}

export const registerView = async (req,res) =>{
    const {params:{id}} = req;
    const target = await Video.findById(id)
    if (!target){
        console.log(id);
        return res.sendStatus(404);
    }
    target.meta.views = target.meta.views + 1;
    await target.save();
    return res.sendStatus(200);
}

export const postComment = async (req,res) =>{
    const {session:{user:{_id:userId}},
            body:{text},
            params:{id:videoId}} = req
    const video = await Video.findById(videoId);
    if (!video){
        return res.sendStatus(404)
    }
    const comment = await Comment.create({
        text,
        owner: userId,
        video: videoId,
    });
    video.comments.push(comment._id);
    video.save();
    const targetUser = await User.findById(userId);
    targetUser.comments.push(comment._id);
    targetUser.save();
    return res.status(201).json({newCommentId: comment._id});
}

export const postDeleteComment = async (req,res) =>{
    const {session:{user:{_id:userId}}, body:{commentId,videoId}} = req;
    try{
        const targetComment = await Comment.findById(commentId);
        const targetUser = await User.findById(userId);
        const targetVideo = await Video.findById(videoId);
        if (String(targetComment.owner) !== String(userId))
            return res.sendStatus(403);
        await Comment.findByIdAndDelete(commentId);
        const newUserArrary = targetUser.comments.filter((id) => String(id) !== String(commentId));
        
        targetUser.comments = newUserArrary;
        const newVideoArray = targetVideo.comments.filter((id)=>String(id) !== String(commentId));
        targetVideo.comments = newVideoArray;
        targetUser.save();
        targetVideo.save();
        return res.sendStatus(200)
    }catch(e){
        return res.sendStatus(400);
    }
    res.end();
}