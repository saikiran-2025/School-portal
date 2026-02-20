let upmarks = require("../models/upmarks")
let studentprofile = require("../models/stupro")

// ✅ 1. FACULTY AUTHENTICATION
let authFacultyMarks = (req, res, next) => {
    let { facultyId } = req.params || req.body
    if (!facultyId || facultyId.length < 6) {
        return res.status(401).json({ "err": "Valid faculty login required" })
    }
    next()
}

// ✅ 2. GET SUBJECTS FOR CLASS (PRIMARY 7, SECONDARY 12)
const getSubjectsByClass = (classNum) => {
    if (classNum <= 5) {
        return ['Telugu', 'Hindi', 'English', 'Maths', 'Science', 'Social', 'Drawing']
    }
    return ['Telugu', 'Hindi', 'English', 'Maths', 'Social', 'Physics', 
             'Biology', 'Drawing', 'ScienceLab', 'MockTest']
}

// ✅ 3. CALCULATE CLASS RESULT (NEW RULE: ANY SUBJECT <37 = FAIL)
const calculateClassResult = (classData, classNum) => {
    const subjects = getSubjectsByClass(classNum)
    let total = 0
    let hasSubjectFail = false
    let subjectStatus = {}
    
    // Step 1: Calculate total & check each subject
    subjects.forEach(subject => {
        let marks = classData[subject] || 0
        total += marks
        subjectStatus[subject] = marks >= 37 ? "PASS" : "FAIL"
        if (marks < 37) hasSubjectFail = true  // 🚨 CRITICAL: Any fail = overall fail
    })
    
    // Step 2: Calculate percentage
    let maxMarks = subjects.length * 100
    let percentage = ((total / maxMarks) * 100).toFixed(2)
    
    // Step 3: NEW RESULT LOGIC
    // PASS = (No subject fails) AND (percentage >= 35%)
    let overallResult = (!hasSubjectFail && parseFloat(percentage) >= 35) ? "PASS" : "FAIL"
    
    return {
        subjects: subjectStatus,
        total,
        maxMarks,
        percentage: percentage + "%",
        overallResult,
        failSubjects: hasSubjectFail ? subjects.filter(sub => (classData[sub] || 0) < 37) : []
    }
}

// ✅ 4. CREATE MARKS - POST /marks/:hallticket/:facultyId/:classNum
let createMarks = async (req, res) => {
    try {
        let { hallticket, facultyId, classNum } = req.params
        
        // VALIDATION 1: Faculty required
        if (!facultyId) return res.status(401).json({ "err": "Faculty ID required" })
        
        // VALIDATION 2: Student exists
        let student = await studentprofile.findOne({ hallticket })
        if (!student) return res.status(404).json({ "err": "Student not found" })
        
        // VALIDATION 3: Get/create marks document
        let marksData = await upmarks.findOne({ hallticket })
        if (!marksData) marksData = new upmarks({ hallticket, marks: [] })
        
        // VALIDATION 4: Parse marks data
        let newClassMarks = req.body.marks ? req.body.marks[0] : req.body
        newClassMarks.class = parseInt(classNum || newClassMarks.class)
        let targetClass = newClassMarks.class
        
        // VALIDATION 5: Prevent duplicate class
        if (marksData.marks.find(m => m.class == targetClass)) {
            return res.status(400).json({ "err": `Class ${targetClass} marks already exist` })
        }
        
        // VALIDATION 6: Validate subjects for class
        let validSubjects = getSubjectsByClass(targetClass)
        for (let subject of validSubjects) {
            if (newClassMarks[subject] === undefined || newClassMarks[subject] < 0 || newClassMarks[subject] > 100) {
                return res.status(400).json({ "err": `${subject} required (0-100)` })
            }
        }
        
        // SAVE MARKS
        marksData.marks.push(newClassMarks)
        marksData.createdBy = facultyId
        await marksData.save()
        
        res.status(201).json({
            "msg": `✅ Class ${targetClass} marks CREATED`,
            "hallticket": hallticket,
            "class": targetClass,
            "facultyId": facultyId,
            "marks": newClassMarks
        })
        
    } catch (error) {
        res.status(500).json({ "err": "Create failed" })
    }
}

