import axios from "axios"
import { useState, useEffect, useContext } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import Ct from "./Ct.jsx"
import Carousal from "./Carousal.jsx"

const Stupro = () => {
    let [data, setData] = useState({hallticket: "", stuname: "", stuclass: 0, stufather: "",stuphone: 0, stuaddress: "", stucity: "", stustate: "",stuattend: 0, stuage: 0, stugen: "", stufees: 0})
    let [msg, setMsg] = useState("")
    let [f, setF] = useState(false)
    let navigate = useNavigate()
    let [searchParams] = useSearchParams()
    let obj = useContext(Ct)
    const API_BASE = "https://school-portal-backend-2zcu.onrender.com"
    
    const hallticket = obj.user?.hallticket || searchParams.get("hallticket") || ""
    
    let fun = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        if (hallticket) {
            getpro()
        }
    }, [f, hallticket])

    let getpro = () => {
        if (!hallticket) {
            setMsg("❌ Hallticket required!")
            return
        }
        
        axios.get(`${API_BASE}/stupro/${hallticket}`)
            .then((res) => {
                if (res.data.profile) {
                    setData(res.data.profile)
                    setMsg(res.data.msg)
                } else {
                    setMsg(res.data.msg || "Profile not found")
                }
            })
            .catch((err) => {
                setMsg(err.response?.data?.msg || err.response?.data?.err || "Error loading profile")
            })
    }

    let loadProfile = () => {
        setF(!f)
    }

    return (
        <div className="stupro-container">
          <Carousal/>
            <div className="page-header">
                <h1>👨‍🎓 Student Profile</h1>
                <p>View your complete profile details</p>
                <div className="status-info">
                    <strong>Hallticket:</strong> {hallticket || "Not logged in"}
                    {obj.user && <span className="logged-in">✅ Logged in</span>}
                </div>
            </div>

            {msg && (
                <div className={`status-msg ${msg.includes('✅') ? 'success' : 'error'}`}>
                    {msg}
                </div>
            )}

            <div className="profile-card">
                <div className="profile-grid">
                    <div className="profile-field">
                        <label>Hallticket:</label>
                        <input type="text" name="hallticket" value={data.hallticket || ""} readOnly className="readonly" />
                    </div>
                    <div className="profile-field">
                        <label>Student Name:</label>
                        <input type="text" name="stuname" value={data.stuname || ""} readOnly className="readonly" />
                    </div>
                    <div className="profile-field">
                        <label>Class:</label>
                        <input type="text" name="stuclass" value={data.stuclass || ""} readOnly className="readonly" />
                    </div>
                    <div className="profile-field">
                        <label>Father Name:</label>
                        <input type="text" name="stufather" value={data.stufather || ""} readOnly className="readonly" />
                    </div>
                    <div className="profile-field">
                        <label>Phone:</label>
                        <input type="tel" name="stuphone" value={data.stuphone || ""} readOnly className="readonly" />
                    </div>
                    <div className="profile-field">
                        <label>Age:</label>
                        <input type="number" name="stuage" value={data.stuage || ""} readOnly className="readonly" />
                    </div>
                    <div className="profile-field">
                        <label>Gender:</label>
                        <input type="text" name="stugen" value={data.stugen || ""} readOnly className="readonly" />
                    </div>
                    <div className="profile-field">
                        <label>Attendance:</label>
                        <input type="number" name="stuattend" value={data.stuattend || ""} readOnly className="readonly" />
                    </div>
                    <div className="profile-field full-width">
                        <label>Address:</label>
                        <input type="text" name="stuaddress" value={data.stuaddress || ""} readOnly className="readonly full" />
                    </div>
                    <div className="profile-field">
                        <label>City:</label>
                        <input type="text" name="stucity" value={data.stucity || ""} readOnly className="readonly" />
                    </div>
                    <div className="profile-field">
                        <label>State:</label>
                        <input type="text" name="stustate" value={data.stustate || ""} readOnly className="readonly" />
                    </div>
                    <div className="profile-field">
                        <label>Fees:</label>
                        <input type="number" name="stufees" value={data.stufees || ""} readOnly className="readonly" />
                    </div>
                </div>

                <div className="action-buttons">
                    <button onClick={loadProfile} className="btn primary">
                        🔄 Reload Profile
                    </button>
                    <button onClick={() => navigate("/")} className="btn secondary">
                        ← Back to Dashboard
                    </button>
                </div>
            </div>

            {/* ✅ DEBUG SECTION COMPLETELY REMOVED */}
        </div>
    )
}

export default Stupro
