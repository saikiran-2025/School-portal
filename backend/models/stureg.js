let mongoose=require("mongoose")
let usstureg=new mongoose.Schema({
    "hallticket":String,
    "pwd":String,
    "role":{
        "type":String,
        "default":"student"
    }
})
let umstureg=mongoose.model("stureg",usstureg)
module.exports=umstureg