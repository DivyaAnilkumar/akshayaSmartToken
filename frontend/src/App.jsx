import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import { Route, Router, Routes  } from 'react-router-dom'
import HomePage from './components/HomePage'
import CenterDetails from './components/CenterDetails'
import TokenGenerator from './components/TokenGenerator'

function App() {
  const [count, setCount] = useState(0)

  return (
    
      
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        {/* <Route path="/list" element={<HomePage/>}/> */}
        <Route path="/center/:centerId" element={<CenterDetails />} />
        <Route path="/generate-token" element={<TokenGenerator/>}/>
        <Route path="/contact" element={<div>Contact Page</div>} />
      </Routes>
    
  )
}

export default App
