let mongoose=require("mongoose")
let usdr=new mongoose.Schema({
    "hallticket":String,
    "disres":{
        type:Object,
        default:{}
    }
})
let umdr=mongoose.model("disres",usdr)
module.exports=umdr