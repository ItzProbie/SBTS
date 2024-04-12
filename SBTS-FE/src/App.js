import { BrowserRouter as Router , Routes , Route } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Profile from "./pages/Profile"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </Router>
  )
}
