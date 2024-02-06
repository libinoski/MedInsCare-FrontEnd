import './App.css';
import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HospitalRegistration from './components/Hospital/HospitalRegistration';
import HospitalLogin from './components/Hospital/HospitalLogin';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HospitalRegistration />} /> 
          <Route path='/hospitalLogin' element={<HospitalLogin />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


