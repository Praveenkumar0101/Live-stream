import React from 'react'
// import Stream from './Main';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './Registation';
import Login from './Login';
import Stream from './Main';
import Profile from './UserProfile';


function App(){

return (
  <>

    <Router>
     
      <Routes>
        <Route path="/" element={<Profile/>}/>
        <Route path="/Registration" element={<Register/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/Main" element={<Stream />} />
       
      </Routes>
    </Router>
  
  
  </>
)
}

export default App;