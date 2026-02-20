import React, { useContext, useState } from 'react'
import Ct from './Ct.jsx'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { Link } from "react-router-dom"
const Login = () => {
  let [data,setData]=useState({credential:"",pwd:""})
  let [msg,setMsg]=useState("")

  let obj=useContext(Ct)
  let navigate=useNavigate()

  let fun=(e)=>{
    let { name,value }=e.target
    setData({...data,[name]:value})
  }

  let login=async()=>{
    try{
      let res=await axios.post("http://localhost:5000/login",data)

      if(res.data.token!=undefined){
        obj.setToken(res.data.token)
        obj.setUser({
          credential: res.data.credential,
          hallticket: res.data.hallticket,
          facultyid: res.data.facultyid,
          role: res.data.role
        })

        setTimeout(()=>{
          if(res.data.role === "student"){
            navigate("/stupro")
          }
          else {
            navigate("/facpro")
          }
        }, 1000)
      }
      else {
        setMsg(res.data.msg || "Login failed")
      }
    }
    catch(err){
      setMsg("Error in Login")
    }
  }
  return (
    <div className="auth-wrapper">
      <div className='login'>
        <h2>{msg}</h2>
        <p>Login</p>
        <input name="credential" type='text' value={data.credential} onChange={fun} placeholder='Enter Hall-ticket/FacultyId'/>
        <input name="pwd" type='password' value={data.pwd} onChange={fun} placeholder='Enter password'/>
        <button onClick={login}>Login</button>

        <div className='reglink'>
          Don't have an account? <Link to="/regfac">Register Faculty</Link>
        </div>
      </div>
    </div>
  )
}

export default Login