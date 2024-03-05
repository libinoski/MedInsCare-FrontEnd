import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
                        setErrors(data.errors || {});
                        break;
                    case 401:
                    case 403:
                        alert(data.message || 'Unauthorized access. Please log in again.');
                        navigate('/login');
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
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title mb-4">Add Medical Record</h4>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="staffReport" className="form-label">Staff Report:</label>
                                    <textarea className={`form-control ${errors.staffReport ? 'is-invalid' : ''}`} id="staffReport" name="staffReport" value={medicalRecord.staffReport} onChange={handleChange}></textarea>
                                    {errors.staffReport && <div className="text-danger">{errors.staffReport}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="medicineAndLabCosts" className="form-label">Medicine and Lab Costs:</label>
                                    <input type="text" className={`form-control ${errors.medicineAndLabCosts ? 'is-invalid' : ''}`} id="medicineAndLabCosts" name="medicineAndLabCosts" value={medicalRecord.medicineAndLabCosts} onChange={handleChange} />
                                    {errors.medicineAndLabCosts && <div className="text-danger">{errors.medicineAndLabCosts}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="byStanderName" className="form-label">ByStander Name:</label>
                                    <input type="text" className={`form-control ${errors.byStanderName ? 'is-invalid' : ''}`} id="byStanderName" name="byStanderName" value={medicalRecord.byStanderName} onChange={handleChange} />
                                    {errors.byStanderName && <div className="text-danger">{errors.byStanderName}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="byStanderMobileNumber" className="form-label">ByStander Number:</label>
                                    <input type="text" className={`form-control ${errors.byStanderMobileNumber ? 'is-invalid' : ''}`} id="byStanderMobileNumber" name="byStanderMobileNumber" value={medicalRecord.byStanderMobileNumber} onChange={handleChange} />
                                    {errors.byStanderMobileNumber && <div className="text-danger">{errors.byStanderMobileNumber}</div>}
                                </div>

                                <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? 'Adding...' : 'Add Medical Record'}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalStaffAddMedicalRecordOfPatient;
