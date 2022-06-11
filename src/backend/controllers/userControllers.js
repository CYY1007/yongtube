import User from "../../models/User"
import bcrypt from "bcrypt"
import fetch from "node-fetch"

export const getJoin = (req,res) =>{
    return res.render("User/join.pug",{pageTitle:"Join"})
}

// pending
export const postJoin = async (req,res) =>{
    const {body: {email, username,password,name, checkpass}} = req
    if (password !== checkpass){
        return res.status(400).render("User/join",{pageTitle:"Join",error:"password validation is wrong"})
    }
    const isExist = await User.exists({$or:[{username},{email}]});
    if(isExist){
        return res.status(400).render("User/join",{pageTitle:"Join",error:"useranme or email is alredy taken"})
    }
    try{
        await User.create({
            email,
            username,
            password,
            name
        });
        return res.status(201).redirect('/users/login');
    }catch(error){
        return res.status(400).render("join",{pageTitle:"join",error:"something is wrong..."})
    }
}

export const getLogin = (req,res) =>{
    res.render("User/login",{pageTitle:"Login"})
}

export const postLogin = async (req,res) =>{
    const {body:{email,password}} = req;
    const user = await User.findOne({
        email
    })
    if(!user){
        return res.status(400).render("User/login",{pageTitle:"Login",error:"email is not found"})
    }
    const ok = await bcrypt.compare(password,user.password);
    if(!ok){
        return res.status(400).render("User/login",{pageTitle:"Login",error:"password is wrong"})
    }
    if(user.isO_Auth){
        return res.status(400).render("User/login",{pageTitle:"Login",error:"log in with kakao"})
    }
    req.session.loggedIn = true;
    req.session.user = user
    return res.status(200).redirect('/')
}

export const startKakao = (req,res) =>{
    const ApiUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT}&prompt=login&response_type=code`
    return res.redirect(ApiUrl);
}

export const finishKakao = async (req,res) =>{
    const {code} = req.query
    const tokenApiUrl = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT}&code=${code}`;
    const tokenData = await fetch(tokenApiUrl,{
        method:"POST",
        headers:{
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
    const token = await tokenData.json()
    const finalApiUrl = `https://kapi.kakao.com/v2/user/me`
    const userData = await fetch(finalApiUrl,{
        method:"POST",
        headers:{
            "Authorization" : `Bearer ${token.access_token}`,
            "Content-type" : "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
    const user = await userData.json();
    const {kakao_account:{
        profile:{
            nickname,profile_image_url:avatarUrl
        },email}} = user
    console.log(nickname,avatarUrl,email);
    if (!email){
        res.render("User/login",{pageTitle:"Login",error:"You must agree to give us your email in kakao"})
    }
    let ourUser = await User.findOne({email});
    if(!ourUser){
        ourUser = await User.create({
            name:nickname,
            email,
            username:nickname,
            password:"",
            isO_Auth: true,
            isO_Auth_profile: true,
            avatarUrl
        })
    }
    req.session.loggedIn = true,
    req.session.user = ourUser;
    return res.redirect("/")
}

export const getEditProfile = (req,res) =>{
    return res.render("User/edit-profile",{pageTitle:"Edit your profile!"})
}

export const postEditProfile = async (req,res) =>{
    const {session:{user:{_id, username:oldUsername, email:oldEmail}}, body:{email, username}, file} = req;
    let existing = null;
    if(oldUsername === username && oldEmail !== email)
        existing = await User.exists({email});
    else if (oldUsername !== username && oldEmail === email)
        existing = await User.exists({username})
    else if (oldUsername !== username && oldEmail !== email){
        existing = await User.exists({$or: [{username},{email}]})
    }
    if (existing){
        return res.render("User/edit-profile",{pageTitle:"Edit Profile",error: "email or username is alredy taken"})
    }
    const target = await User.findById(_id);
    if (!target){
        return res.status(404).redirect('/');
    }
    target.username = username;
    target.email = email;
    if (file)
        target.isO_Auth_profile = target.isO_Auth && target.isO_Auth_profile && (target.avatarUrl === file.path)? true : false
    target.avatarUrl = file ? file.path : target.avatarUrl;
    target.save();
    req.session.user = target
    return res.redirect(`/users/${target._id}/profile`)
}

export const getChangePass = (req,res) =>{
    res.render("User/change-pass",{pageTitle:"Change Password"})
}

export const postChangePass = async (req,res) =>{
    const {session:{user:{password}},params:{id},body:{oldpassword,password:newPass,checkpass}}=req
    const exist = User.exists({_id: id});
    if(!exist){
        return res.render("404",{pageTitle:"user is not found"})
    }
    const ok = await bcrypt.compare(oldpassword,password)
    if(!ok){
        return res.render("User/change-pass",{error:"password is wrong"})
    }
    if (newPass !== checkpass){
        return res.render("User/change-pass",{error:"password validation fail"})
    }
    const target = await User.findById(id)
    target.password = newPass
    target.save()
    return res.redirect("/users/logout");
}

export const logout = (req,res) =>{
    req.session.destroy();
    return res.redirect('/');
}

export const showProfile = async (req, res) =>{
    const {params: {id}} = req
    const user = await User.findById(id).populate({
        path: "videos",
        populate:{
            path:"owner",
            model:"User"
        }
    })
    if(!user){
        return res.status(404).render("404",{pageTitle:"user not found"});
    }
    return res.render("User/profile",{pageTitle:`${user.username}'s profile`, target:user});
    
}