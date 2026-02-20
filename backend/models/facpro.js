let mongoose=require("mongoose")
let usfp=new mongoose.Schema({
    "facultyid":String,
    "facname":String,
    "facsub":String,
    "facphoneno":Number,
    "facsal":Number,
    "facaddress":String,
    "faccity":String,
    "facstate":String,
    "facqualification":String,
    "facattend":Number,
    "facgen":String
})
let umfp=mongoose.model("facpro",usfp)
module.exports=umfp