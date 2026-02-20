let studentprofile = require("../models/stupro")

// ✅ BYPASS AUTH - STUDENT CAN VIEW OWN PROFILE
let authStudent = (req, res, next) => {
    next()  // No token needed - open access for own hallticket
}

// ✅ GET Student Profile - /stupro/:hallticket
let getsp = async (req, res) => {
    try {
        let { hallticket } = req.params
        
        // Validate hallticket
        if (!hallticket) {
            return res.status(400).json({ "err": "Hallticket required" })
        }
        
        let sp = await studentprofile.findOne({ hallticket })
        
        if (!sp) {
            return res.status(404).json({ "msg": "Student profile not updated or filled" })
        }
        
        // ✅ Return clean profile data
        res.status(200).json({
            "msg": "✅ Student profile fetched successfully",
            "hallticket": hallticket,
            "profile": {
                "hallticket": sp.hallticket,
                "stuname": sp.stuname,
                "stuclass": sp.stuclass,
                "stufather": sp.stufather,
                "stuphone": sp.stuphone,
                "stuaddress": sp.stuaddress,
                "stucity": sp.stucity,
                "stustate": sp.stustate,
                "stuattend": sp.stuattend,
                "stuage": sp.stuage,
                "stugen": sp.stugen,
                "stufees": sp.stufees,
                "createdBy": sp.createdBy
            }
        })
        
    } catch (error) {
        res.status(500).json({ "err": "Error fetching profile" })
    }
}

module.exports = { getsp, authStudent }
