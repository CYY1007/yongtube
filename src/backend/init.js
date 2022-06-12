import "regenerator-runtime"
import "dotenv/config"
import "./db"
import "../models/User"
import "../models/Video"
import "../models/Comments"
import app from "./server";


const port = process.env.PORT

app.listen(port, () => console.log(`Server is on http://localhost:${port} 🚀`))