import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HospitalNavbar from './HospitalNavbar';
import Footer from '../Common/Footer';

const HospitalGenerateBill = () => {
    const navigate = useNavigate();
    const initialBillData = {
        hospitalId: sessionStorage.getItem('hospitalId'),
        patientId: sessionStorage.getItem('patientId'),
        costsExplained: '',
        totalAmount: '',
    };
    const [billData, setBillData] = useState(initialBillData);
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBillData({ ...billData, [name]: value });
    };

    const resetForm = () => {
        setBillData(initialBillData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:1313/api/mic/hospital/generateOneBill',
                billData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        token
                    }
                }
            );
            if (response.status === 200) {
                alert('Cost details sent successfully');
                resetForm();
                navigate('/hospitalViewAllMedicalRecords');
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        setValidationErrors(data.errors || {});
                        break;
                    case 401:
                    case 403:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        navigate('/hospitalLogin');
                        break;
                    case 422:
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <HospitalNavbar />
            <div className="container-fluid" style={{ flex: 1, paddingTop: '56px', paddingBottom: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="row" style={{ width: '100%' }}>
                    <div className="col-lg-12 d-flex align-items-center justify-content-center">
                        <div className="container py-5">
                            <div className="card" style={{ boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', transition: '0.3s', borderRadius: '5px', ...(validationErrors && Object.keys(validationErrors).length > 0 ? { border: '1px solid #dc3545' } : {}) }}>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        {/* Omitted patient ID field from the form */}
                                        <div className="mb-3">
                                            <label htmlFor="costsExplained" className="form-label">Costs Explained</label>
                                            <textarea className={`form-control ${validationErrors.costsExplained ? 'is-invalid' : ''}`} id="costsExplained" name="costsExplained" value={billData.costsExplained} onChange={handleInputChange} rows="5" style={{ width: '100%' }}></textarea>
                                            {validationErrors.costsExplained && <div className="invalid-feedback">{validationErrors.costsExplained}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="totalAmount" className="form-label">Total Amount</label>
                                            <input type="number" className={`form-control ${validationErrors.totalAmount ? 'is-invalid' : ''}`} id="totalAmount" name="totalAmount" value={billData.totalAmount} onChange={handleInputChange} />
                                            {validationErrors.totalAmount && <div className="invalid-feedback">{validationErrors.totalAmount}</div>}
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <button
                                                type="submit"
                                                className="btn btn-outline-secondary text-dark d-flex justify-content-center align-items-center"
                                                disabled={isLoading}
                                                style={{
                                                    border: '2px solid #6c757d',
                                                    color: '#6c757d',
                                                    fontWeight: 'bold',
                                                    boxShadow: '0px 4px 8px rgba(108, 117, 125, 0.6)',
                                                    padding: '10px 20px',
                                                    borderRadius: '25px',
                                                    width: '100%',
                                                    maxWidth: '200px', // Adjust based on your preference
                                                    textDecoration: 'none',
                                                    transition: 'background-color .3s'
                                                }}
                                            >
                                                {isLoading ? 'Sending...' : 'Send Cost Details'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HospitalGenerateBill;
