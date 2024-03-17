import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import HospitalNavbar from './HospitalNavbar';

// Function to format date and time
const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
    const formattedTime = date.toLocaleTimeString('en-US', { hour12: false }); // Format: HH:MM
    return `${formattedDate} ${formattedTime}`;
};

const HospitalViewAllPatients = () => {
    const navigate = useNavigate();
    const [patientList, setPatientList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleErrors = (error) => {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 401:
                    case 403:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        navigate('/hospitalLogin');
                        break;
                    case 422:
                        const errorMessage422 = data.error || "An error occurred while fetching patients.";
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
        };

        const fetchPatients = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/viewAllPatients',
                    { hospitalId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setPatientList(response.data.data);
                }
            } catch (error) {
                handleErrors(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatients();
    }, [navigate]);

    const handleViewPatient = (patientId) => {
        sessionStorage.setItem('patientId', patientId);
        navigate(`/hospitalViewOnePatient`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

<HospitalNavbar />
  <div className="container flex-grow-1 my-5">
    {isLoading ? (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading patients...</span>
        </div>
      </div>
    ) : patientList.length > 0 ? (
      <div className="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
        {patientList.map((patient, index) => (
          <div key={index} className="col">
            <div
              className="card h-100 shadow-sm"
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderRadius: '15px',
                border: '1px solid transparent'
              }}
              onClick={() => handleViewPatient(patient.patientId)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.borderColor = '#007bff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={patient.patientProfileImage || 'placeholder-image-url'} // Placeholder image URL goes here
                    alt="Patient"
                    className="rounded-circle me-3"
                    style={{ width: '60px', height: '60px', objectFit: 'cover', border: '3px solid #ffffff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                  />
                  <div>
                    <h5 className="card-title">{patient.patientName}</h5>
                    <p className="card-text">
                      <small className="text-muted">Registered Date:{formatDate(patient.registeredDate)}</small><br/>
                      <small className="text-muted">Ward: {patient.admittedWard}</small><br/>
                      <small className="text-muted">Diagnosis: {patient.diagnosisOrDiseaseType}</small><br/>
                      <small className="text-muted">Discharge Status: {patient.dischargeStatus === 1 ? 'Discharged' : 'Not Discharged'}</small>
                    </p>
                  </div>
                </div>
                <p className="card-text"><strong>Aadhar:</strong> {patient.patientAadhar}</p>
                <p className="card-text"><strong>Mobile:</strong> {patient.patientMobile}</p>
                <p className="card-text"><strong>Address:</strong> {patient.patientAddress}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="alert alert-warning text-center" role="alert">
        No patients found.
      </div>
    )}
  </div>
  <Footer />
</div>

    );
};

export default HospitalViewAllPatients;
