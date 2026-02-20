import axios from "axios"
import { useState, useContext, useEffect } from "react"
import Ct from "./Ct.jsx"

const Ttfac = () => {
    // ===== STATE HOOKS =====
    const [allTimetables, setAllTimetables] = useState([])
    const [msg, setMsg] = useState("")
    const [editMode, setEditMode] = useState({})
    const [currentTT, setCurrentTT] = useState(null)
    
    const obj = useContext(Ct)
    const facultyId = obj.user?.facultyid

    // ===== CORE FUNCTIONS =====
    const getAllTimetables = async () => {
        try {
            const res = await axios.get("http://localhost:5000/ttfac/all")
            setAllTimetables(res.data.timetables || [])
            setMsg(res.data.msg || "✅ All timetables loaded!")
        } catch (err) {
            setMsg(err.response?.data?.err || "❌ Failed to load timetables")
        }
    }

    const updatePeriod = async (classNum, day, periodIndex, subject, time) => {
        try {
            const res = await axios.put(`http://localhost:5000/ttfac/${classNum}/${day}/${periodIndex}/${facultyId}`,{ subject, time })
            setMsg(res.data.msg)
            getAllTimetables() // Refresh after update
        } catch (err) {
            setMsg(err.response?.data?.err || "❌ Update failed")
        }
    }

    const toggleEdit = (classNum) => {
        if (editMode[classNum]) {
            setEditMode({ ...editMode, [classNum]: false })
            setCurrentTT(null)
        } else {
            // Load current timetable for editing
            const tt = allTimetables.find(t => t.class === classNum)
            setCurrentTT(tt)
            setEditMode({ ...editMode, [classNum]: true })
        }
    }

    // ===== LOAD ON MOUNT =====
    useEffect(() => {
        getAllTimetables()
    }, [])

    // ===== TIMETABLE DISPLAY COMPONENTS =====
    const TimetableTable = ({ timetable, classNum }) => {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        
        const handlePeriodChange = (day, index, field, value) => {
            const newTT = { ...currentTT }
            if (!newTT.timetable) newTT.timetable = {}
            if (!newTT.timetable[day]) newTT.timetable[day] = []
            newTT.timetable[day][index] = { ...newTT.timetable[day][index], [field]: value }
            setCurrentTT(newTT)
        }

        const saveChanges = () => {
            days.forEach(day => {
                if (currentTT?.timetable?.[day]) {
                    currentTT.timetable[day].forEach((period, index) => {
                        if (period.subject && period.time) {
                            updatePeriod(classNum, day, index, period.subject, period.time)
                        }
                    })
                }
            })
        }

        return (
            <div className="timetable-container">
                <div className="timetable-header">
                    <h3>📚 Class {classNum} Timetable</h3>
                    <div className="timetable-actions">
                        <button onClick={() => toggleEdit(classNum)} className={`btn ${editMode[classNum] ? 'warning' : 'info'}`}>{editMode[classNum] ? '✅ Save & Exit' : '✏️ Edit'}</button>
                    </div>
                </div>

                <div className="table-container">
                    <table className="timetable-table">
                        <thead>
                            <tr>
                                <th>Period</th>
                                {days.map(day => (
                                    <th key={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 8 }, (_, periodIndex) => (
                                <tr key={periodIndex}>
                                    <td className="period-cell">
                                        P{periodIndex + 1}
                                    </td>
                                    {days.map(day => {
                                        const period = timetable.timetable[day]?.[periodIndex]
                                        const isEditing = editMode[classNum]
                                        
                                        return (
                                            <td key={day} className="day-cell">
                                                {isEditing ? (
                                                    <div className="edit-period">
                                                        <input value={currentTT?.timetable?.[day]?.[periodIndex]?.subject || ""} onChange={(e) => handlePeriodChange(day, periodIndex, 'subject', e.target.value)} placeholder="Subject" className="period-input subject-input"/>
                                                        <input value={currentTT?.timetable?.[day]?.[periodIndex]?.time || ""} onChange={(e) => handlePeriodChange(day, periodIndex, 'time', e.target.value)} placeholder="Time" className="period-input time-input"/>
                                                    </div>
                                                ) : (
                                                    <div className="period-display">
                                                        <div className="subject-display">
                                                            {period?.subject || 'FREE'}
                                                        </div>
                                                        <div className="time-display">
                                                            {period?.time || '-'}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {editMode[classNum] && (
                    <div className="edit-footer">
                        <button onClick={saveChanges} className="btn success">💾 Save All Changes for Class {classNum}</button>
                        <button onClick={() => toggleEdit(classNum)} className="btn warning">❌ Cancel Edit</button>
                    </div>
                )}
            </div>
        )
    }
    const NoTimetable = () => (
        <div className="no-timetable">
            <h3>📭 No Timetables Found</h3>
            <p>No class timetables available. Create using bulk upload first.</p>
        </div>
    )

    // ===== RENDER COMPONENTS =====
    const StatusMessage = () => msg && (
        <div className={`status-msg ${msg.includes('✅') ? 'success' : msg.includes('❌') ? 'error' : 'info'}`}>
            {msg}
        </div>
    )

    const ActionButtons = () => (
        <div className="action-buttons">
            <button onClick={getAllTimetables} className="btn info">🔄 Refresh All Timetables</button>
        </div>
    )

    // ===== MAIN RENDER =====
    return (
        <div className="ttfac-container">
            <div className="header">
                <h1>📅 Faculty Timetable Viewer & Editor</h1>
                <p>Faculty: <strong>{facultyId}</strong> | Classes: <strong>{allTimetables.length}</strong></p>
                <ActionButtons />
            </div>
            <StatusMessage />
            <div className="timetables-grid">
                {allTimetables.length === 0 ? (
                    <NoTimetable />
                ) : (
                    allTimetables.map(timetable => (
                        <TimetableTable key={timetable.class} timetable={timetable} classNum={timetable.class}/>
                    ))
                )}
            </div>
        </div>
    )
}

export default Ttfac
