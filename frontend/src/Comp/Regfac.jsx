import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Regfac = () => {
    let [data, setData] = useState({ "facultyid": "", "pwd": "" })
    let [msg, setMsg] = useState("")
    let navigate = useNavigate()
    const API_BASE = "https://school-portal-backend-2zcu.onrender.com"
    
    let fun = (e) => {
        let { name, value } = e.target
        setData({ ...data, [name]: value })
    }

    let reg = async () => {
        try {
            // ✅ FIXED 1: HTTP (not HTTPS) + Correct URL
            let res = await axios.post(`${API_BASE}/facreg`, data)

            // ✅ FIXED 2: Handle BOTH msg AND err responses
            if (res.data.msg === "Faculty account created successfully") {
                navigate("/login")
            } else if (res.data.msg) {
                setMsg(res.data.msg)  // Success/Error messages
            } else if (res.data.err) {
                setMsg(res.data.err)  // Validation errors
            }
        } catch (err) {
            // ✅ FIXED 3: Better error handling
            console.log("Full Error:", err.response?.data)
            setMsg(err.response?.data?.msg || err.response?.data?.err || "Registration failed")
        }
    }

    return (
        <div className="auth-wrapper">
            <div className='regfac'>
                <h2>{msg}</h2>
                <p>Register Faculty</p>
                <input name="facultyid" type='text' placeholder='Enter Facultyid' onChange={fun} value={data.facultyid}/>
                <input type='password' placeholder='Enter Password' name="pwd" onChange={fun} value={data.pwd}/>
                <button onClick={reg}>Register</button>
                <a href='/'>← Back to Login</a>
            </div>
        </div>
    )
}

export default Regfac
