import axios from "axios"
import { useState, useEffect, useContext } from "react"
import Ct from "./Ct.jsx"

const Ttstu = () => {
    // ===== STATE HOOKS =====
    const [allTimetables, setAllTimetables] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    
    const obj = useContext(Ct)
    const hallticket = obj.user?.hallticket  // Student must be logged in

    // ===== CORE FUNCTIONS =====
    const fetchAllTimetables = async () => {
        if (!hallticket) {
            setError("❌ Please login to view timetables!")
            return
        }

        setLoading(true)
        setError("")
        try {
            console.log("🔍 Fetching ALL timetables (student view)")
            // ✅ Use faculty endpoint for ALL classes (student authenticated)
            const res = await axios.get("http://localhost:5000/ttfac/all")
            console.log("✅ All timetables loaded:", res.data)
            setAllTimetables(res.data.timetables || [])
        } catch (err) {
            console.error("❌ Error:", err.response?.data)
            setError(err.response?.data?.err || "❌ Failed to fetch timetables")
        } finally {
            setLoading(false)
        }
    }

    // ===== AUTO LOAD ON MOUNT =====
    useEffect(() => {
        if (hallticket) {
            fetchAllTimetables()
        }
    }, [hallticket])

    // ===== TIMETABLE DISPLAY (SIMPLIFIED FROM TTFAC - VIEW ONLY) =====
    const TimetableTable = ({ timetable, classNum }) => {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        
        return (
            <div className="timetable-container">
                <div className="timetable-header">
                    <h3>📚 Class {classNum} Timetable</h3>
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
                                    <td className="period-cell">P{periodIndex + 1}</td>
                                    {days.map(day => {
                                        const period = timetable.timetable[day]?.[periodIndex]
                                        return (
                                            <td key={day} className="day-cell">
                                                <div className="period-display">
                                                    <div className="subject-display">
                                                        {period?.subject || 'FREE'}
                                                    </div>
                                                    <div className="time-display">
                                                        {period?.time || '-'}
                                                    </div>
                                                </div>
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    // ===== EMPTY STATES =====
    const LoadingSpinner = () => (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>🔍 Loading all timetables, {hallticket}...</p>
        </div>
    )
    const NoTimetable = () => (
        <div className="no-timetable">
            <div className="empty-state">
                <h3>📭 No Timetables Found</h3>
                <p>No class timetables available yet. Contact admin.</p>
            </div>
        </div>
    )

    // ===== MAIN RENDER =====
    return (
        <div className="ttstu-container">
            <div className="page-header">
                <h1>📅 All Classes Timetables</h1>
                <p>Logged in as Student: <strong>{hallticket}</strong> | Total: <strong>{allTimetables.length}</strong> classes</p>
                <div className="action-buttons">
                    <button onClick={fetchAllTimetables} className="btn primary">🔄 Refresh All Timetables</button>
                </div>
            </div>

            {/* Status Display */}
            {!hallticket && (
                <div className="error-banner">
                    <strong>❌ Please login to view timetables!</strong>
                    <button onClick={() => window.location.href = "/"} className="btn-retry">Go to Login</button>
                </div>
            )}

            {error && hallticket && (
                <div className="error-banner">
                    <strong>❌ {error}</strong>
                    <button onClick={fetchAllTimetables} className="btn-retry">🔄 Reload</button>
                </div>
            )}

            {loading && <LoadingSpinner />}

            {allTimetables.length > 0 && !loading && (
                <div className="timetables-grid">
                    {allTimetables.map(timetable => (
                        <TimetableTable key={timetable.class} timetable={timetable} classNum={timetable.class}/>
                    ))}
                </div>
            )}
            {allTimetables.length === 0 && !loading && hallticket && (
                <NoTimetable />
            )}
        </div>
    )
}
export default Ttstu
