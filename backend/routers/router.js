let express = require("express")
let rt = express.Router()

// ✅ ALL CONTROLLERS
let { login } = require("../controllers/logincont")
let { sr } = require("../controllers/sturegcont")
let { fr } = require("../controllers/facregcont")
let { authStudent, getsp } = require("../controllers/stuprocont")
let { uploadfp } = require("../controllers/upfacpro")
let { getfp, updatefp, deletefp } = require("../controllers/facprocont")
let { getfpsp, uploadsp, updatesp, deletesp, authFaculty } = require("../controllers/facstupro")
let { getMarks, authDis } = require("../controllers/disstures")
let { getFacmarksView, authFacultyMarksView } = require("../controllers/disfacres")
let { createMarks, getFacmarks, updateMarks, deleteMarks, authFacultyMarks } = require("../controllers/curdrescont")
let { getStudentTT, authStudentTT } = require("../controllers/ttstucont")
let { bulkCreateOrUpdateTT,getAllTT,updatePeriod,deleteClassTT,authFacultyTT } = require("../controllers/ttfaccont")
let { logoutUser} = require("../controllers/logout")

// ✅ ALL ROUTES
rt.post("/login", login)
rt.post("/stureg", sr)
rt.post("/facreg", fr)
rt.get("/stupro/:hallticket", authStudent, getsp)
rt.post("/upfacpro/:facultyid",uploadfp)
rt.get("/facpro/:facultyid", getfp)
rt.put("/facpro/:facultyid", updatefp)
rt.delete("/facpro/:facultyid", deletefp)

// ✅ FACULTY STUDENT CRUD
rt.post("/facstupro/:hallticket/:facultyId", authFaculty, uploadsp)
rt.get("/facstupro/:hallticket/:facultyId", authFaculty, getfpsp)
rt.put("/facstupro/:hallticket/:facultyId", authFaculty, updatesp)
rt.delete("/facstupro/:hallticket/:facultyId", authFaculty, deletesp)

// ✅ MARKS DISPLAY - FIXED ROUTE
rt.get("/marks/:hallticket", authDis, getMarks)  // ✅ CORRECT ORDER & PATH
rt.get("/marks/:hallticket/:facultyid",getFacmarksView, authFacultyMarksView)

// ✅ MARKS Faculty CURD
rt.post("/marks/:hallticket/:facultyId/:classNum", authFacultyMarks, createMarks)
rt.get("/marks/:hallticket/:facultyId/:classNum", authFacultyMarks, getFacmarks)
rt.put("/marks/:hallticket/:facultyId/:classNum", authFacultyMarks, updateMarks)
rt.delete("/marks/:hallticket/:facultyId/:classNum", authFacultyMarks, deleteMarks)

// ✅ TimeTable display for Students
rt.get("/ttstu/:hallticket", getStudentTT, authStudentTT)

// ✅ Timetable Faculty CURD
rt.post("/ttfac/bulk/:facultyId", authFacultyTT, bulkCreateOrUpdateTT) // /api/ttfac/bulk/NHSFAC01(post tt)
rt.put("/ttfac/bulk/:facultyId", authFacultyTT, bulkCreateOrUpdateTT)  // /api/ttfac/bulk/NHSFAC01(update all class)
rt.put("/ttfac/:classNum/:day/:periodIndex/:facultyId", authFacultyTT, updatePeriod) // /api/ttfac/1/monday/0/NHSFAC01(update single class)
rt.get("/ttfac/all", authFacultyTT, getAllTT) // /api/ttfac/all (get all class)
rt.delete("/ttfac/:classNum/:facultyId", authFacultyTT, deleteClassTT) // /api/ttfac/1/NHSFAC01(delete class)

// ✅ Logout student or faculty
rt.post("/logout/:id",logoutUser)
module.exports = rt
