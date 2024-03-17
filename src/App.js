import './App.css';
import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HospitalRegistration from './components/Hospital/HospitalRegistration';
import HospitalLogin from './components/Hospital/HospitalLogin';
import HospitalChangePassword from './components/Hospital/HospitalChangePassword';
import HospitalViewProfile from './components/Hospital/HospitalViewProfile';
import HospitalUpdateProfile from './components/Hospital/HospitalUpdateProfile';
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
import InsuranceProviderLogin from './components/InsuranceProviders/InsuranceProviderLogin';
import HospitalViewAllUnApprovedInsuranceProviders from './components/Hospital/HospitalViewAllUnApprovedInsuranceProviders';
import HospitalViewOneUnapprovedInsuranceProvider from './components/Hospital/HospitalViewOneUnApprovedInsuranceProvider';
import PatientLogin from './components/Patient/PatientLogin';
import InsuranceProviderViewProfile from './components/InsuranceProviders/InsuranceProviderViewProfile';
import InsuranceProviderChangePassword from './components/InsuranceProviders/InsuranceProviderChangePassword';
import InsuranceProviderUpdateProfile from './components/InsuranceProviders/InsuranceProviderUpdateProfile';
import HomePage from './components/Common/Home';
import HospitalSearchInsuranceProviders from './components/Hospital/HospitalSearchInsuranceProviders';
import HospitalViewAllInsuranceProviders from './components/Hospital/HospitalViewAllInsuranceProviders';
import HospitalViewOneInsuranceProvider from './components/Hospital/HospitalViewOneInsuranceProvider';
import HospitalSendNotificationToInsuranceProvider from './components/Hospital/HospitalSendNotifictionToInsuranceProvider';
import PatientChangePassword from './components/Patient/PatientChangePassword';
import PatientViewProfile from './components/Patient/PatientViewProfile';
import HospitalUpdatePatient from './components/Hospital/HospitalUpdatePatient';
import HospitalStaffRequestDischarge from './components/Hospital Staff/HospitalStaffRequestDischarge';
import HospitalStaffAddMedicalRecordOfPatient from './components/Hospital Staff/HospitalStaffAddMedicalRecordOfPatient';
import HospitalViewAllMedicalRecords from './components/Hospital/HospitalViewAllMedicalRecords';
import PatientViewAllInsuranceProviders from './components/Patient/PatientViewAllInsuranceProviders';
import PatientViewOneInsuranceProvider from './components/Patient/PatientViewOneInsuranceProvider';
import InsuranceProviderAddInsurancePackage from './components/InsuranceProviders/InsuranceProviderAddInsurancePackage';
import PatientViewAllInsurancePackages from './components/Patient/PatientViewAllInsurancePackages';
import PatientViewOneInsurancePackage from './components/Patient/PatientViewOneInsurancePackage';
import Dashboard from './components/Hospital/HospitalDashboard';
import HospitalSearchPatients from './components/Hospital/HospitalSeacrchPatients';
import HospitalViewAllReviews from './components/Hospital/HospitalViewAllReviewsAboutInsuranceProviders';
import PatientAddReview from './components/Patient/PatientAddReview';
import InsuranceProviderViewAllClients from './components/InsuranceProviders/InsuranceProvierViewAllClients';
import InsuranceProviderViewOneClient from './components/InsuranceProviders/InsuranceProviderViewOneClient';
import InsuranceProviderSendNotificationToClient from './components/InsuranceProviders/InsuranceProviderSendNotificationToClient';
import PatientViewAllNotificationsFromInsuranceProvider from './components/Patient/PatientViewAllNotificationsFromInsuranceProvider';
import PatientNavbar from './components/Patient/PatientNavbar';
import HospitalNavbar from './components/Hospital/HospitalNavbar';
import InsuranceProviderViewAllNews from './components/InsuranceProviders/InsuranceProviderViewAllNews';
import InsuranceProviderNavbar from './components/InsuranceProviders/InsuranceProviderNavbar';
import InsuranceProviderChangeIdProofImage from './components/InsuranceProviders/InsuranceProviderChangeIdProofImage';
import InsuranceProviderChangeProfileImage from './components/InsuranceProviders/InsuranceProviderChangeProfileImage';
import PatientChangeProfileImage from './components/Patient/PatientChangeProfileImage';
import PatientChangeIdProofImage from './components/Patient/PatientChangeIdProofImage';
import InsuranceProviderViewOneNews from './components/InsuranceProviders/InsuranceProviderViewOneNews';
import PatientUpdateProfile from './components/Patient/PatientUpdateProfile';
import PatientSearchInsuranceProviders from './components/Patient/PatientSearchInsuranceProviders';
import HospitalGenerateBill from './components/Hospital/HospitalGenerateOneBill';
import HospitalViewOneMedicalRecord from './components/Hospital/HospitalViewOneMedicalRecord';
import PatientViewAllBills from './components/Patient/PatientViewAllBills';
import PatientViewOneBill from './components/Patient/PatientViewOneBill';
import PatientViewOnePaidBill from './components/Patient/PatientViewOnePaidBill';
import PatientViewAllPaidBills from './components/Patient/PatientViewAllPaidBills';
import HospitalViewAllBills from './components/Hospital/HospitalViewAllBills';
import HospitalViewOneBill from './components/Hospital/HospitalViewOneBill';
import HospitalViewAllPaidBills from './components/Hospital/HospitalViewAllPaidBills';
import HospitalViewOnePaidBill from './components/Hospital/HospitalViewOnePaidBill';
import HospitalViewAllDischargeRequests from './components/Hospital/HospitalViewAllDischargeRequests';
import HospitalViewOneDischargeRequest from './components/Hospital/HospitalViewOneDischargeRequest';


