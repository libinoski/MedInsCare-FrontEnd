import './App.css';
import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HospitalRegistration from './components/Hospital/HospitalRegistration';
import HospitalLogin from './components/Hospital/HospitalLogin';
import HospitalChangePassword from './components/Hospital/HospitalChangePassword';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HospitalRegistration />} /> 
          <Route path='/hospitalLogin' element={<HospitalLogin />} />
          <Route path='/hospitalChangePassword' element={<HospitalChangePassword />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


