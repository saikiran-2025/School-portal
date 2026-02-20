import axios from "axios"
import { useState, useContext } from "react"
import Ct from "./Ct.jsx"

const Upmarks = () => {

    const [hallticket, setHallticket] = useState("")
    const [classNum, setClassNum] = useState("")
    const [marksData, setMarksData] = useState(null)
    const [msg, setMsg] = useState("")
    const [subjects, setSubjects] = useState([])
    const [isEditMode, setIsEditMode] = useState(false)
    const [inputMarks, setInputMarks] = useState({})

    const obj = useContext(Ct)
    const facultyId = obj.user?.facultyid
    const API_BASE = "https://school-portal-backend-2zcu.onrender.com"
    // ================= SUBJECT LIST =================
    const getSubjectsByClass = (cls) => {
        if (parseInt(cls) <= 5) {
            return ['Telugu', 'Hindi', 'English', 'Maths', 'Science', 'Social', 'Drawing']
        }
        return [
            'Telugu', 'Hindi', 'English', 'Maths', 'Social',
            'Physics', 'Biology', 'Drawing', 'ScienceLab', 'MockTest'
        ]
    }

    // ================= GET MARKS =================
    const getMarks = async () => {

        if (!hallticket.trim() || !classNum) {
            setMsg("❌ Enter hallticket and class")
            return
        }

        setMsg("🔄 Loading marks...")

        try {
            const response = await axios.get(`${API_BASE}/marks/${hallticket}/${facultyId}/${classNum}`)

            const subjectList = getSubjectsByClass(classNum)
            setSubjects(subjectList)

            let backendMarks = response.data.marks

            if (backendMarks?._doc) {
                backendMarks = backendMarks._doc
            }

            backendMarks = {...backendMarks,total: response.data.marks.total,percentage: response.data.marks.percentage,overallResult: response.data.marks.overallResult,failSubjects: response.data.marks.failSubjects || []}

            subjectList.forEach(sub => {
                if (backendMarks[sub] === undefined) {
                    backendMarks[sub] = 0
                }
            })

            setMarksData(backendMarks)
            setIsEditMode(false)
            setMsg(`✅ Class ${classNum} marks loaded successfully`)

        } catch (error) {
            setMarksData(null)
            setMsg(error.response?.data?.err || "❌ Failed to load marks")
        }
    }

    // ================= CALCULATE RESULT =================
    const calculateResult = (data) => {
        let total = 0
        let failSubjects = []

        subjects.forEach(sub => {
            const mark = data[sub] ?? 0
            total += mark
            if (mark < 37) failSubjects.push(sub)
        })

        const percentage = ((total / (subjects.length * 100)) * 100).toFixed(2)

        return {...data,total,percentage: percentage + "%",overallResult: failSubjects.length === 0 ? "PASS" : "FAIL",failSubjects}
    }

    // ================= UPLOAD =================
    const uploadMarks = async () => {

        const marksObj = { class: parseInt(classNum) }

        subjects.forEach(sub => {
            marksObj[sub] = inputMarks[sub] ?? 0
        })

        const finalObj = calculateResult(marksObj)

        try {
            await axios.post(`${API_BASE}/marks/${hallticket}/${facultyId}/${classNum}`,{ marks: [finalObj] })

            setMarksData(finalObj)
            setMsg("✅ Marks uploaded successfully")
            setIsEditMode(false)

        } catch (err) {
            setMsg(err.response?.data?.err || "❌ Upload failed")
        }
    }

    // ================= UPDATE =================
    const updateMarks = async () => {

        const finalObj = calculateResult(marksData)

        try {
            await axios.put(`${API_BASE}/marks/${hallticket}/${facultyId}/${classNum}`,{ marks: [finalObj] })

            setMarksData(finalObj)
            setIsEditMode(false)
            setMsg("✅ Marks updated successfully")

        } catch (err) {
            setMsg(err.response?.data?.err || "❌ Update failed")
        }
    }

    // ================= DELETE =================
    const deleteMarks = async () => {

        if (!window.confirm(`Delete Class ${classNum} marks?`)) return

        try {
            await axios.delete(`${API_BASE}/marks/${hallticket}/${facultyId}/${classNum}`)

            setMarksData(null)
            setInputMarks({})
            setMsg("✅ Marks deleted successfully")

        } catch (err) {
            setMsg(err.response?.data?.err || "❌ Delete failed")
        }
    }

    // ================= HANDLERS =================
    const handleInputChange = (sub, value) => {
        setInputMarks(prev => ({...prev,[sub]: parseInt(value) || 0}))
    }

    const handleEditChange = (sub, value) => {
        setMarksData(prev => ({...prev,[sub]: parseInt(value) || 0}))
    }

    const handleClassChange = (e) => {
        const cls = e.target.value
        setClassNum(cls)
        setSubjects(getSubjectsByClass(cls))
        setMarksData(null)
        setInputMarks({})
        setMsg("")
    }

    return (
        <div className="upmarks-container">

            {/* HEADER */}
            <div className="upmarks-header">
                <h2>📊 Faculty Marks Management</h2>
                <p><strong>Faculty:</strong> {facultyId}</p>
            </div>

            {/* MESSAGE */}
            {msg && (<div className={`upmarks-msg ${ msg.includes("✅") ? "success" : msg.includes("🔄") ? "loading" :"error"}`}> {msg} </div>)}

            {/* CONTROLS */}
            <div className="upmarks-controls">

                <input type="text" placeholder="Enter Hallticket" value={hallticket} onChange={e => setHallticket(e.target.value)}/>

                <select value={classNum} onChange={handleClassChange}>
                    <option value="">Select Class (1-10)</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <option key={num} value={num}>Class {num}</option>
                    ))}
                </select>

                <button className="upmarks-btn primary" onClick={getMarks}>📋 Get Marks</button>

                <button className="upmarks-btn success" onClick={uploadMarks}>💾 Upload Marks</button>
            </div>

            {/* INPUT GRID */}
            {classNum && !marksData && subjects.length > 0 && (
                <div className="subject-grid">
                    {subjects.map(sub => (
                        <div key={sub}>
                            <label>{sub}</label>
                            <input type="number" min="0" max="100" value={inputMarks[sub] ?? ""} onChange={e => handleInputChange(sub, e.target.value)}/>
                        </div>
                    ))}
                </div>
            )}

            {/* TABLE */}
            {marksData && (
                <>
                    <div style={{ marginBottom: "20px" }}>
                        <button className="upmarks-btn primary" onClick={() => setIsEditMode(!isEditMode)}>
                            {isEditMode ? "Cancel" : "Edit"}
                        </button>

                        {isEditMode && (
                            <button className="upmarks-btn success" onClick={updateMarks}>Save</button>
                        )}

                        <button className="upmarks-btn danger" onClick={deleteMarks}>Delete</button>
                    </div>

                    <table className="upmarks-table">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Marks</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {subjects.map(sub => {
                                const mark = marksData[sub] ?? 0
                                return (
                                    <tr key={sub}>
                                        <td>{sub}</td>
                                        <td>
                                            {isEditMode ? (
                                                <input type="number" min="0" max="100" value={mark} onChange={e => handleEditChange(sub, e.target.value)}/>
                                            ) : (
                                                mark
                                            )}
                                        </td>
                                        <td className={mark >= 37 ? "pass-text" : "fail-text"}> {mark >= 37 ? "PASS" : "FAIL"}</td>
                                    </tr>
                                )
                            })}
                        </tbody>

                        <tfoot>
                            <tr>
                                <td><strong>Total</strong></td>
                                <td>{marksData.total} / {subjects.length * 100}</td>
                                <td>
                                    {marksData.overallResult} ({marksData.percentage})
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </>
            )}

        </div>
    )
}

export default Upmarks
