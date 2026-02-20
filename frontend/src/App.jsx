import React, { createContext, useState } from 'react'
import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom"
import Login from './Comp/Login.jsx'
import Nav from './Comp/Nav.jsx'
import Regstu from './Comp/Regstu.jsx'
import Regfac from './Comp/Regfac.jsx'
import Stupro from './Comp/Stupro.jsx'
import Stumarks from './Comp/Stumarks.jsx'
import Ttstu from './Comp/Ttstu.jsx'
import Facpro from './Comp/Facpro.jsx'
import Upfacpro  from './Comp/Upfacpro.jsx'
import Upstupro from './Comp/Upstupro.jsx'
import Facmarks from './Comp/Facmarks.jsx'
import Upmarks from './Comp/Upmarks.jsx'
import Ttfac from './Comp/Ttfac.jsx'
import Logout from './Comp/Logout.jsx'
import Ct from './Comp/Ct.jsx'
import Footer from './Comp/Footer.jsx'
import "./App.css"
const App = () => {
  let [token,setToken]=useState("")
  let [user,setUser]=useState(null)

  let obj={ token,setToken,user,setUser }
  const isLoggedIn = obj.user !== null
  return (
    <BrowserRouter>
    <Ct.Provider value={obj}>
    <Nav/>
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="regfac" element={<Regfac />}/>
      <Route path="regstu" element={<Regstu />}/>

      <Route path="/stupro" element={token ? <Stupro /> : <Navigate to="/" />} />
      <Route path="/stures" element={token ? <Stumarks /> : <Navigate to="/"/>} />
      <Route path="/ttstu" element={token ? <Ttstu /> : <Navigate to="/"/>} />

      <Route path="/facpro" element={token ? <Facpro /> : <Navigate to="/" />} />
      <Route path="/upfacpro" element={token ? <Upfacpro /> : <Navigate to="/" />} />
      <Route path="/facres" element={token ? <Facmarks /> : <Navigate to="/" />} />
      <Route path="/upmarks" element={token ? <Upmarks /> : <Navigate to="/" />} />
      <Route path="/ttfac" element={token ? <Ttfac /> : <Navigate to="/" />} />
      <Route path="/upstupro" element={token ? <Upstupro /> : <Navigate to="/" />} />
      
      <Route path="logout" element={token ? <Logout /> : <Navigate to="/" />} />

    </Routes>
    {isLoggedIn && <Footer />}
    </Ct.Provider>
    </BrowserRouter>
  )
}

export default App
