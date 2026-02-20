import React, { useContext } from 'react'
import { Link } from "react-router-dom"
import Ct from './Ct.jsx'
import "./Nav.css"
const Nav = () => {
    let obj=useContext(Ct)
    let { token,user }=obj
  return (
    <nav className='school-nav'>
        <div className='school-info'>
            <div className='school-name'>🏫Netaji High School</div>
            <div className='school-address'>Swathi Theatre Road, Bhavanipuram | Vijayawada - 520012, Andhra Pradesh</div>
        </div>
        
        <div className='nav-links'>
            { user?.role ==="student" && token && (
                <>
                    <Link to="stupro">👤 Profile</Link>
                    <Link to="stures">📊 Marks</Link>
                    <Link to="ttstu">📅 TimeTable</Link>
                    <Link to="logout">🚪Logout</Link>
                </>
            )}

            { user?.role === "faculty" && token && (
                <>
                <Link to="facpro">👨‍💼 Profile</Link>
                <Link to="upfacpro">👨‍💼 Upload Faculty profile</Link>
                <Link to="facres">📈 View Marks</Link>
                <Link to="upmarks">📝 Upload Marks</Link>
                <Link to="regstu">👤 Register Student</Link>
                <Link to="upstupro">👤 Upload Student profile</Link>
                <Link to="ttfac">📅 TimeTable</Link>
                <Link to="logout">🚪Logout</Link>
                </>
            )}


            
        </div>
    </nav>
  )
}

export default Nav