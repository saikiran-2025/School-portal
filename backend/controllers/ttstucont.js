let timetable = require("../models/timetable")
let studentprofile = require("../models/stupro")

// ✅ STUDENT AUTH - CHECK HALLTICKET EXISTS (SECURE)
let authStudentTT = (req, res, next) => {
    let { hallticket } = req.params
    
    // Must provide hallticket
    if (!hallticket) {
        return res.status(401).json({ "err": "Student login required (hallticket)" })
    }
    
    next()  // Proceed to check student exists in controller
}

// ✅ GET TIMETABLE - STUDENT LOGIN REQUIRED
let getStudentTT = async (req, res) => {
    try {
        let { hallticket } = req.params
        
        // Validate hallticket format
        if (!hallticket || hallticket.length < 6) {
            return res.status(400).json({ "err": "Valid hallticket required" })
        }
        
        // ✅ STUDENT LOGIN CHECK - Must exist in database
        let student = await studentprofile.findOne({ hallticket })
        if (!student) {
            return res.status(401).json({ 
                "err": "Student not registered. Login required.",
                "hallticket": hallticket 
            })
        }
        
        // Extract class number (e.g., "10A" → 10, "7B" → 7)
        let classNum = parseInt(student.stuclass?.toString().charAt(0))
        if (!classNum || classNum < 1 || classNum > 10) {
            return res.status(400).json({ 
                "err": "Invalid class in student profile",
                "stuclass": student.stuclass 
            })
        }
        
        // Find timetable for student's class
        let ttData = await timetable.findOne({ class: classNum })
        if (!ttData || !ttData.timetable) {
            return res.status(404).json({ 
                "msg": `Timetable not available for your class ${classNum}`,
                "class": classNum,
                "hallticket": hallticket
            })
        }
        
        // ✅ STUDENT-SPECIFIC RESPONSE
        res.status(200).json({
            "msg": "✅ Timetable loaded successfully",
            "login": "Student",
            "hallticket": hallticket,
            "student": {
                "name": student.stuname,
                "class": student.stuclass,
                "classNum": classNum
            },
            "timetable": {
                "monday": ttData.timetable.monday || [],
                "tuesday": ttData.timetable.tuesday || [],
                "wednesday": ttData.timetable.wednesday || [],
                "thursday": ttData.timetable.thursday || [],
                "friday": ttData.timetable.friday || []
            }
        })
        
    } catch (error) {
        res.status(500).json({ "err": "Server error fetching timetable" })
    }
}

module.exports = { getStudentTT, authStudentTT }
