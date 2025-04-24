import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Register from './pages/Register'
import ProfilePage from './pages/Profile'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'

function App() {

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
    {/* <Register/> */}
    <Routes>
    <Route path='/' element={<Home/>}/>
     <Route path='/register' element={<Register/>}/>
     <Route path='/login' element={<Login/>}/>
     <Route path='/profile' element={<ProfilePage/>}/>
     
    </Routes>
    </>
  )
}

export default App
