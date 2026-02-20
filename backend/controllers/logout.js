let studentprofile = require("../models/stupro")

// ✅ IDENTIFY & LOGOUT BY HALLTICKET OR FACULTYID
let logoutUser = async (req, res) => {
    try {
        let { id } = req.params  // hallticket OR facultyId
        
        if (!id) {
            return res.status(400).json({ "err": "ID (hallticket/facultyId) required" })
        }
        
        // Check if it's a student (hallticket)
        let student = await studentprofile.findOne({ hallticket: id })
        if (student) {
            // STUDENT LOGOUT
            res.status(200).json({
                "msg": "✅ Student LOGGED OUT SUCCESSFULLY!",
                "type": "student",
                "hallticket": id,
                "name": student.stuname,
                "action": "Clear localStorage/sessionStorage tokens"
            })
            return
        }
        
        // Check if it's faculty (assume faculty exists)
        // Faculty logout (no model check needed for basic logout)
        res.status(200).json({
            "msg": "✅ Faculty LOGGED OUT SUCCESSFULLY!",
            "type": "faculty", 
            "facultyId": id,
            "action": "Clear localStorage/sessionStorage tokens"
        })
        
    } catch (error) {
        res.status(500).json({ "err": "Logout failed: " + error.message })
    }
}

module.exports = { logoutUser }