function App() {
  return (
    <div>

      <BrowserRouter>
        <Routes>

{/* Hospital routes */}
<Route path='/hospitalNavbar' element={<HospitalNavbar />} />
<Route path='/hospitalStaffNavbar' element={<HospitalStaffNavbar />} />
<Route path='/hospitalLogin' element={<HospitalLogin />} />
<Route path='/hospitalChangePassword' element={<HospitalChangePassword />} />
<Route path='/hospitalViewProfile' element={<HospitalViewProfile />} />
<Route path='/hospitalUpdateProfile' element={<HospitalUpdateProfile />} />
<Route path='/hospitalChangeImage' element={<HospitalChangeImage />} />
<Route path='/hospitalRegisterStaff' element={<HospitalRegisterStaff />} />
<Route path='/hospitalUpdateStaff' element={<HospitalUpdateStaff />} />
<Route path='/hospitalViewAllStaffs' element={<HospitalViewAllStaffs />} />
<Route path='/hospitalViewOneStaff' element={<HospitalViewOneStaff />} />
<Route path='/hospitalSearchStaffs' element={<HospitalSearchStaffs />} />
<Route path='/hospitalAddNews' element={<HospitalAddNews />} />
<Route path='/hospitalViewOneNews' element={<HospitalViewOneNews />} />
<Route path='/hospitalUpdateNews' element={<HospitalUpdateNews />} />
<Route path='/hospitalViewAllUnApprovedInsuranceProviders' element={<HospitalViewAllUnApprovedInsuranceProviders />} />
<Route path='/hospitalViewOneUnapprovedInsuranceProvider' element={<HospitalViewOneUnapprovedInsuranceProvider />} />
<Route path='/hospitalViewAllNews' element={<HospitalViewAllNews />} />
<Route path='/hospitalViewAllSuspendedStaffs' element={<HospitalViewAllSuspendedStaffs />} />
<Route path='/hospitalViewOneSuspendedStaff' element={<HospitalViewOneSuspendedStaff />} />
<Route path='/hospitalSendNotificationToStaff' element={<HospitalSendNotificationToStaff />} />
<Route path='/hospitalSearchPatients' element={<HospitalSearchPatients />} />
<Route path='/hospitalRegistration' element={<HospitalRegistration />} />
<Route path='/hospitalUpdatePatient' element={<HospitalUpdatePatient />} />
<Route path='/hospitalStaffRequestDischarge' element={<HospitalStaffRequestDischarge />} />
<Route path='/hospitalStaffAddMedicalRecordOfPatient' element={<HospitalStaffAddMedicalRecordOfPatient />} />
<Route path='/hospitalViewAllMedicalRecords' element={<HospitalViewAllMedicalRecords />} />
<Route path='/hospitalSearchInsuranceProviders' element={<HospitalSearchInsuranceProviders />} />
<Route path='/hospitalViewAllInsuranceProviders' element={<HospitalViewAllInsuranceProviders />} />
<Route path='/hospitalViewOneInsuranceProvider' element={<HospitalViewOneInsuranceProvider />} />
<Route path='/hospitalSendNotificationToInsuranceProvider' element={<HospitalSendNotificationToInsuranceProvider />} />
<Route path='/viewAllReviews' element={<HospitalViewAllReviews />} />
<Route path='/hospitalGenerateOneBill' element={<HospitalGenerateBill />} />
<Route path='/hospitalViewOneMedicalRecord' element={<HospitalViewOneMedicalRecord />} />
<Route path='/hospitalViewAllBills' element={<HospitalViewAllBills />} />
<Route path='/hospitalViewOneBill' element={<HospitalViewOneBill />} />
<Route path='/hospitalViewAllPaidBills' element={<HospitalViewAllPaidBills />} />
<Route path='/hospitalViewOnePaidBill' element={<HospitalViewOnePaidBill />} />
<Route path='/hospitalViewAllDischargeRequests' element={<HospitalViewAllDischargeRequests />} />
<Route path='/hospitalViewOneDischargeRequest' element={<HospitalViewOneDischargeRequest />} />


{/* Hospital staff routes */}

<Route path='/hospitalStaffLogin' element={<HospitalStaffLogin />} />
<Route path='/hospitalStaffChangeIdProofImage' element={<HospitalStaffChangeIdProofImage />} />
<Route path='/hospitalStaffChangeProfileImage' element={<HospitalStaffChangeProfileImage />} />
<Route path='/hospitalStaffChangePassword' element={<HospitalStaffChangePassword />} />
<Route path='/hospitalStaffViewAllNews' element={<HospitalStaffViewAllNews />} />
<Route path='/hospitalStaffViewOneNews' element={<HospitalStaffViewOneNews />} />
<Route path='/hospitalStaffViewProfile' element={<HospitalStaffViewProfile />} />
<Route path='/hospitalStaffUpdateProfile' element={<HospitalStaffUpdateProfile />} />
<Route path='/hospitalStaffViewAllNotifications' element={<HospitalStaffViewAllNotifications />} />
<Route path='/hospitalStaffViewOneNotification' element={<HospitalStaffViewOneNotification />} />
<Route path='/hospitalStaffRegisterPatient' element={<HospitalStaffRegisterPatient />} />
<Route path='/hospitalViewAllPatients' element={<HospitalViewAllPatients />} />
<Route path='/hospitalStaffViewAllPatients' element={<HospitalStaffViewAllPatients />} />
<Route path='/hospitalViewOnePatient' element={<HospitalViewOnePatient />} />
<Route path='/hospitalSendNotificationToPatient' element={<HospitalSendNotificationToPatient />} />
<Route path='/hospitalStaffViewOnePatient' element={<HospitalStaffViewOnePatient />} />
<Route path='/hospitalStaffSendNotificationToPatient' element={<HospitalStaffSendNotificationToPatient />} />


{/* Insurance provider routes */}

<Route path='/insuranceProviderRegistration' element={<InsuranceProviderRegistration />} />
<Route path='/insuranceProviderNavbar' element={<InsuranceProviderNavbar />} />
<Route path='/insuranceProviderLogin' element={<InsuranceProviderLogin />} />
<Route path='/insuranceProviderViewProfile' element={<InsuranceProviderViewProfile />} />
<Route path='/insuranceProviderChangePassword' element={<InsuranceProviderChangePassword />} />
<Route path='/InsuranceProviderUpdateProfile' element={<InsuranceProviderUpdateProfile />} />
<Route path='/insuranceProviderViewAllNews' element={<InsuranceProviderViewAllNews />} />
<Route path='/insuranceProviderViewOneNews' element={<InsuranceProviderViewOneNews />} />
<Route path='/insuranceProviderChangeIdProofImage' element={<InsuranceProviderChangeIdProofImage />} />
<Route path='/insuranceProviderChangeProfileImage' element={<InsuranceProviderChangeProfileImage />} />
<Route path='/insuranceProviderAddInsurancePackage' element={<InsuranceProviderAddInsurancePackage />} />
<Route path='/insuranceProviderViewAllClients' element={<InsuranceProviderViewAllClients />} />
<Route path='/insuranceProviderViewOneClient' element={<InsuranceProviderViewOneClient />} />
<Route path='/insuranceProviderSendNotificationToClient' element={<InsuranceProviderSendNotificationToClient />} />



{/* Patient routes */}
<Route path='/patientLogin' element={<PatientLogin />} />
<Route path='/patientChangePassword' element={<PatientChangePassword />} />
<Route path='/patientViewProfile' element={<PatientViewProfile />} />
<Route path='/patientChangeProfileImage' element={<PatientChangeProfileImage />} />
<Route path='/patientChangeIdProofImage' element={<PatientChangeIdProofImage />} />
<Route path='/patientViewAllInsuranceProviders' element={<PatientViewAllInsuranceProviders />} />
<Route path='/patientViewOneInsuranceProvider' element={<PatientViewOneInsuranceProvider />} />
<Route path='/patientViewAllInsurancePackages' element={<PatientViewAllInsurancePackages />} />
<Route path='/patientViewOneInsurancePackage' element={<PatientViewOneInsurancePackage />} />
<Route path='/patientViewAllNotificationsFromInsuranceProvider' element={<PatientViewAllNotificationsFromInsuranceProvider />} />
<Route path='/patientNavbar' element={<PatientNavbar />} />
<Route path='/patientAddReview' element={<PatientAddReview />} />
<Route path='/patientUpdateProfile' element={<PatientUpdateProfile />} />
<Route path='/patientSearchInsuranceProviders' element={<PatientSearchInsuranceProviders />} />
<Route path='/patientViewAllBills' element={<PatientViewAllBills />} />
<Route path='/patientViewOneBill' element={<PatientViewOneBill />} />
<Route path='/patientViewAllPaidBills' element={<PatientViewAllPaidBills />} />
<Route path='/patientViewOnePaidBill' element={<PatientViewOnePaidBill />} />


{/* Common */}
<Route path='/dashboard' element={<Dashboard />} />
<Route path='/footer' element={<Footer />} />
<Route path='/' element={<HomePage />} />


        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


