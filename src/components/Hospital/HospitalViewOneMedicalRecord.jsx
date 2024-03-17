import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HospitalNavbar from './HospitalNavbar';
import Footer from '../Common/Footer';

const HospitalViewOneMedicalRecord = () => {
    const navigate = useNavigate();
    const [medicalRecord, setMedicalRecord] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Function to format date and time
    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
        const formattedTime = date.toLocaleTimeString('en-US', { hour12: false }); // Format: HH:MM
        return `${formattedDate} ${formattedTime}`;
    };

    useEffect(() => {
        const handleErrorResponse = (error) => {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 401:
                    case 403:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        navigate('/hospitalLogin');
                        break;
                    case 422:
                        alert(data.error || "An error occurred while fetching medical record details.");
                        break;
                    case 500:
                        alert(data.error || 'Internal server error. Please try again later.');
                        break;
                    default:
                        alert('An error occurred. Please try again.');
                        break;
                }
            } else {
                alert('An error occurred. Please check your connection and try again.');
            }
        };

        const fetchMedicalRecord = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const recordId = sessionStorage.getItem('recordId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/viewOneMedicalRecord',
                    { hospitalId, recordId },
                    { headers: { token } }
                );
                if (response.status === 200) {
                    // Set patientId in sessionStorage
                    sessionStorage.setItem('patientId', response.data.data.patientId);
                    // Set medicalRecord state
                    setMedicalRecord(response.data.data);
                }
            } catch (error) {
                handleErrorResponse(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMedicalRecord();
    }, [navigate]);

    const handleGenerateBill = (recordId) => {
        sessionStorage.setItem('recordId', recordId);
        navigate('/hospitalGenerateOneBill');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <HospitalNavbar />
            <div className="container-fluid py-5" style={{ flex: '1 0 auto' }}>
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 d-flex justify-content-center">
                        {isLoading ? (
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading medical record details...</span>
                                </div>
                            </div>
                        ) : medicalRecord ? (
                            <div className="card shadow" style={{ borderRadius: '20px', overflow: 'hidden', maxWidth: '600px' }}>
                                <div className="card-body p-4 p-md-5">
                                    <img
                                        src={medicalRecord.patientProfileImage}
                                        alt="Profile"
                                        className="img-fluid rounded-circle border"
                                        style={{ width: '200px', height: '200px', objectFit: 'cover', border: '5px solid #ffffff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                                    />
                                    <h2 className="card-title text-center" style={{ color: '#0056b3' }}>{medicalRecord.patientName}</h2>
                                    <p><strong>Patient Email:</strong> {medicalRecord.patientEmail}</p>
                                    <p><strong>Staff Report:</strong> {medicalRecord.staffReport}</p>
                                    <p><strong>Medicine and Lab Costs:</strong> {medicalRecord.medicineAndLabCosts}</p>
                                    <p><strong>By Stander Name:</strong> {medicalRecord.byStanderName}</p>
                                    <p><strong>By Stander Mobile Number:</strong> {medicalRecord.byStanderMobileNumber}</p>
                                    <p><strong>Hospital Name:</strong> {medicalRecord.hospitalName}</p>
                                    <p><strong>Hospital Email:</strong> {medicalRecord.hospitalEmail}</p>
                                    <p><strong>Hospital Staff Name:</strong> {medicalRecord.hospitalStaffName}</p>
                                    <p><strong>Hospital Staff Email:</strong> {medicalRecord.hospitalStaffEmail}</p>
                                    <p><strong>Registered Date:</strong> {medicalRecord.registeredDate ? formatDate(medicalRecord.registeredDate) : 'N/A'}</p>
                                    <p><strong>Date Generated:</strong> {medicalRecord.dateGenerated ? formatDate(medicalRecord.dateGenerated) : 'N/A'}</p>
                                    <button className="btn btn-primary" onClick={() => handleGenerateBill(medicalRecord.recordId)}>Generate Bill</button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center">No medical record details found.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer className="mt-auto" />
        </div>
    );
};

export default HospitalViewOneMedicalRecord;
