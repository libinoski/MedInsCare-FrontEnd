import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './InsuranceProviderNavbar';
import Footer from '../Common/Footer';

const InsuranceProviderAddInsurancePackage = () => {
    const navigate = useNavigate();
    const initialPackageData = {
        insuranceProviderId: sessionStorage.getItem('insuranceProviderId'),
        packageTitle: '',
        packageDetails: '',
        packageDuration: '',
        packageAmount: '',
        packageTAndC: '',
        packageImage: null
    };
    const [packageData, setPackageData] = useState(initialPackageData);
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPackageData({ ...packageData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setPackageData({ ...packageData, packageImage: file });
    };

    const resetForm = () => {
        setPackageData(initialPackageData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const formData = new FormData();
            formData.append('insuranceProviderId', packageData.insuranceProviderId);
            formData.append('packageTitle', packageData.packageTitle);
            formData.append('packageDetails', packageData.packageDetails);
            formData.append('packageDuration', packageData.packageDuration);
            formData.append('packageAmount', packageData.packageAmount);
            formData.append('packageTAndC', packageData.packageTAndC);
            if (packageData.packageImage) {
                formData.append('packageImage', packageData.packageImage);
            }
            const response = await axios.post(
                ' http://localhost:1313/api/mic/insuranceProvider/addInsurancePackage',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        token
                    }
                }
            );
            if (response.status === 200) {
                alert('Insurance package added successfully');
                resetForm();
                navigate('/insuranceProviderViewProfile');
            }
        } catch (error) {
            handleErrors(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleErrors = (error) => {
        if (error.response) {
            const { status, data } = error.response;
            switch (status) {
                case 400:
                    setValidationErrors(data.results || {});
                    break;
                case 401:
                    alert(data.message);
                    break;
                case 403:
                    alert(data.error || 'Unauthorized access. Please login again.');
                    navigate('/insuranceProviderLogin');
                    break;
                case 422:
                    alert(data.error || 'An error occurred while adding insurance package.');
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div className="container-fluid" style={{ flex: 1, paddingTop: '56px', paddingBottom: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="row justify-content-center" style={{ width: '100%' }}>
                    <div className="col-lg-12 d-flex align-items-center justify-content-center">
                        <div className="container py-5">
                            <div className="card" style={{ boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', transition: '0.3s', borderRadius: '5px', ...(validationErrors && Object.keys(validationErrors).length > 0 ? { border: '1px solid #dc3545' } : {}) }}>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-12 mb-3">
                                                <label htmlFor="packageTitle" className="form-label">Title</label>
                                                <input type="text" className={`form-control ${validationErrors.packageTitle ? 'is-invalid' : ''}`} id="packageTitle" name="packageTitle" value={packageData.packageTitle} onChange={handleInputChange} />
                                                {validationErrors.packageTitle && <div className="invalid-feedback">{validationErrors.packageTitle}</div>}
                                            </div>
                                            <div className="col-12 mb-3">
                                                <label htmlFor="packageDetails" className="form-label">Details</label>
                                                <textarea className={`form-control ${validationErrors.packageDetails ? 'is-invalid' : ''}`} id="packageDetails" name="packageDetails" value={packageData.packageDetails} onChange={handleInputChange} rows="5"></textarea>
                                                {validationErrors.packageDetails && <div className="invalid-feedback">{validationErrors.packageDetails}</div>}
                                            </div>
                                            <div className="col-12 mb-3">
                                                <label htmlFor="packageDuration" className="form-label">Duration</label>
                                                <input type="text" className={`form-control ${validationErrors.packageDuration ? 'is-invalid' : ''}`} id="packageDuration" name="packageDuration" value={packageData.packageDuration} onChange={handleInputChange} />
                                                {validationErrors.packageDuration && <div className="invalid-feedback">{validationErrors.packageDuration}</div>}
                                            </div>
                                            <div className="col-12 mb-3">
                                                <label htmlFor="packageAmount" className="form-label">Amount</label>
                                                <input type="text" className={`form-control ${validationErrors.packageAmount ? 'is-invalid' : ''}`} id="packageAmount" name="packageAmount" value={packageData.packageAmount} onChange={handleInputChange} />
                                                {validationErrors.packageAmount && <div className="invalid-feedback">{validationErrors.packageAmount}</div>}
                                            </div>
                                            <div className="col-12 mb-3">
                                                <label htmlFor="packageTAndC" className="form-label">Terms and Conditions</label>
                                                <textarea className={`form-control ${validationErrors.packageTAndC ? 'is-invalid' : ''}`} id="packageTAndC" name="packageTAndC" value={packageData.packageTAndC} onChange={handleInputChange} rows="5"></textarea>
                                                {validationErrors.packageTAndC && <div className="invalid-feedback">{validationErrors.packageTAndC}</div>}
                                            </div>
                                            <div className="col-12 mb-3">
                                                <label htmlFor="packageImage" className="form-label">Image</label>
                                                <input type="file" className={`form-control ${validationErrors.packageImage ? 'is-invalid' : ''}`} id="packageImage" name="packageImage" onChange={handleFileChange} />
                                                {validationErrors.packageImage && <div className="invalid-feedback">{validationErrors.packageImage}</div>}
                                            </div>
                                            <div className="col-12 text-center">
                                                <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? 'Adding...' : 'Add Package'}</button>
                                            </div>
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

export default InsuranceProviderAddInsurancePackage;
