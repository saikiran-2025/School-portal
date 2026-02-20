import React, { useState } from 'react'
import axios from 'axios'
const Regstu = () => {
  let [data,setData]=useState({"hallticket":"","pwd":""})
  let [msg,setMsg]=useState("")
  const API_BASE = "https://school-portal-backend-2zcu.onrender.com"
  
  let fun=(e)=>{
    let {name,value}=e.target
    setData({...data,[name]:value})
  }

  let reg=async()=>{
    try {
      let res=await axios.post(`${API_BASE}/stureg`,data)

      if (res.data.msg === "Student account created successfully") {
        setMsg(res.data.msg)
      }
      else if (res.data.msg) {
        setMsg(res.data.msg)  // Success/Error messages
      }
      else if (res.data.err) {
        setMsg(res.data.err)  // Validation errors
      }
    }
    catch (err) {
      // ✅ FIXED 3: Better error handling
      console.log("Full Error:", err.response?.data)
      setMsg(err.response?.data?.msg || err.response?.data?.err || "Registration failed")
    }
  }
  return (
    <div className="auth-wrapper">
      <div className='regstu'>
        <h2>{msg}</h2>
        <p>Register Student</p>
        <input name="hallticket" type="text" placeholder='Enter hallticket' onChange={fun} value={data.hallticket}/>
        <input name="pwd" type='password' placeholder='Enter password' onChange={fun} value={data.pwd}/>
        <button onClick={reg}>Register</button>
      </div>
    </div>
  )
}

export default Regstu
