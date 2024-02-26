import './App.css';
import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HospitalRegistration from './components/Hospital/HospitalRegistration';
import HospitalLogin from './components/Hospital/HospitalLogin';
import HospitalChangePassword from './components/Hospital/HospitalChangePassword';
import HospitalViewProfile from './components/Hospital/HospitalViewProfile';
import HospitalUpdateProfile from './components/Hospital/HospitalUpdateProfile';
import Navbar from './components/Hospital/HospitalNavbar';
import HospitalUpdateImage from './components/Hospital/HospitalUpdateImage';
import HospitalRegisterStaff from './components/Hospital/HospitalRegisterStaff';
import HospitalViewAllStaffs from './components/Hospital/HospitalViewAllStaffs';
import HospitalViewOneStaff from './components/Hospital/HospitalViewOneStaff';
import HospitalSearchStaffs from './components/Hospital/HospitalSearchStaffs';
import HospitalAddNews from './components/Hospital/HospitalAddNews';
import HospitalViewAllNews from './components/Hospital/HospitalViewAllNews';
import Footer from './components/Common/Footer';


function App() {
  return (
    <div>

      <BrowserRouter>
        <Routes>
          <Route path='/navbar' elemet={<Navbar />} />
          <Route path='/footer' elemet={<Footer />} />
          <Route path='/' element={<HospitalRegistration />} />
          <Route path='/hospitalLogin' element={<HospitalLogin />} />
          <Route path='/hospitalChangePassword' element={<HospitalChangePassword />} />
          <Route path='/hospitalViewProfile' element={<HospitalViewProfile />} />
          <Route path='/hospitalUpdateProfile' element={<HospitalUpdateProfile />} />
          <Route path='/hospitalUpdateImage' element={<HospitalUpdateImage />} />
          <Route path='/hospitalRegisterStaff' element={<HospitalRegisterStaff />} />
          <Route path='/hospitalViewAllStaffs' element={<HospitalViewAllStaffs />} />
          <Route path='/hospitalViewOneStaff' element={<HospitalViewOneStaff />} />
          <Route path='/hospitalSearchStaffs' element={<HospitalSearchStaffs />} />
          <Route path='/hospitalAddNews' element={<HospitalAddNews />} />
          <Route path='/hospitalViewAllNews' element={<HospitalViewAllNews />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


