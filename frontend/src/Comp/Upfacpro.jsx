
import axios from "axios"
import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Ct from "./Ct.jsx"

const Upfacpro = () => {
    let [data, setData] = useState({facultyid: "", facname: "", facsub: "", facphoneno: "",facsal: "", facaddress: "", faccity: "", facstate: "",facqualification: "", facattend: "", facgen: ""})
    let [msg, setMsg] = useState("")
    let obj = useContext(Ct)
    let navigate = useNavigate()
    const API_BASE = "https://school-portal-backend-2zcu.onrender.com"
    // ✅ Single input handler
    let fun = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    // ✅ Upload profile (matches backend)
    let uploadProfile = async () => {
        try {
            if (!data.facultyid || !data.facname) {
                return setMsg("❌ Faculty ID & Name required!")
            }

            let res = await axios.post(`${API_BASE}/upfacpro/${data.facultyid}`, data) // Full profile data
            
            if (res.data.msg?.includes("successfully") || res.data.msg?.includes("SUCCESSFULLY")) {
                setMsg("✅ Profile created! Redirecting...")
                setTimeout(() => {
                    navigate("/facpro")
                }, 1500)
            } else {
                setMsg(res.data.err || "Upload failed")
            }
        } catch (err) {
            setMsg(err.response?.data?.err || "Error uploading profile")
        }
    }

    // 🔥 VALIDATE FORM
    const isFormValid = () => {
        return data.facultyid && data.facname
    }

    // 🔥 RESET FORM
    const resetForm = () => {
        setData({facultyid: "", facname: "", facsub: "", facphoneno: "",facsal: "", facaddress: "", faccity: "", facstate: "",facqualification: "", facattend: "", facgen: ""})
        setMsg("")
    }

    // ===== RENDER COMPONENTS =====
    const StatusMessage = () => msg && (
        <div className={`status-msg ${msg.includes('✅') ? 'success' : 'error'}`}>
            {msg}
        </div>
    )

    const ActionButtons = () => (
        <div className="action-buttons">
            <button onClick={uploadProfile} disabled={!isFormValid()} className={`btn ${isFormValid() ? 'success' : 'disabled'}`}>📤 Upload Profile</button>
            <button onClick={resetForm} className="btn warning">🔄 Reset Form</button>
            <button onClick={() => navigate("/facpro")} className="btn info">👀 View Profile</button>
        </div>
    )
    const FacultyInfo = () => (
        <div className="faculty-info">
            <p>Logged in as: <strong>{obj.user?.facultyid}</strong></p>
        </div>
    )

    // ===== MAIN RENDER =====
    return (
        <div className="upfacpro-container">
            <div className="header">
                <h1>📝 Upload Faculty Profile</h1>
                <FacultyInfo />
            </div>
            <StatusMessage />
            <div className="form-container">
                {/* BASIC INFO */}
                <div className="form-group">
                    <h3>👤 Basic Information</h3>
                    <input type="text" name="facultyid" placeholder="Enter Faculty ID " value={data.facultyid} onChange={fun} className="input-field required"/>
                    <input type="text" name="facname" placeholder="Faculty Name" value={data.facname} onChange={fun} className="input-field required"/>
                </div>

                {/* SUBJECT & PERSONAL */}
                <div className="form-group">
                    <h3>📚 Subject & Personal</h3>
                    <input type="text" name="facsub" placeholder="Faculty Subject" value={data.facsub} onChange={fun} className="input-field"/>
                    <input type="text" name="facgen" placeholder="Gender (Male/Female)" value={data.facgen} onChange={fun} className="input-field"/>
                </div>

                {/* CONTACT INFO */}
                <div className="form-group">
                    <h3>📞 Contact Details</h3>
                    <input type="tel" name="facphoneno" placeholder="Enter phno" value={data.facphoneno} onChange={fun} className="input-field"/>
                    <input type="text" name="facaddress" placeholder="Address" value={data.facaddress} onChange={fun} className="input-field"/>
                    <input type="text" name="faccity" placeholder="City" value={data.faccity} onChange={fun} className="input-field"/>
                    <input type="text" name="facstate" placeholder="State" value={data.facstate} onChange={fun} className="input-field"/>
                </div>

                {/* PROFESSIONAL INFO */}
                <div className="form-group">
                    <h3>💼 Professional Details</h3>
                    <input type="text" name="facqualification" placeholder="Qualification" value={data.facqualification} onChange={fun} className="input-field"/>
                    <input type="number" name="facsal" placeholder="Enter monthly salary" value={data.facsal} onChange={fun} min="0" className="input-field"/>
                    <input type="number" name="facattend" placeholder="Attendance %" value={data.facattend} onChange={fun}min="0" max="100" className="input-field"/>
                </div>
                <ActionButtons />
            </div>
        </div>
    )
}
export default Upfacpro
