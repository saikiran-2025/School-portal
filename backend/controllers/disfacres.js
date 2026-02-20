let upmarks = require("../models/upmarks")
let studentprofile = require("../models/stupro")

// ✅ 1. FACULTY AUTHENTICATION (Validates facultyId)
let authFacultyMarksView = (req, res, next) => {
    let { facultyid } = req.params  // ✅ Matches router: :facultyid
    if (!facultyid || facultyid.length < 6) {
        return res.status(401).json({ "err": "Valid faculty login required" })
    }
    next()
}

// ✅ 2. GET SUBJECTS FOR CLASS (PRIMARY 7, SECONDARY 12)
const getSubjectsByClass = (classNum) => {
    if (classNum <= 5) {
        return ['Telugu', 'Hindi', 'English', 'Maths', 'Science', 'Social', 'Drawing']
    }
    return ['Telugu', 'Hindi', 'English', 'Maths', 'Social', 'Physics', 'Biology', 'Drawing', 'ScienceLab', 'MockTest']
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

// ✅ 4. FACULTY VIEW MARKS - GET /disfac/:hallticket/:facultyid (ALL CLASSES)
let getFacmarksView = async (req, res) => {
    try {
        let { hallticket, facultyid } = req.params  // ✅ Matches route params
        
        // VALIDATION 1: Faculty must be logged in (already checked by middleware)
        
        // VALIDATION 2: Student must exist
        let student = await studentprofile.findOne({ hallticket })
        if (!student) {
            return res.status(404).json({ 
                "err": "Student not found",
                "hallticket": hallticket,
                "facultyid": facultyid
            })
        }
        
        // VALIDATION 3: Check marks exist
        let marksData = await upmarks.findOne({ hallticket })
        if (!marksData || !marksData.marks.length) {
            return res.status(404).json({ 
                "msg": "No marks uploaded yet for this student",
                "hallticket": hallticket,
                "facultyid": facultyid,
                "student": { 
                    "name": student.stuname, 
                    "class": student.stuclass 
                }
            })
        }
        
        // ALL CLASSES VIEW (Faculty sees ALL student classes)
        let processedClasses = marksData.marks.map(cls => {
            let result = calculateClassResult(cls, cls.class)
            return {
                class: cls.class,
                rawMarks: cls,  // Original marks data
                ...result       // ✅ Uses NEW result logic (Any <37 = FAIL)
            }
        })
        
        res.status(200).json({
            "msg": `✅ All marks viewed by Faculty ${facultyid}`,
            "login": "Faculty",
            "hallticket": hallticket,
            "facultyid": facultyid,
            "student": { 
                "name": student.stuname, 
                "class": student.stuclass 
            },
            "classes": processedClasses
        })
        
    } catch (error) {
        res.status(500).json({ "err": "Server error fetching marks" })
    }
}

module.exports = { getFacmarksView, authFacultyMarksView }
