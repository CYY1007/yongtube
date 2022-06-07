import express from "express"
import home from "./routers/homeRouter"
import user from "./routers/userRouter";
import flash from "express-flash";

const app = express();

app.set("view engine","pug")
app.set("views",process.cwd() + '/src/views');
app.use(express.urlencoded({extended:true}));
app.use(express.json());
//app.use(flash())
app.use('/',home)
app.use('/users',user)
export default app;