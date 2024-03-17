import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import HospitalNavbar from './HospitalNavbar';

const HospitalViewAllMedicalRecords = () => {
    const navigate = useNavigate();
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleErrors = (error) => {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 401:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        navigate('/hospitalLogin');
                        break;
                    case 403:
                        alert(data.message || 'Forbidden access.');
                        break;
                    case 422:
                        alert(data.error || 'An error occurred while fetching medical records.');
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

        const fetchMedicalRecords = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/viewAllMedicalRecords',
                    { hospitalId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setMedicalRecords(response.data.data);
                }
            } catch (error) {
                handleErrors(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMedicalRecords();
    }, [navigate]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

<HospitalNavbar />
  <div className="flex-grow-1 container-fluid py-4" style={{ overflowY: 'auto' }}>
    <div className="container pt-5 pb-5">
      {isLoading ? (
        <p className="text-center">Loading medical records...</p>
      ) : medicalRecords.length > 0 ? (
        <div className="row justify-content-center pt-5 pb-5">
          {medicalRecords.map((record) => (
            <div key={record.recordId} className="col-md-4 mb-4">
              <div className="card h-100" style={{
                cursor: 'pointer',
                borderRadius: '20px',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' // Default shadow
              }} onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.borderColor = '#007bff'; // Apply blue border on hover
                e.currentTarget.style.borderWidth = '1px';
                e.currentTarget.style.borderStyle = 'solid';
              }} onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = 'transparent'; // Revert border on mouse out
              }}>
                <img src={record.patientProfileImage || "defaultProfileImagePath"} className="card-img-top" alt="Patient" style={{
                  borderTopLeftRadius: '20px',
                  borderTopRightRadius: '20px',
                  objectFit: 'cover',
                  aspectRatio: '16/9',
                  width: '100%',
                  height: 'auto'
                }} />
                <div className="card-body">
                  <h5 className="card-title">{record.patientName}</h5>
                  <p className="card-text"><strong>Hospital:</strong> {record.hospitalName}</p>
                  <p className="card-text"><strong>Patient Email:</strong> {record.patientEmail}</p>
                  <p className="card-text"><strong>Staff Report:</strong> {record.staffReport}</p>
                  <p className="card-text"><strong>Medicine and Lab Costs:</strong> {record.medicineAndLabCosts}</p>
                  <p className="card-text"><strong>ByStander Name:</strong> {record.byStanderName}</p>
                  <p className="card-text"><strong>ByStander Mobile Number:</strong> {record.byStanderMobileNumber}</p>
                  <p className="card-text"><strong>Registered Date:</strong> {new Date(record.registeredDate).toLocaleString()}</p>
                  <p className="card-text"><strong>Date Generated:</strong> {new Date(record.dateGenerated).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center mt-4">No medical records found.</p>
      )}
    </div>
  </div>
  <Footer className="mt-auto" />
</div>

    );
};

export default HospitalViewAllMedicalRecords;
