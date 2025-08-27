import { BrowserRouter as Router,Route, Routes } from 'react-router-dom'
import './App.css'
import { Index } from './Index'
import { Register } from './Auth/Register'
import { LogIn } from './Auth/login'
import Home from "./Home/Home"
import Add from './Add/add'
import Profile from './Profile/Profile'
function App() {


  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/Register" element={<Register/>}/>
          <Route path='/Login' element={<LogIn/>}/>
          <Route path="/Home" element={<Home/>}/>
          <Route path="/Add" element={<Add/>}/>
          <Route path="/Profile" element={<Profile/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
