import "dotenv/config"
import "./db"
import "../models/User"
import "../models/Video"
import app from "./server";


const port = process.env.PORT

app.listen(port, () => console.log(`Server is on http://localhost:${port} 🚀`))