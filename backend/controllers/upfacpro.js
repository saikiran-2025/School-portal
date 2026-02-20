let facultyprofile=require("../models/facpro")


let uploadfp=async(req,res)=>{
    try{
        let { facultyid } = req.body
        if(!facultyid){
            return res.status(400).json({"err":"Faculty ID is required"})
        }
        let exists = await facultyprofile.findOne({facultyid})
        if(exists){
            return res.status(400).json({"err":"Faculty profile already exists"})
        }
        let fp = new facultyprofile(req.body)
        await fp.save()
        res.status(201).json({"msg": "Faculty profile created successfully","profile": fp})
    }
    catch(error){
        console.log(error)
        res.status(500).json({"err":"Error creating profile"})
    }
}
module.exports={uploadfp}