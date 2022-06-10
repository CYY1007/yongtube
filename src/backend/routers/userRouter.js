import express from "express";
import { finishKakao,getChangePass, getEditProfile, getJoin, getLogin, logout, postChangePass, postEditProfile, postJoin, postLogin, showProfile, startKakao } from "../controllers/userControllers";
import { isLogin, isPublic, uploadAvatar } from "../middlewares";

const userRouter = express.Router()

userRouter.route('/join').all(isPublic).get(getJoin).post(postJoin)
userRouter.route('/login').all(isPublic).get(getLogin).post(postLogin)
userRouter.get('/logout',isLogin,logout)
userRouter.route('/:id([0-9a-f]{24})/profile/edit/change-password').all(isLogin).get(getChangePass).post(postChangePass)
userRouter.get('/:id([0-9a-f]{24})/profile',showProfile)
userRouter.route('/:id([0-9a-f]{24})/profile/edit').all(isLogin).get(getEditProfile).post(uploadAvatar.single("avatar"),postEditProfile)
userRouter.get('/kakao/start',isPublic,startKakao)
userRouter.get('/kakao/finish',isPublic,finishKakao)

export default userRouter;
