import axios from "axios"
import { useState, useEffect, useContext } from "react"
import { useSearchParams } from "react-router-dom"
import Ct from "./Ct.jsx"

const Stumarks = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [marksData, setMarksData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    
    const obj = useContext(Ct)
    const hallticket = obj.user?.hallticket
    const API_BASE = "https://school-portal-backend-2zcu.onrender.com"
    const fetchMarks = async (ht = hallticket) => {
        if (!ht) {
            setError("❌ Please login to view your marks!")
            return
        }

        setLoading(true)
        setError("")
        try {
            console.log("🔍 Fetching student marks:", `${API_BASE}/marks/${ht}`)
            const res = await axios.get(`${API_BASE}/marks/${ht}`)
            console.log("✅ Student marks loaded:", res.data)
            setMarksData(res.data)
        } catch (err) {
            console.error("❌ Error:", err.response?.data)
            setError(err.response?.data?.err || err.response?.data?.msg || "❌ Failed to fetch your marks")
            setMarksData(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (hallticket) {
            fetchMarks(hallticket)
        }
    }, [hallticket])

    // ✅ SIMPLIFIED COMPONENTS (Vite OXIDE Safe)
    const ClassCard = ({ cls }) => {
        const classNum = parseInt(cls.class)
        const isHigherClass = classNum > 5
        const rawMarksFiltered = { ...cls.rawMarks }
        
        if (isHigherClass) {
            delete rawMarksFiltered.Science
            delete rawMarksFiltered.Chemistry
        }

        return (
            <div className="class-marks-card">
                <div className="class-header">
                    <h3>
                        📚 Class {cls.class}
                        {isHigherClass && <span className="higher-class"> (Higher)</span>}
                    </h3>
                    <div className={`result-badge ${cls.overallResult.toLowerCase()}`}>
                        {cls.overallResult}
                    </div>
                </div>
                
                <div className="table-responsive">
                    <MarksTable cls={cls} rawMarksFiltered={rawMarksFiltered} />
                </div>
                
                {cls.failSubjects?.length > 0 && (
                    <div className="fail-warning">
                        ⚠️ Failed Subjects: {cls.failSubjects.join(", ")}
                    </div>
                )}
            </div>
        )
    }

    const MarksTable = ({ cls, rawMarksFiltered }) => (
        <table className="marks-table">
            <thead>
                <tr>
                    <th>Subject</th>
                    <th>Marks</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(rawMarksFiltered || {})
                    .filter(([key]) => !['class', '_id'].includes(key))
                    .map(([subject, marks]) => {
                        const status = cls.subjects?.[subject] || "N/A"
                        return (
                            <tr key={subject}>
                                <td className="subject-cell">{subject}</td>
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
    )

    const NoMarks = () => (
        <div className="no-marks">
            <div className="empty-state">
                <h3>📭 No Marks Found</h3>
                <p>No marks uploaded yet for your hallticket. Contact your teachers.</p>
            </div>
        </div>
    )

    const LoadingSpinner = () => (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>🔍 Loading your marks, {hallticket}...</p>
        </div>
    )

    const StudentHeader = () => {
        if (!marksData) return null
        return (
            <div className="student-header">
                <div className="student-info">
                    <h1>📊 My Marks Report</h1>
                    <div className="info-grid">
                        <div className="info-card">
                            <label>Hallticket:</label>
                            <strong>{marksData.hallticket}</strong>
                        </div>
                        <div className="info-card">
                            <label>Name:</label>
                            <strong>{marksData.student?.name || 'N/A'}</strong>
                        </div>
                        <div className="info-card">
                            <label>Class:</label>
                            <strong>{marksData.student?.class || 'N/A'}</strong>
                        </div>
                        <div className="info-card">
                            <label>Total Classes:</label>
                            <strong>{marksData.classes?.length || 0}</strong>
                        </div>
                        <div className="info-card">
                            <label>Login Type:</label>
                            <strong>{marksData.login}</strong>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="stumarks-container">
            <div className="page-header">
                <h1>🎓 My Marks Dashboard</h1>
                <p>Logged in as Student: <strong>{hallticket}</strong></p>
            </div>

            {!hallticket && (
                <div className="error-banner">
                    <strong>❌ Please login to view your marks!</strong>
                    <button onClick={() => window.location.href = "/"} className="btn-retry">
                        Go to Login
                    </button>
                </div>
            )}

            {error && hallticket && (
                <div className="error-banner">
                    <strong>❌ {error}</strong>
                    <button onClick={() => fetchMarks(hallticket)} className="btn-retry">
                        🔄 Reload Marks
                    </button>
                </div>
            )}

            {loading && <LoadingSpinner />}
            
            {marksData && !loading && (
                <>
                    <StudentHeader />
                    {marksData.classes?.length > 0 ? (
                        <div className="marks-table-container">
                            {marksData.classes.map(cls => (
                                <ClassCard key={cls.class} cls={cls} />
                            ))}
                        </div>
                    ) : (
                        <NoMarks />
                    )}
                </>
            )}
        </div>
    )
}

export default Stumarks
