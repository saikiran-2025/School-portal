let mongoose=require("mongoose")
let usfacreg=new mongoose.Schema({
    "facultyid":String,
    "pwd":String,
    "role":{
        "type":String,
        "default":"faculty"
    }
})
let umfacreg=mongoose.model("facreg",usfacreg)
module.exports=umfacreg