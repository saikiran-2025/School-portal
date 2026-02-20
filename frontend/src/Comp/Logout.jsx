import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"    
import Cookies from "js-cookie"
import axios from "axios"
import Ct from "./Ct.jsx"

const Logout = () => {
    let navigate = useNavigate()
    let obj = useContext(Ct)
    const API_BASE = "https://school-portal-backend-2zcu.onrender.com"
    useEffect(() => {
        const quickLogout = async () => {
            try {
                // 🔥 STEP 1: Get user ID from context
                const userId = obj.user?.hallticket || obj.user?.facultyid || ""
                
                // 🔥 STEP 2: Call backend logout API
                if (userId) {
                    axios.post(`${API_BASE}/logout/${userId}`)
                        .catch(err => console.log("Logout API optional"))
                }
                
                // 🔥 STEP 3: Clear ALL storage
                Cookies.remove("logininfo")
                localStorage.clear()
                sessionStorage.clear()
                
                // 🔥 STEP 4: Clear context (token = 0 → protected routes redirect)
                obj.setToken("")  // ✅ CRITICAL: Clear token
                obj.setUser(null)
                
            } catch (error) {
                console.log("Logout cleanup")
            } finally {
                // 🔥 STEP 5: Navigate to ROOT "/" (where Login lives)
                navigate("/")  // ✅ FIXED: "/" not "/login"
            }
        }
        
        quickLogout()
    }, [navigate, obj])

    return (
        <div style={{
            minHeight: "100vh", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            background: "#f0f2f5"
        }}>
            <div>🔐 Logging out...</div>
        </div>
    )
}

export default Logout
