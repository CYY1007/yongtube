import express from "express"
import { postComment, postDeleteComment, registerView } from "../controllers/videoControllers";
import { isLogin } from "../middlewares";
const apiRouter = express.Router();

apiRouter.post('/videos/:id([0-9a-f]{24})/end',registerView);

apiRouter.post('/videos/:id([0-9a-f]{24})/comment',isLogin,postComment)

apiRouter.delete('/videos/:id([0-9a-f]{24})/comment/delete',isLogin,postDeleteComment)

export default apiRouter;