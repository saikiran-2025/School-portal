let student=require("../models/stureg")
let faculty=require("../models/facreg")
let bcrypt=require("bcrypt")
let jwt=require("jsonwebtoken")

let login=async(req,res)=>{
    try{
        let {credential, pwd} = req.body
        if (!credential || !pwd){
            return res.status(400).json({"err":"Credential and password required"})
        }
        // ✅ Check ONLY hallticket for students
        let studentUser = await student.findOne({ hallticket: credential })
        // ✅ Check ONLY facultyid for faculty
        let facultyUser = await faculty.findOne({ facultyid: credential })
        let user = studentUser || facultyUser
        if (!user){
            return res.status(404).json({"msg":"Invalid credentials"})
        }
        // ✅ Auto-detect role
        let detectedRole = studentUser ? "student" : "faculty"
        let f=await bcrypt.compare(pwd, user.pwd)
        if(f){
            return res.status(200).json({"token":jwt.sign({"_id":user._id, "role": detectedRole,"credential": credential},"school-result-portal"),"hallticket": user.hallticket || "","facultyid": user.facultyid || "","role": detectedRole})
        }
        else{
            return res.status(401).json({"msg":"Invalid password"})
        }  
    }
    catch(error){
        console.log(error)
        return res.status(500).json({"err":"Error in login"})  
    }
}
module.exports={login}
