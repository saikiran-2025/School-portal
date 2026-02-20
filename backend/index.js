require('dotenv').config();

let mongoose=require("mongoose")
let express=require("express")
let cors=require("cors")
let rt=require("./routers/router")
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("db connected")
})
let app=express()
let port = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({"extended":true}))
app.use(cors())
app.use("/",rt)
app.listen(port, ()=>{
    console.log(`🚀 Server running on port ${port}`);
});