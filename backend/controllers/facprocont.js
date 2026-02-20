let facultyprofile=require("../models/facpro")

let getfp=async(req,res)=>{
    try{
        let { facultyid }=req.params
        if(!facultyid){
            return res.status(400).json({"err":"Facultyid is required"})
        }
        let fp=await facultyprofile.findOne({ facultyid })
        if(!fp){
            return res.status(404).json({"msg":"Faculty profile not filled or updated"})
        }
        else{
            return res.status(200).json({
                "msg":"Faculty profile fetched successfully",
                "profile":{
                    "facultyid": fp.facultyid,
                    "facname": fp.facname,
                    "facsub": fp.facsub,
                    "facphoneno": fp.facphoneno,
                    "facsal": fp.facsal,
                    "facaddress": fp.facaddress,
                    "faccity": fp.faccity,
                    "facstate": fp.facstate,
                    "facqualification": fp.facqualification,
                    "facattend": fp.facattend,
                    "facgen": fp.facgen
                }
            })
        }
    }
    catch(error){
        console.log(error)
        return res.status(500).json({"err":"error fetching profile"})
    }
}

let updatefp=async(req,res)=>{
    try{
        let { facultyid } = req.params
        if(!facultyid){
            return res.status(400).json({"err":"Faculty ID is required"})
        }
        let fp = await facultyprofile.findOneAndUpdate({facultyid: facultyid}, req.body, {new: true, runValidators: true})
        if(!fp){
            return res.status(404).json({"msg":"Faculty profile not found"})
        }
        res.status(200).json({
            "msg": "Faculty profile updated successfully",
            "profile": fp
        })
    }
    catch(error){
        console.log(error)
        res.status(500).json({"err":"Error updating profile"})
    }
}


let deletefp=async(req,res)=>{
    try{
        let { facultyid } = req.params
        if(!facultyid){
            return res.status(400).json({"err":"Faculty ID is required"})
        }
        let fp = await facultyprofile.findOneAndDelete({facultyid})
        if(!fp){
            return res.status(404).json({"msg":"Faculty profile not found"})
        }
        res.status(200).json({
            "msg": "Faculty profile deleted successfully"
        })
    }
    catch(error){
        console.log(error)
        res.status(500).json({"err":"Error deleting profile"})
    }
}

module.exports={getfp,updatefp,deletefp}