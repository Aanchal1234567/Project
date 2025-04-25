
import { useState,useEffect} from 'react' 
import "./App.css" 
import Navbar from './Navbar.jsx' 
import Homepage from './Homepage.jsx' 
import Createtask from './Createtask.jsx' 
import Task from './Task.jsx' 
import { Route, Routes,Navigate } from 'react-router-dom'
import Searched from './searched.jsx'
import Calendar from './Calendar.jsx'
import SignUp from "./SignUp.jsx"
import { useContext } from "react"
import LandingPage from './LandingPage.jsx'
import Notecontext from "./Notecontext.jsx"
import SmartTrackingSystem from './Trackingtask.jsx'

  
  function App() { 
    const {searchingitem, setSearchingitem,isSignIn, setIsSignIn,LogedIn, setLogedIn,LogedInUser, setLogedInUser} = useContext(Notecontext);
  let contextData = useContext(Notecontext)  
    
    return (     
            <div>
              <Navbar/>
              <Routes>       
              <Route path="/" element={LogedInUser ? <Homepage/> :<LandingPage/>}/>  

              <Route path="/Createtask" element={LogedInUser ? <Createtask /> : <Navigate to="/SignUp" />} /> 

              <Route path="/Task" element={LogedInUser? <Task/> : <Navigate to="/SignUp" />} /> 

                <Route path="/Searched" element={<Searched/>}/>       
                <Route path="/Calendar" element={<Calendar/>}/>       
                <Route path="/SignUp" element={<SignUp/>}/>
                
                <Route path="/SmartTrackingSystem" element={<SmartTrackingSystem/>}/>          
                </Routes>            
                </div>   
                ) }  
                export default App