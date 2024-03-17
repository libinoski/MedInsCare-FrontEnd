import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import HospitalNavbar from './HospitalNavbar';


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
                            alert(data.error || 'Internal server error. Please try again later.');
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
    // Function to format date and time
    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
        const formattedTime = date.toLocaleTimeString('en-US', { hour12: false }); // Format: HH:MM
        return `${formattedDate} ${formattedTime}`;
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
                            <span className="visually-hidden">Loading patient details...</span>
                        </div>
                    </div>
                ) : patientDetails ? (
                    <div className="card shadow" style={{ borderRadius: '20px', overflow: 'hidden', maxWidth: '600px' }}>
                        <div className="card-body p-4 p-md-5">
                            <div className="text-center mb-4"> {/* Centering the image */}
                                <img
                                    src={patientDetails.patientProfileImage}
                                    alt="Profile"
                                    className="img-fluid rounded-circle border"
                                    style={{ width: '200px', height: '200px', objectFit: 'cover', border: '5px solid #ffffff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                                />
                                {patientDetails.isVerified && (
                                    <i className="fas fa-check-circle" style={{ color: 'green', fontSize: '24px', marginTop: '10px' }}></i>
                                )}
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-12"> {/* Adjusted column width */}
                                    <h2 className="card-title text-center" style={{ color: '#0056b3' }}>{patientDetails.patientName}</h2>
                                    <p className="mb-2"><strong>Ward:</strong> {patientDetails.admittedWard}</p>
                                    <p className="mb-2"><strong>Diagnosis or disease type:</strong> {patientDetails.diagnosisOrDiseaseType}</p>

                                    <p className="mb-2"><strong>Email:</strong> {patientDetails.patientEmail}</p>
                                    <p className="mb-2"><strong>Aadhar:</strong> {patientDetails.patientAadhar}</p>
                                    <p className="mb-2"><strong>Mobile:</strong> {patientDetails.patientMobile}</p>
                                    <p className="mb-2"><strong>Address:</strong> {patientDetails.patientAddress}</p>
                                    <p><strong>Admitted Date:</strong> {formatDate(patientDetails.registeredDate)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer d-flex justify-content-center bg-transparent">
                            <button 
                                className="btn mx-2 btn-outline-secondary text-dark" 
                                onClick={handleDeletePatient} 
                                style={{
                                    border: '2px solid #6c757d',
                                    color: '#6c757d',
                                    fontWeight: 'bold',
                                    padding: '10px 20px',
                                    borderRadius: '25px'
                                }}
                            >
                                Delete Patient
                            </button>
                            <button 
                                className="btn mx-2 btn-outline-secondary text-dark" 
                                onClick={handleSendNotificationToPatient} 
                                style={{
                                    border: '2px solid #6c757d',
                                    color: '#6c757d',
                                    fontWeight: 'bold',
                                    padding: '10px 20px',
                                    borderRadius: '25px'
                                }}
                            >
                                Send Notification
                            </button>
                            <button 
                                className="btn mx-2 btn-outline-secondary text-dark" 
                                onClick={() => navigate('/hospitalUpdatePatient')} 
                                style={{
                                    border: '2px solid #6c757d',
                                    color: '#6c757d',
                                    fontWeight: 'bold',
                                    padding: '10px 20px',
                                    borderRadius: '25px'
                                }}
                            >
                                Update Patient
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center">No patient details found.</p>
                )}
            </div>
        </div>
    </div>
    <Footer className="mt-auto" />
</div>

    );
};

export default HospitalViewOnePatient;
