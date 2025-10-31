import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from "./components/pages/Login"
import Signup from "./components/pages/Signup"
import Dashboard from "./components/pages/DashBoard"
import AuthRoute from './routes/AuthRoute';
import PrivetRoute from './routes/PrivetRoute';
import { ToastContainer } from 'react-toastify';


const App = () => {
  return (
    <>
    <ToastContainer />

    <BrowserRouter>
    <Routes>
     <Route element={<AuthRoute />}>
         <Route path='/'  element={<Signup />}/>
         <Route path='/login'  element={<Login />}/>
     </Route>
  
     <Route element={<PrivetRoute  />}>
   <Route  path='dashboard'  element={<Dashboard />}/>
  </Route>

    </Routes>


    </BrowserRouter>
    
    </>
  )
}

export default App;
