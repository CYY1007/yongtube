import User from "../../models/User"
import Video from "../../models/Video"

export const getUpload = (req,res) =>{
    return res.render("Video/upload",{pageTitle:"Upload"})
}

export const postUpload = async (req,res) =>{
    const {session:{user:{_id}},body:{title,description,hashtags}} = req
    try{
        const newVideo = await Video.create({
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

//populate
export const detail = async (req, res) =>{
    const{params:{id}} = req
    try{
        const video = await Video.findById(id).populate("owner");
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
    if(!targetVideo){
        return res.status(400).render("404",{pageTitle:"Video not found"});
    }
    return res.render("Video/edit",{video:targetVideo})
}

export const postEdit = (req,res) =>{
    
}

export const search = (req,res) =>{
    
}