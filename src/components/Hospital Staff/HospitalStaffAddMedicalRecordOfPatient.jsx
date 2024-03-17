import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HospitalStaffNavbar from './HospitalStaffNavbar';
import Footer from '../Common/Footer';

const HospitalStaffAddMedicalRecordOfPatient = () => {
    const navigate = useNavigate();
    const initialMedicalRecordData = {
        hospitalStaffId: sessionStorage.getItem('hospitalStaffId') || '',
        patientId: sessionStorage.getItem('patientId') || '',
        staffReport: '',
        medicineAndLabCosts: '',
        byStanderName: '',
        byStanderMobileNumber: ''
    };
    const [medicalRecord, setMedicalRecord] = useState(initialMedicalRecordData);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMedicalRecord({
            ...medicalRecord,
            [name]: value
        });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const resetForm = () => {
        setMedicalRecord(initialMedicalRecordData);
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:1313/api/mic/hospitalStaff/hospitalStaffAddMedicalRecord',
                medicalRecord,
                {
                    headers: {
                        token,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.status === 200) {
                alert('Medical record added successfully.');
                resetForm();
                navigate('/medicalRecords');
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        setErrors(data.results || {});
                        break;
                    case 401:
                    case 403:
                        alert(data.message || 'Unauthorized access. Please log in again.');
                        navigate('/hospitalStaffLogin');
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <HospitalStaffNavbar />
    <div className="container mt-5">
        <div className="row">
            <div className="col-12">
                <div className="card shadow-lg" style={{borderRadius: '20px', overflow: 'hidden'}}>
                    <div className="card-body p-5" style={{ background: '#fff'}}>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="staffReport" className="form-label">Staff Report:</label>
                                <textarea className={`form-control ${errors.staffReport ? 'is-invalid' : ''}`} id="staffReport" name="staffReport" value={medicalRecord.staffReport} onChange={handleChange} style={{borderRadius: '15px'}}></textarea>
                                {errors.staffReport && <div className="invalid-feedback">{errors.staffReport}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="medicineAndLabCosts" className="form-label">Medicine and Lab Costs:</label>
                                <input type="text" className={`form-control ${errors.medicineAndLabCosts ? 'is-invalid' : ''}`} id="medicineAndLabCosts" name="medicineAndLabCosts" value={medicalRecord.medicineAndLabCosts} onChange={handleChange} style={{borderRadius: '15px'}} />
                                {errors.medicineAndLabCosts && <div className="invalid-feedback">{errors.medicineAndLabCosts}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="byStanderName" className="form-label">ByStander Name:</label>
                                <input type="text" className={`form-control ${errors.byStanderName ? 'is-invalid' : ''}`} id="byStanderName" name="byStanderName" value={medicalRecord.byStanderName} onChange={handleChange} style={{borderRadius: '15px'}} />
                                {errors.byStanderName && <div className="invalid-feedback">{errors.byStanderName}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="byStanderMobileNumber" className="form-label">ByStander Number:</label>
                                <input type="text" className={`form-control ${errors.byStanderMobileNumber ? 'is-invalid' : ''}`} id="byStanderMobileNumber" name="byStanderMobileNumber" value={medicalRecord.byStanderMobileNumber} onChange={handleChange} style={{borderRadius: '15px'}} />
                                {errors.byStanderMobileNumber && <div className="invalid-feedback">{errors.byStanderMobileNumber}</div>}
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-outline-secondary text-dark d-flex justify-content-center align-items-center"
                                disabled={isLoading}
                                style={{
                                    border: '2px solid #6c757d',
                                                color: '#6c757d',
                                                fontWeight: 'bold',
                                                padding: '10px 20px',
                                                borderRadius: '25px',
                                                width: 'auto'
                                    
                                }}
                            >
                                {isLoading ? 'Adding...' : 'Add Medical Record'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</div>


    );
};

export default HospitalStaffAddMedicalRecordOfPatient;
