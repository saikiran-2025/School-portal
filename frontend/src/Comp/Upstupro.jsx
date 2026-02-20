import axios from "axios"
import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Ct from "./Ct.jsx"

const Upstupro = () => {
    // ===== STATE HOOKS - EXACT BACKEND SCHEMA =====
    const [data, setData] = useState({hallticket: "",stuname: "",stuclass: "",stufather: "",stuphone: "",stuaddress: "",stucity: "",stustate: "",stuattend: "",stuage: "",stugen: "",stufees: ""})
    const [msg, setMsg] = useState("")
    const obj = useContext(Ct)
    const navigate = useNavigate()
    const facultyId = obj.user?.facultyid

    // 🔥 CLASS VALIDATION - 1 to 10 ONLY
    const isValidClass = (classValue) => {
        const num = parseInt(classValue)
        return num >= 1 && num <= 10 && !isNaN(num)
    }

    // ===== CORE LOGIC FUNCTIONS =====
    const handleInputChange = (e) => {
        const { name, value } = e.target
        
        // 🔥 REAL-TIME CLASS VALIDATION (1-10 only)
        if (name === "stuclass") {
            if (isValidClass(value) || value === "") {
                setData({ ...data, [name]: value })
            }
            return
        }
        
        setData({ ...data, [name]: value })
    }

    // 🔥 UPLOAD - Enhanced validation
    const uploadProfile = async () => {
        // 🔥 STRICT CLASS VALIDATION (1-10)
        if (!isValidClass(data.stuclass)) {
            return setMsg("❌ Class must be between 1-10 only!")
        }
        
        if (!data.hallticket || !data.stuname || !data.stuclass) {
            return setMsg("❌ Hallticket, Name & Class required!")
        }

        try {
            const res = await axios.post(
                `http://localhost:5000/facstupro/${data.hallticket}/${facultyId}`,
                data
            )

            if (res.data.msg?.includes("SUCCESSFULLY")) {
                setMsg("✅ Student profile created! Redirecting...")
                setTimeout(() => navigate("/stupro"), 1500)
            } else {
                setMsg(res.data.err || "Upload failed")
            }
        } catch (err) {
            setMsg(err.response?.data?.err || "❌ Network error")
        }
    }

    // 🔥 ENHANCED FORM VALIDATION
    const isFormValid = () => {
        return data.hallticket && data.stuname && data.stuclass && isValidClass(data.stuclass)
    }

    // 🔥 RESET FORM
    const resetForm = () => {
        setData({hallticket: "",stuname: "",stuclass: "",stufather: "",stuphone: "",stuaddress: "",stucity: "",stustate: "",stuattend: "",stuage: "",stugen: "",stufees: ""})
        setMsg("")
    }

    // ===== COMPONENTS =====
    const StatusMessage = () => msg && (
        <div className={`status-msg ${msg.includes('✅') ? 'success' : 'error'}`}>
            {msg}
        </div>
    )

    const ActionButtons = () => (
        <div className="action-buttons">
            <button onClick={uploadProfile} disabled={!isFormValid()} className={`btn ${isFormValid() ? 'success' : 'disabled'}`}>
                📤 Upload Student Profile
            </button>
            <button onClick={resetForm} className="btn warning">
                🔄 Reset Form
            </button>
            <button onClick={() => navigate("/stupro")} className="btn info">
                👀 View Students
            </button>
        </div>
    )

    const FacultyInfo = () => (
        <div className="faculty-info">
            <p>Logged in Faculty: <strong>{facultyId}</strong></p>
        </div>
    )

    // ===== MAIN RENDER =====
    return (
        <div className="upstupro-container">
            <div className="header">
                <h1>📝 Upload Student Profile</h1>
                <FacultyInfo />
            </div>
            <StatusMessage />
            <div className="form-container">
                {/* BASIC INFO - CLASS 1-10 VALIDATED */}
                <div className="form-group">
                    <h3>👤 Basic Information</h3>
                    <input name="hallticket" placeholder="Enter Hallticket" value={data.hallticket} onChange={handleInputChange}className="input-field required"/>
                    <input name="stuname" placeholder="Student Name" value={data.stuname} onChange={handleInputChange}className="input-field required"/>
                    <div className="class-input-wrapper">
                        <input name="stuclass" type="number"min="1" max="10"placeholder="Enter Class(1-10)" value={data.stuclass} onChange={handleInputChange} className={`input-field required ${!isValidClass(data.stuclass) && data.stuclass ? 'error' : ''}`}/>
                        <small className="class-hint">Class 1-10 only</small>
                    </div>
                </div>

                {/* FAMILY INFO */}
                <div className="form-group">
                    <h3>👨‍👩‍👦 Family Details</h3>
                    <input name="stufather" placeholder="Father Name" value={data.stufather} onChange={handleInputChange}className="input-field"/>
                    <input name="stuphone" type="tel"placeholder="Enter phno" value={data.stuphone} onChange={handleInputChange}className="input-field"/>
                </div>

                {/* ADDRESS INFO */}
                <div className="form-group">
                    <h3>📍 Address Details</h3>
                    <input name="stuaddress" placeholder="Full Address" value={data.stuaddress} onChange={handleInputChange}className="input-field"/>
                    <input name="stucity" placeholder="Enter City" value={data.stucity} onChange={handleInputChange}className="input-field"/>
                    <input name="stustate" placeholder="Enter State" value={data.stustate} onChange={handleInputChange}className="input-field"/>
                </div>

                {/* ACADEMIC & PERSONAL INFO */}
                <div className="form-group">
                    <h3>📚 Academic & Personal</h3>
                    <input name="stuattend" type="number" placeholder="Attendance % (95)" min="0" max="100" value={data.stuattend} onChange={handleInputChange} className="input-field"/>
                    <input name="stuage" type="number" placeholder="Enter Age" min="5" max="25"value={data.stuage} onChange={handleInputChange} className="input-field"/>
                    <input name="stugen" placeholder="Gender (Male/Female)" value={data.stugen} onChange={handleInputChange}className="input-field"/>
                </div>

                {/* FEES INFO */}
                <div className="form-group">
                    <h3>💰 Fees Details</h3>
                    <input name="stufees" type="number" placeholder="Enter fees" min="10000" value={data.stufees} onChange={handleInputChange} className="input-field full-width"/>
                </div>
                <ActionButtons />
            </div>
        </div>
    )
}
export default Upstupro
