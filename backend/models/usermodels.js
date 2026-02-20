let mongoose=require("mongoose")
let us=new mongoose.Schema({
    "hallticket": String,
    "facultyid": String,
    "pwd": String,
    "role": {
        type: String,
        enum: ["student", "faculty"],  
        required: true
    }
})
let um=mongoose.model("login", us)  
module.exports=um
