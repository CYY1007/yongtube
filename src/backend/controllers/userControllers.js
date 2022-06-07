import User from "../../models/User"

export const getJoin = (req,res) =>{
    return res.render("User/join.pug",{pageTitle:"Join"})
}

// pending
export const postJoin = async (req,res) =>{
    const {body: {email, username,password,name, checkpass}} = req
    if (password !== checkpass){
        //req.flash("error","password validation is wrong")
        //return res.status(400).redirect("/users/join")
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
    res.send("getjoin")
}

export const postLogin = (req,res) =>{
    res.send("getjoin")
}

export const getEditProfile = (req,res) =>{
    res.send("getjoin")
}

export const postEditProfile = (req,res) =>{
    res.send("getjoin")
}

export const getChangePass = (req,res) =>{
    res.send("getjoin")
}

export const postChangePass = (req,res) =>{
    res.send("getjoin")
}

export const logout = (req,res) =>{
    res.send("logout")
}

export const showProfile = (req, res) =>{
    res.send("show profile")
}