let timetable = require("../models/timetable")

// ✅ FACULTY AUTH - TEMP BYPASS
let authFacultyTT = (req, res, next) => {
    next()
}

// ✅ 1. CREATE/UPDATE ALL CLASSES TIMETABLE (POST/PUT)
let bulkCreateOrUpdateTT = async (req, res) => {
    try {
        let { facultyId } = req.params
        
        let timetables = req.body.timetables  // Array of {class: 1, timetable: {...}}
        if (!Array.isArray(timetables) || timetables.length === 0) {
            return res.status(400).json({ "err": "timetables array required" })
        }
        
        let results = []
        let errors = []
        
        for (let ttData of timetables) {
            let classNumber = parseInt(ttData.class)
            
            // Validate class & structure
            if (!classNumber || classNumber < 1 || classNumber > 10) {
                errors.push(`Class ${ttData.class}: Invalid class number`)
                continue
            }
            
            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
            for (let day of days) {
                if (!Array.isArray(ttData.timetable[day])) {
                    errors.push(`Class ${classNumber} ${day}: Must be array`)
                    break
                }
                for (let period of ttData.timetable[day]) {
                    if (!period.subject || !period.time || 
                        typeof period.subject !== 'string' || typeof period.time !== 'string') {
                        errors.push(`Class ${classNumber} ${day}: Invalid period`)
                        break
                    }
                }
            }
            
            if (errors.length > 0) continue
            
            // Create/Update
            let ttDoc = await timetable.findOneAndUpdate(
                { class: classNumber },
                {
                    class: classNumber,
                    timetable: ttData.timetable,
                    updatedBy: facultyId
                },
                { upsert: true, new: true }
            )
            
            results.push({
                class: classNumber,
                status: "✅ UPDATED/CREATED"
            })
        }
        
        res.status(201).json({
            "msg": "✅ Bulk timetable operation COMPLETE!",
            "facultyId": facultyId,
            "success": results.length,
            "errors": errors.length,
            "results": results,
            "errorsDetail": errors
        })
        
    } catch (error) {
        res.status(500).json({ "err": "Bulk operation failed" })
    }
}

// ✅ 2. GET ALL CLASSES TIMETABLE (GET)
let getAllTT = async (req, res) => {
    try {
        let allTT = await timetable.find({}).sort({ class: 1 })
        
        let formattedTT = allTT.map(tt => ({
            class: tt.class,
            timetable: {
                monday: tt.timetable.monday || [],
                tuesday: tt.timetable.tuesday || [],
                wednesday: tt.timetable.wednesday || [],
                thursday: tt.timetable.thursday || [],
                friday: tt.timetable.friday || []
            }
        }))
        
        res.status(200).json({
            "msg": "✅ All timetables found!",
            "totalClasses": formattedTT.length,
            "timetables": formattedTT
        })
        
    } catch (error) {
        res.status(500).json({ "err": "Fetch all failed" })
    }
}


// ✅ 4. UPDATE SINGLE PERIOD (PUT /:classNum/:day/:periodIndex)
let updatePeriod = async (req, res) => {
    try {
        let { classNum, day, periodIndex, facultyId } = req.params
        let classNumber = parseInt(classNum)
        let index = parseInt(periodIndex)
        
        if (!classNumber || classNumber < 1 || classNumber > 10 || 
            index < 0 || !['monday','tuesday','wednesday','thursday','friday'].includes(day)) {
            return res.status(400).json({ "err": "Invalid class/day/periodIndex" })
        }
        
        let { subject, time } = req.body
        if (!subject || !time) {
            return res.status(400).json({ "err": "subject and time required" })
        }
        
        let ttData = await timetable.findOne({ class: classNumber })
        if (!ttData || !ttData.timetable[day] || !ttData.timetable[day][index]) {
            return res.status(404).json({ "err": "Period not found" })
        }
        
        // Update specific period
        ttData.timetable[day][index] = { subject, time }
        ttData.updatedBy = facultyId
        
        await ttData.save()
        
        res.status(200).json({
            "msg": `✅ ${day.toUpperCase()} period ${index + 1} UPDATED!`,
            "class": classNumber,
            "updated": `${day}[${index}] = {${subject}, ${time}}`
        })
        
    } catch (error) {
        res.status(500).json({ "err": "Period update failed" })
    }
}

// ✅ 6. DELETE ENTIRE CLASS TIMETABLE (DELETE /:classNum)
let deleteClassTT = async (req, res) => {
    try {
        let { classNum, facultyId } = req.params
        let classNumber = parseInt(classNum)
        
        if (!classNumber || classNumber < 1 || classNumber > 10) {
            return res.status(400).json({ "err": "Class must be 1-10" })
        }
        
        let deleted = await timetable.findOneAndDelete({ class: classNumber })
        if (!deleted) {
            return res.status(404).json({ "msg": `No timetable for class ${classNumber}` })
        }
        
        res.status(200).json({
            "msg": `✅ ENTIRE CLASS ${classNumber} TIMETABLE DELETED!`,
            "class": classNumber,
            "facultyId": facultyId
        })
    } catch (error) {
        res.status(500).json({ "err": "Class delete failed" })
    }
}

module.exports = { bulkCreateOrUpdateTT,getAllTT,updatePeriod,deleteClassTT,authFacultyTT }
