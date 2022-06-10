import express from "express";
import { detail, getEdit, getUpload, postEdit, postUpload, search } from "../controllers/videoControllers";
import { isLogin, uploadVideo } from "../middlewares";


const videoRouter = express.Router();

videoRouter.route('/upload').all(isLogin).get(getUpload).post(uploadVideo.single("video"),postUpload)
videoRouter.route('/:id([0-9a-f]{24})/edit').all(isLogin).get(getEdit).post(postEdit)
videoRouter.get('/:id([0-9a-f]{24})',detail)
videoRouter.get('/search',search)

export default videoRouter;