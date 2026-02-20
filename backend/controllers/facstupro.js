let studentprofile = require("../models/stupro")

// ✅ TEMP: BYPASS AUTH - TEST BODY FIRST
let authFaculty = (req, res, next) => {
    next()  // Skip auth temporarily
}

// ✅ CREATE
let uploadsp = async (req, res) => {
    try {
        let { hallticket, facultyId } = req.params
        
        let existing = await studentprofile.findOne({ hallticket })
        if (existing) {
            return res.status(400).json({ "err": "Student already exists" })
        }
        
        let sp = new studentprofile({
            hallticket,
            ...req.body,
            createdBy: facultyId
        })
        
        await sp.save()
        res.status(201).json({
            "msg": "✅ Student CREATED SUCCESSFULLY!",
            "hallticket": hallticket,
            "facultyId": facultyId,
            "profile": sp
        })
    } catch (error) {
        res.status(500).json({ "err": "Create failed: " + error.message })
    }
}

// ✅ READ
let getfpsp = async (req, res) => {
    try {
        let { hallticket } = req.params
        let profile = await studentprofile.findOne({ hallticket })
        
        profile ? res.status(200).json({
            "msg": "✅ Student FOUND!",
            "profile": profile
        }) : res.status(404).json({ "msg": "Student not found" })
    } catch (error) {
        res.status(500).json({ "err": "Fetch failed" })
    }
}

// ✅ UPDATE
let updatesp = async (req, res) => {
    try {
        let { hallticket, facultyId } = req.params
        
        let updated = await studentprofile.findOneAndUpdate(
            { hallticket },
            { ...req.body, updatedBy: facultyId },
            { new: true }
        )
        
        updated ? res.status(200).json({
            "msg": "✅ Student UPDATED!",
            "profile": updated
        }) : res.status(404).json({ "msg": "Not found" })
    } catch (error) {
        res.status(500).json({ "err": "Update failed" })
    }
}

// ✅ DELETE
let deletesp = async (req, res) => {
    try {
        let { hallticket } = req.params
        
        let deleted = await studentprofile.findOneAndDelete({ hallticket })
        deleted ? res.status(200).json({ "msg": "✅ Student DELETED!" }) : 
                 res.status(404).json({ "msg": "Not found" })
    } catch (error) {
        res.status(500).json({ "err": "Delete failed" })
    }
}

module.exports = { getfpsp, uploadsp, updatesp, deletesp, authFaculty }
