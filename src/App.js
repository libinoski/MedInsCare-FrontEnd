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
import HospitalRegisterStaff from './components/Hospital/HospitalRegisterStaff';
import HospitalViewAllStaffs from './components/Hospital/HospitalViewAllStaffs';
import HospitalViewOneStaff from './components/Hospital/HospitalViewOneStaff';
import HospitalSearchStaffs from './components/Hospital/HospitalSearchStaffs';
import HospitalAddNews from './components/Hospital/HospitalAddNews';
import HospitalViewAllNews from './components/Hospital/HospitalViewAllNews';
import Footer from './components/Common/Footer';
import HospitalViewAllSuspendedStaffs from './components/Hospital/HospitalViewAllSuspenedStaffs';
import HospitalViewOneSuspendedStaff from './components/Hospital/HospitalViewOneSuspendedStaff';
import HospitalUpdateStaff from './components/Hospital/HospitalUpdateStaff';
import HospitalViewOneNews from './components/Hospital/HospitalViewOneNews';
import HospitalUpdateNews from './components/Hospital/HospitalUpdateNews';
import HospitalSendNotificationToStaff from './components/Hospital/HospitalSendNotificationToStaff';
import HospitalStaffLogin from './components/Hospital Staff/HospitalStaffLogin';
import HospitalStaffNavbar from './components/Hospital Staff/HospitalStaffNavbar';
import HospitalStaffViewProfile from './components/Hospital Staff/HospitalStaffViewProfile';
import HospitalStaffUpdateProfile from './components/Hospital Staff/HospitalStaffUpdateProfile';
import HospitalStaffChangePassword from './components/Hospital Staff/HospitalStaffChangePassword';
import HospitalStaffViewAllNews from './components/Hospital Staff/HospitalStaffViewAllNews';
import HospitalStaffViewOneNews from './components/Hospital Staff/HospitalStaffViewOneNews';
import HospitalStaffViewAllNotifications from './components/Hospital Staff/HospitalStaffViewAllNotifications';
import HospitalStaffViewOneNotification from './components/Hospital Staff/HospitalStaffViewOneNotification';
import HospitalStaffRegisterPatient from './components/Hospital Staff/HospitalStaffRegisterPatient';
import HospitalViewAllPatients from './components/Hospital/HospitalViewAllPatients';
import HospitalViewOnePatient from './components/Hospital/HospitalViewOnePatient';
import HospitalSendNotificationToPatient from './components/Hospital/HospitalSendNotificationToPatient';
import HospitalStaffViewAllPatients from './components/Hospital Staff/HospitalStaffViewAllPatients';
import HospitalStaffViewOnePatient from './components/Hospital Staff/HospitalStaffViewOnePatient';
import HospitalStaffSendNotificationToPatient from './components/Hospital Staff/HospitalStaffSendNotificationtToPatient';
import HospitalStaffChangeIdProofImage from './components/Hospital Staff/HospitalStaffChangeIdProofImage';
import HospitalStaffChangeProfileImage from './components/Hospital Staff/HospitalStaffChangeProfileImage';
import HospitalChangeImage from './components/Hospital/HospitalChangeImage';
import InsuranceProviderRegistration from './components/InsuranceProviders/InsuranceProviderRegister';
import InsuranceProviderNavbar from './components/InsuranceProviders/InsuranceProviderNavbar';
import InsuranceProviderLogin from './components/InsuranceProviders/InsuranceProviderLogin';
import HospitalViewAllUnApprovedInsuranceProviders from './components/Hospital/HospitalViewAllUnApprovedInsuranceProviders';
import HospitalViewOneUnapprovedInsuranceProvider from './components/Hospital/HospitalViewOneUnApprovedInsuranceProvider';
import PatientLogin from './components/Patient/PatientLogin';
import InsuranceProviderViewProfile from './components/InsuranceProviders/InsuranceProviderViewProfile';
import InsuranceProviderChangePassword from './components/InsuranceProviders/InsuranceProviderChangePassword';
import InsuranceProviderChangeIdProofImage from './components/InsuranceProviders/InsuranceProviderChangeIdProofImage';
import InsuranceProviderChangeProfileImage from './components/InsuranceProviders/InsuranceProviderChangeProfileImage';
import InsuranceProviderUpdateProfile from './components/InsuranceProviders/InsuranceProviderUpdateProfile';


