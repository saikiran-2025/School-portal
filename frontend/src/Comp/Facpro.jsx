import axios from "axios"
import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Ct from "./Ct.jsx"
import Carousal from "./Carousal.jsx"

const Facpro = () => {
    // ===== STATE HOOKS =====
    const [data, setData] = useState({facultyid: "", facname: "", facsub: "", facphoneno: 0,facsal: 0, facaddress: "", faccity: "", facstate: "",facqualification: "", facattend: 0, facgen: ""})
    const [msg, setMsg] = useState("")
    const [loading, setLoading] = useState(false)
    const [f, setF] = useState(false)
    
    const navigate = useNavigate()
    const obj = useContext(Ct)
    const facultyId = obj.user?.facultyid
    const API_BASE = "https://school-portal-backend-2zcu.onrender.com"
    // ===== INPUT HANDLER =====
    const handleInputChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    // ===== AUTO-LOAD Profile =====
    useEffect(() => {
        if (facultyId) {
            loadProfile()
        }
    }, [f, facultyId])

    const loadProfile = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${API_BASE}/facpro/${facultyId}`)
            if (res.data.profile) {
                setData(res.data.profile)
                setMsg(res.data.msg || "✅ Profile loaded successfully")
            } else {
                setMsg(res.data.msg || "Profile not found")
            }
        } catch (err) {
            setMsg(err.response?.data?.msg || err.response?.data?.err || "❌ Error loading profile")
        } finally {
            setLoading(false)
        }
    }

    const updateProfile = async () => {
        setLoading(true)
        try {
            const res = await axios.put(`${API_BASE}/facpro/${facultyId}`, { ...data })
            setF(!f)  // Refresh data
            setMsg(res.data.msg || "✅ Profile updated successfully")
        } catch (err) {
            setMsg(err.response?.data?.msg || err.response?.data?.err || "❌ Update failed")
        } finally {
            setLoading(false)
        }
    }

    const deleteProfile = async () => {
        if (window.confirm("⚠️ Delete your profile? This action cannot be undone!")) {
            setLoading(true)
            try {
                const res = await axios.delete(`${API_BASE}/facpro/${facultyId}`)
                setMsg(res.data.msg || "✅ Profile deleted")
                obj.setToken(null)
                obj.setUser(null)
                navigate("/")
            } catch (err) {
                setMsg(err.response?.data?.msg || "❌ Delete failed")
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <div className="facpro-container">
            <Carousal />
            {/* PAGE HEADER */}
            <div className="page-header">
                <h1>👨‍🏫 Faculty Profile</h1>
                <p>View your complete profile details</p>
                <div className="status-bar">
                    <span>Logged in as: <strong>{facultyId}</strong></span>
                </div>
            </div>

            {/* STATUS MESSAGE */}
            {msg && (
                <div className={`status-msg ${msg.includes('✅') ? 'success' : 'error'}`}>
                    {msg}
                </div>
            )}

            {/* PROFILE FORM */}
            <div className="profile-card">
                <div className="profile-grid">
                    {/* Faculty ID - Read Only */}
                    <div className="profile-field">
                        <label>Faculty ID:</label>
                        <input type="text" name="facultyid" value={data.facultyid || ""} readOnly className="readonly"/>
                    </div>

                    {/* Faculty Name */}
                    <div className="profile-field">
                        <label>Faculty Name:</label>
                        <input type="text" name="facname" value={data.facname || ""} onChange={handleInputChange} placeholder="Enter full name"/>
                    </div>

                    {/* Subject */}
                    <div className="profile-field">
                        <label>Subject:</label>
                        <input type="text" name="facsub" value={data.facsub || ""} onChange={handleInputChange} placeholder="Teaching subject"/>
                    </div>

                    {/* Phone Number */}
                    <div className="profile-field">
                        <label>Phone Number:</label>
                        <input type="tel" name="facphoneno" value={data.facphoneno || ""} onChange={handleInputChange} placeholder="10-digit phone"/>
                    </div>

                    {/* Salary */}
                    <div className="profile-field">
                        <label>Salary:</label>
                        <input type="number" name="facsal" value={data.facsal || ""} onChange={handleInputChange} placeholder="Monthly salary"/>
                    </div>

                    {/* Gender */}
                    <div className="profile-field">
                        <label>Gender:</label>
                        <input type="text" name="facgen" value={data.facgen || ""} onChange={handleInputChange}placeholder="Male/Female"/>
                    </div>

                    {/* Attendance */}
                    <div className="profile-field">
                        <label>Attendance (%):</label>
                        <input type="number" name="facattend" value={data.facattend || ""} onChange={handleInputChange}min="0" max="100" placeholder="0-100"/>
                    </div>

                    {/* City */}
                    <div className="profile-field">
                        <label>City:</label>
                        <input type="text" name="faccity" value={data.faccity || ""} onChange={handleInputChange}placeholder="City name"/>
                    </div>

                    {/* State */}
                    <div className="profile-field">
                        <label>State:</label>
                        <input type="text" name="facstate" value={data.facstate || ""} onChange={handleInputChange} placeholder="State name"/>
                    </div>

                    {/* Qualification */}
                    <div className="profile-field">
                        <label>Qualification:</label>
                        <input type="text" name="facqualification" value={data.facqualification || ""} onChange={handleInputChange} placeholder="Degree/Diploma"/>
                    </div>

                    {/* Address - Full Width */}
                    <div className="profile-field full-width">
                        <label>Address:</label>
                        <textarea name="facaddress" value={data.facaddress || ""} onChange={handleInputChange} placeholder="Full residential address" rows="3"/>
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="action-buttons">
                    <button onClick={loadProfile} className="btn secondary" disabled={loading}>🔄 Load Profile</button>
                    <button onClick={updateProfile} className="btn primary" disabled={loading || !facultyId}>💾 Update Profile</button>
                    <button onClick={deleteProfile} className="btn danger" disabled={loading}>🗑️ Delete Profile</button>
                </div>
            </div>
        </div>
    )
}
export default Facpro