// ✅ 5. VIEW MARKS - GET /marks/:hallticket/:facultyId/:classNum?
let getFacmarks = async (req, res) => {
    try {
        let { hallticket, facultyId, classNum } = req.params
        
        // VALIDATION 1: Faculty login
        if (!facultyId) return res.status(401).json({ "err": "Faculty login required" })
        
        // VALIDATION 2: Check marks exist
        let marksData = await upmarks.findOne({ hallticket })
        if (!marksData || !marksData.marks.length) {
            return res.status(404).json({ "msg": "No marks found" })
        }
        
        let student = await studentprofile.findOne({ hallticket })
        let targetClass = classNum ? parseInt(classNum) : null
        
        if (targetClass) {
            // SINGLE CLASS VIEW
            let classData = marksData.marks.find(cls => cls.class == targetClass)
            if (!classData) return res.status(404).json({ "msg": `Class ${targetClass} not found` })
            
            let result = calculateClassResult(classData, targetClass)
            
            res.status(200).json({
                "msg": `✅ Class ${targetClass} marks viewed`,
                "hallticket": hallticket,
                "class": targetClass,
                "student": student ? { "name": student.stuname, "class": student.stuclass } : null,
                "marks": {
                    ...classData,
                    ...result  // ✅ Uses NEW result logic
                }
            })
        } else {
            // ALL CLASSES VIEW
            let processedClasses = marksData.marks.map(cls => {
                let result = calculateClassResult(cls, cls.class)
                return {
                    class: cls.class,
                    ...cls,
                    ...result  // ✅ Uses NEW result logic
                }
            })
            
            res.status(200).json({
                "msg": "✅ All classes marks viewed",
                "hallticket": hallticket,
                "student": student ? { "name": student.stuname, "class": student.stuclass } : null,
                "classes": processedClasses
            })
        }
    } catch (error) {
        res.status(500).json({ "err": "Fetch failed" })
    }
}

// ✅ 6. UPDATE MARKS - PUT /marks/:hallticket/:facultyId/:classNum
let updateMarks = async (req, res) => {
    try {
        let { hallticket, facultyId, classNum } = req.params
        
        if (!facultyId) return res.status(401).json({ "err": "Faculty required" })
        
        let marksData = await upmarks.findOne({ hallticket })
        if (!marksData) return res.status(404).json({ "err": "Marks not found" })
        
        let classIndex = marksData.marks.findIndex(m => m.class == classNum)
        if (classIndex === -1) return res.status(404).json({ "err": `Class ${classNum} not found` })
        
        let newMarksData = req.body.marks[0]
        newMarksData.class = parseInt(classNum)
        let validSubjects = getSubjectsByClass(parseInt(classNum))
        
        // Validate subjects
        for (let subject of validSubjects) {
            if (newMarksData[subject] === undefined || newMarksData[subject] < 0 || newMarksData[subject] > 100) {
                return res.status(400).json({ "err": `${subject} required (0-100)` })
            }
        }
        
        marksData.marks[classIndex] = newMarksData
        marksData.updatedBy = facultyId
        await marksData.save()
        
        res.status(200).json({
            "msg": `✅ Class ${classNum} marks UPDATED`,
            "hallticket": hallticket,
            "class": classNum,
            "marks": newMarksData
        })
    } catch (error) {
        res.status(500).json({ "err": "Update failed" })
    }
}

// ✅ 7. DELETE MARKS - DELETE /marks/:hallticket/:facultyId/:classNum
let deleteMarks = async (req, res) => {
    try {
        let { hallticket, facultyId, classNum } = req.params
        
        if (!facultyId) return res.status(401).json({ "err": "Faculty required" })
        
        let marksData = await upmarks.findOne({ hallticket })
        if (!marksData) return res.status(404).json({ "msg": "Marks not found" })
        
        let classIndex = marksData.marks.findIndex(m => m.class == classNum)
        if (classIndex === -1) return res.status(404).json({ "msg": `Class ${classNum} not found` })
        
        marksData.marks.splice(classIndex, 1)
        marksData.updatedBy = facultyId
        
        if (marksData.marks.length === 0) {
            await upmarks.findOneAndDelete({ hallticket })
        } else {
            await marksData.save()
        }
        
        res.status(200).json({
            "msg": `✅ Class ${classNum} DELETED`,
            "hallticket": hallticket
        })
    } catch (error) {
        res.status(500).json({ "err": "Delete failed" })
    }
}

module.exports = { createMarks, getFacmarks, updateMarks, deleteMarks, authFacultyMarks }
