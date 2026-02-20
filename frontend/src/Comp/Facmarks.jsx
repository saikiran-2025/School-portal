import axios from "axios"
import { useState, useEffect, useContext } from "react"
import { useSearchParams } from "react-router-dom"
import Ct from "./Ct.jsx"  // Context for logged-in faculty

const Facmarks = () => {
    // ===== STATE HOOKS =====
    const [searchParams, setSearchParams] = useSearchParams()
    const [marksData, setMarksData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [hallticketInput, setHallticketInput] = useState("")
    
    const obj = useContext(Ct)  // Logged-in faculty context
    const facultyid = obj.user?.facultyid  // ✅ AUTO from context

    // Extract hallticket from URL OR input
    const hallticket = searchParams.get("hallticket") || hallticketInput

    // ===== CORE FUNCTIONS =====
    const fetchMarks = async (ht = hallticket) => {
        if (!ht || !facultyid) {
            setError("❌ Hallticket required! (Faculty auto-detected)")
            return
        }

        setLoading(true)
        setError("")
        try {
            console.log("🔍 Fetching:", `http://localhost:5000/marks/${ht}/${facultyid}`)
            const res = await axios.get(`http://localhost:5000/marks/${ht}/${facultyid}`)
            console.log("✅ Response:", res.data)
            setMarksData(res.data)
        } catch (err) {
            console.error("❌ Error:", err.response?.data)
            setError(err.response?.data?.err || err.response?.data?.msg || "❌ Failed to fetch marks")
            setMarksData(null)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        fetchMarks(hallticketInput)
    }

    // ===== LOAD ON MOUNT (URL PARAMS) =====
    useEffect(() => {
        if (searchParams.get("hallticket") && facultyid) {
            fetchMarks(searchParams.get("hallticket"))
        }
    }, [facultyid])  // Depend on facultyid

    // ===== TABLE COMPONENTS =====
    const MarksTable = ({ classes }) => (
        <div className="marks-table-container">
            {classes.map(cls => (
                <div key={cls.class} className="class-marks-card">
                    <div className="class-header">
                        <h3>📚 Class {cls.class}</h3>
                        <div className={`result-badge ${cls.overallResult.toLowerCase()}`}>
                            {cls.overallResult}
                        </div>
                    </div>
                    
                    <div className="table-responsive">
                        <table className="marks-table">
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Marks</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(cls.rawMarks || {})
                                    .filter(([key]) => !['class', '_id'].includes(key))
                                    .map(([subject, marks]) => {
                                        const status = cls.subjects?.[subject] || "N/A"
                                        return (
                                            <tr key={subject}>
                                                <td className="subject-cell">
                                                    <span className="subject-name">{subject}</span>
                                                </td>
                                                <td className="marks-cell">
                                                    <strong>{marks || 0}/100</strong>
                                                </td>
                                                <td className="status-cell">
                                                    <span className={`status-badge ${status.toLowerCase()}`}>
                                                        {status}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                            </tbody>
                            <tfoot>
                                <tr className="summary-row">
                                    <td><strong>Total</strong></td>
                                    <td><strong>{cls.total || 0}/{cls.maxMarks || 0}</strong></td>
                                    <td><strong>{cls.percentage || '0%'}</strong></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {cls.failSubjects?.length > 0 && (
                        <div className="fail-warning">
                            ⚠️ Failed Subjects: {cls.failSubjects.join(", ")}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )

    const NoMarks = () => (
        <div className="no-marks">
            <div className="empty-state">
                <h3>📭 No Marks Found</h3>
                <p>No marks data available for this hallticket. Check hallticket number or upload marks first.</p>
            </div>
        </div>
    )

    // ===== RENDER COMPONENTS =====
    const LoadingSpinner = () => (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>🔍 Fetching marks for {hallticket} by Faculty <strong>{facultyid}</strong>...</p>
        </div>
    )

    const StudentHeader = () => (
        <div className="student-header">
            <div className="student-info">
                <h1>📊 Student Marks Report</h1>
                {marksData && (
                    <div className="info-grid">
                        <div className="info-card">
                            <label>Hallticket:</label>
                            <strong>{marksData.hallticket}</strong>
                        </div>
                        <div className="info-card">
                            <label>Student:</label>
                            <strong>{marksData.student?.name || 'N/A'}</strong>
                        </div>
                        <div className="info-card">
                            <label>Class:</label>
                            <strong>{marksData.student?.class || 'N/A'}</strong>
                        </div>
                        <div className="info-card">
                            <label>Faculty:</label>
                            <strong>{marksData.facultyid}</strong>
                        </div>
                        <div className="info-card">
                            <label>Total Classes:</label>
                            <strong>{marksData.classes?.length || 0}</strong>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

    // ===== MAIN RENDER =====
    return (
        <div className="facmarks-container">
            <div className="page-header">
                <h1>🎓 Faculty Marks Viewer</h1>
                <p>Logged in as: <strong>{facultyid}</strong> | View ALL classes marks by Hallticket</p>
            </div>

            {/* 🔍 SEARCH FORM - FACULTY ID AUTO */}
            <div className="search-section">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="input-group">
                        <input type="text" placeholder="Enter Hallticket" value={hallticketInput} onChange={(e) => setHallticketInput(e.target.value)} className="search-input hallticket-input"/>
                        <div className="auto-filled">
                            <label>Faculty ID:</label>
                            <strong>{facultyid || 'Loading...'}</strong>
                            <span className="auto-badge">AUTO</span>
                        </div>
                        <button type="submit" className="search-btn" disabled={!facultyid}>🔍 Search Marks</button>
                    </div>
                </form>
            </div>

            {error && (
                <div className="error-banner">
                    <strong>❌ {error}</strong>
                    <button onClick={() => fetchMarks(hallticket)} className="btn-retry" disabled={!facultyid}>🔄 Retry</button>
            </div>
            )}

            {loading && <LoadingSpinner />}

            {marksData && !loading && (
                <>
                    <StudentHeader />
                    {marksData.classes?.length > 0 ? (
                        <MarksTable classes={marksData.classes} />
                    ) : (
                        <NoMarks />
                    )}
                </>
            )}
        </div>
    )
}
export default Facmarks