function App() {
  return (
    <div>

      <BrowserRouter>
        <Routes>
          <Route path='/navbar' elemet={<Navbar />} />
          <Route path='/hospitalStaffNavbar' elemet={<HospitalStaffNavbar />} />
          <Route path='/footer' elemet={<Footer />} />
          <Route path='/' element={<HospitalRegistration />} />
          <Route path='/hospitalLogin' element={<HospitalLogin />} />
          <Route path='/hospitalStaffLogin' element={<HospitalStaffLogin />} />
          <Route path='/hospitalChangePassword' element={<HospitalChangePassword />} />
          <Route path='/hospitalViewProfile' element={<HospitalViewProfile />} />
          <Route path='/hospitalstaffViewProfile' element={<HospitalStaffViewProfile />} />
          <Route path='/hospitalUpdateProfile' element={<HospitalUpdateProfile />} />
          <Route path='/hospitalStaffUpdateProfile' element={<HospitalStaffUpdateProfile />} />
          <Route path='/hospitalChangeImage' element={<HospitalChangeImage />} />
          <Route path='/hospitalRegisterStaff' element={<HospitalRegisterStaff />} />
          <Route path='/hospitalUpdateStaff' element={<HospitalUpdateStaff />} />
          <Route path='/hospitalViewAllStaffs' element={<HospitalViewAllStaffs />} />
          <Route path='/hospitalViewOneStaff' element={<HospitalViewOneStaff />} />
          <Route path='/hospitalSearchStaffs' element={<HospitalSearchStaffs />} />
          <Route path='/hospitalAddNews' element={<HospitalAddNews />} />
          <Route path='/hospitalViewOneNews' element={<HospitalViewOneNews />} />
          <Route path='/hospitalUpdateNews' element={<HospitalUpdateNews />} />
          <Route path='/hospitalViewAllNews' element={<HospitalViewAllNews />} />
          <Route path='/hospitalViewAllSuspendedStaffs' element={<HospitalViewAllSuspendedStaffs />} />
          <Route path='/hospitalViewOneSuspendedStaff' element={<HospitalViewOneSuspendedStaff />} />
          <Route path='/hospitalSendNotificationToStaff' element={<HospitalSendNotificationToStaff />} />

          <Route path='/hospitalStaffChangeIdProofImage' element={<HospitalStaffChangeIdProofImage />} />
          <Route path='/hospitalStaffChangeProfileImage' element={<HospitalStaffChangeProfileImage />} />
          <Route path='/hospitalStaffChangePassword' element={<HospitalStaffChangePassword />} />
          <Route path='/hospitalStaffViewAllNews' element={<HospitalStaffViewAllNews />} />
          <Route path='/hospitalStaffViewOneNews' element={<HospitalStaffViewOneNews />} />
          <Route path='/hospitalStaffViewAllNotifications' element={<HospitalStaffViewAllNotifications />} />
          <Route path='/hospitalStaffViewOneNotification' element={<HospitalStaffViewOneNotification />} />
          <Route path='/hospitalStaffRegisterPatient' element={<HospitalStaffRegisterPatient />} />
          <Route path='/hospitalViewAllPatients' element={<HospitalViewAllPatients />} />
          <Route path='/hospitalStaffViewAllPatients' element={<HospitalStaffViewAllPatients />} />
          <Route path='/hospitalViewOnePatient' element={<HospitalViewOnePatient />} />
          <Route path='/hospitalSendNotificationToPatient' element={<HospitalSendNotificationToPatient />} />
          <Route path='/hospitalStaffViewOnePatient' element={<HospitalStaffViewOnePatient />} />
          <Route path='/hospitalStaffSendNotificationToPatient' element={<HospitalStaffSendNotificationToPatient />} />
          <Route path='/insuranceProviderRegistration' element={<InsuranceProviderRegistration />} />
          <Route path='/insuranceProviderNavbar' element={<InsuranceProviderNavbar />} />
          <Route path='/insuranceProviderLogin' element={<InsuranceProviderLogin />} />
          <Route path='/hospitalViewAllUnApprovedInsuranceProviders' element={<HospitalViewAllUnApprovedInsuranceProviders />} />
          <Route path='/hospitalViewOneUnApprovedInsuranceProvider' element={<HospitalViewOneUnapprovedInsuranceProvider />} />
          <Route path='/patientLogin' element={<PatientLogin />} />
          <Route path='/insuranceProviderViewProfile' element={<InsuranceProviderViewProfile />} />
          <Route path='/insuranceProviderChangePassword' element={<InsuranceProviderChangePassword />} />
          <Route path='/InsuranceProviderChangeIdProofImage' element={<InsuranceProviderChangeIdProofImage />} />
          <Route path='/InsuranceProviderChangeProfileImage' element={<InsuranceProviderChangeProfileImage />} />
          <Route path='/InsuranceProviderUpdateProfile' element={<InsuranceProviderUpdateProfile />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


