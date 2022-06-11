import express from "express"
import home from "./routers/homeRouter"
import user from "./routers/userRouter";
import video from "./routers/videoRouter"
import flash from "express-flash";
import session from "express-session"
import MongoSession from "connect-mongo"
import { editLocals } from "./middlewares";
import api from "./routers/apiRouter"

const app = express();

app.set("view engine","pug")
app.set("views",process.cwd() + '/src/views');
app.use(express.urlencoded({extended:true}));
app.use(express.text());
app.use(express.json());
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoSession.create({mongoUrl: process.env.DB_URL})
}));
// app.use(flash())
app.use("/files",express.static("files"));
app.use("/assets",express.static("assets"));
app.use(editLocals) 
app.use('/',home)
app.use('/users',user)
app.use('/videos',video)
app.use('/api',api);
export default app;