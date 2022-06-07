import express from "express";
import { getChangePass, getEditProfile, getJoin, getLogin, logout, postChangePass, postEditProfile, postJoin, postLogin, showProfile } from "../controllers/userControllers";

const userRouter = express.Router()

userRouter.route('/join').get(getJoin).post(postJoin)
userRouter.route('/login').get(getLogin).post(postLogin)
userRouter.get('/logout',logout)
userRouter.route('/changepass').get(getChangePass).post(postChangePass)
userRouter.get('/profile/id:([0-9a-f]{24})',showProfile)
userRouter.route('/profile/edit').get(getEditProfile).post(postEditProfile)

export default userRouter;
