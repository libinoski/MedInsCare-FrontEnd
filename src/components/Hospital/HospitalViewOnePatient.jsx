import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import backgroundImage from '../../images/Hospital/hr.jpg'; // Import the background image
import Footer from '../Common/Footer';

const HospitalViewOnePatient = () => {
    const navigate = useNavigate();
    const [patientDetails, setPatientDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchPatientDetails = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const patientId = sessionStorage.getItem('patientId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/viewOnePatient',
                    { hospitalId, patientId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setPatientDetails(response.data.data);
                }
            } catch (error) {
                if (error.response) {
                    const { status, data } = error.response;
                    switch (status) {
                        case 401:
                        case 403:
                            alert(data.message || 'Unauthorized access. Please login again.');
                            navigate('/hospitalLogin');
                            break;
                        case 422:
                            const errorMessage422 = data.error || "An error occurred while fetching staff details.";
                            alert(errorMessage422);
                            break;
                        case 500:
                            alert(data.message || 'Internal server error. Please try again later.');
                            break;
                        default:
                            alert('An error occurred. Please try again.');
                            break;
                    }
                } else {
                    alert('An error occurred. Please check your connection and try again.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatientDetails();
    }, [navigate]);

    const handleDeletePatient = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this patient?");
        if (!confirmed) return;

        try {
            const token = sessionStorage.getItem('token');
            const hospitalId = sessionStorage.getItem('hospitalId');
            const patientId = sessionStorage.getItem('patientId');
            const response = await axios.post(
                'http://localhost:1313/api/mic/hospital/deleteOnePatient',
                { hospitalId, patientId },
                {
                    headers: {
                        token
                    }
                }
            );
            if (response.status === 200) {
                alert('Patient deleted successfully.');
                navigate('/hospitalViewAllPatients'); // Redirect to the home page or any other appropriate page
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 401:
                    case 403:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        navigate('/hospitalLogin');
                        break;
                    case 422:
                        const errorMessage422 = data.error || "An error occurred while deleting the patient.";
                        alert(errorMessage422);
                        break;
                    case 500:
                        alert(data.message || 'Internal server error. Please try again later.');
                        break;
                    default:
                        alert('An error occurred. Please try again.');
                        break;
                }
            } else {
                alert('An error occurred. Please check your connection and try again.');
            }
        }
    };

    const handleSendNotificationToPatient = () => {
        navigate('/hospitalSendNotificationToPatient');
    };

    return (
        <div>
            <Navbar />
            <div className="container-fluid py-5" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="container" style={{ maxWidth: '100%', padding: '0 15px', overflowY: 'auto', maxHeight: '100%' }}>
                    {isLoading ? (
                        <p className="text-center">Loading patient details...</p>
                    ) : (
                        <div className="row justify-content-start">
                            <div className="col-lg-6">
                                {patientDetails ? (
                                    <div className="card" style={{ borderRadius: '10px', padding: '20px', position: 'relative' }}>
                                        <div className="dropdown" style={{ position: 'absolute', top: '20px', right: '20px' }}>
                                            <button className="btn btn-outline-light dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" style={{ borderColor: '#007bff', color: '#007bff', boxShadow: '0 0 10px rgba(0,123,255,.5)' }}>
                                                Actions
                                            </button>
                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ position: 'absolute', left: '100%', top: '0', borderRadius: '0.5rem', backgroundColor: '#f8f9fa', boxShadow: '0 4px 6px rgba(0,0,0,.1)', transform: 'translateX(10px)' }}>
                                                <li><button className="dropdown-item" onClick={handleDeletePatient}>Delete Patient</button></li>
                                                <li><button className="dropdown-item" onClick={handleSendNotificationToPatient}>Send Notification</button></li>
                                                <li><button className="dropdown-item" onClick={() => navigate('/hospitalUpdatePatient')}>Update Patient</button></li>
                                            </ul>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <img src={patientDetails.patientProfileImage} alt="Profile" className="img-fluid" style={{ maxWidth: '100%' }} />
                                                </div>
                                                <div className="col-md-8">
                                                    <h5 className="card-title">{patientDetails.patientName}</h5>
                                                    <p><strong>Email:</strong> {patientDetails.patientEmail}</p>
                                                    <p><strong>Aadhar:</strong> {patientDetails.patientAadhar}</p>
                                                    <p><strong>Mobile:</strong> {patientDetails.patientMobile}</p>
                                                    <p><strong>Address:</strong> {patientDetails.patientAddress}</p>
                                                    <p><strong>Admitted Date:</strong> {patientDetails.patientRegisteredDate}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                            <img src={patientDetails.patientIdProofImage} alt="ID Proof" className="img-fluid" style={{ maxWidth: '100%' }} />
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-center">No patient details found.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HospitalViewOnePatient;
