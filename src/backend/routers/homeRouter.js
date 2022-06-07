import express from "express";
import { home } from "../controllers/homeControllers";

const homeRouter = express.Router()

homeRouter.get('/',home)

export default homeRouter