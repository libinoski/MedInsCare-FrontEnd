import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import HospitalStaffNavbar from './InsuranceProviderNavbar';

const InsuranceProviderChangeIdProofImage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [currentImage, setCurrentImage] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchCurrentImage = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const insuranceProviderId = sessionStorage.getItem('insuranceProviderId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/insuranceProvider/insuranceProviderViewProfile',
                    { insuranceProviderId },
                    { headers: { token } }
                );
                if (response.status === 200) {
                    setCurrentImage(response.data.data.insuranceProviderIdProofImage);
                }
            } catch (error) {
                console.error('Error fetching current image:', error);
            }
        };

        fetchCurrentImage();
    }, []);

    const handleIdProofImageUpload = async (e) => {
        e.preventDefault(); // Prevent default form submission

        if (Object.keys(validationErrors).length === 0) {
            const confirmed = window.confirm("Are you sure you want to upload this image?");
            if (!confirmed) return;
        }

        setIsLoading(true);
        setValidationErrors({});

        try {
            const token = sessionStorage.getItem('token');
            const insuranceProviderId = sessionStorage.getItem('insuranceProviderId');
            const formData = new FormData();
            formData.append('insuranceProviderIdProofImage', fileInputRef.current.files[0]);
            formData.append('insuranceProviderId', insuranceProviderId);

            const response = await axios.post(
                'http://localhost:1313/api/mic/insuranceProvider/insuranceProviderChangeIdProofImage',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data', 'token': token } }
            );

            if (response.status === 200) {
                alert(response.data.message);
                navigate('/insuranceProviderViewProfile')
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        setValidationErrors(data.results || {});
                        break;
                    case 401:
                    case 403:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        // Handle unauthorized access
                        break;
                    case 500:
                        alert(data.message || 'Internal server error. Please try again later.');
                        // Handle internal server error
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
<div>
    <HospitalStaffNavbar />
    <div
        className="container-fluid bg-blur"
        style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            paddingTop: '56px',
            position: 'relative',
        }}
    >
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="card transparent-card">
                        <div className="card-body">
                            <form onSubmit={handleIdProofImageUpload} encType="multipart/form-data">
                                {currentImage && (
                                    <div className="mb-3 text-center">
                                        <img
                                            src={currentImage}
                                            alt="Current Id Proof"
                                            className="img-fluid img-preview rounded-circle"
                                            style={{ maxWidth: '200px', maxHeight: '200px' }}
                                        />
                                    </div>
                                )}
                                <div className="mb-3">
                                    <label htmlFor="insuranceProviderIdProofImage" className="form-label">Choose New Id Proof Image:</label>
                                    <input
                                        type="file"
                                        className={`form-control ${validationErrors.insuranceProviderIdProofImage ? 'is-invalid' : ''}`}
                                        id="insuranceProviderIdProofImage"
                                        ref={fileInputRef}
                                    />
                                    {validationErrors.insuranceProviderIdProofImage && (
                                        <div className="invalid-feedback">{validationErrors.insuranceProviderIdProofImage}</div>
                                    )}
                                </div>
                                <div className="d-grid mt-4">
                                    <button type="submit" className={`btn btn-${Object.keys(validationErrors).length ? 'danger' : 'success'}`} disabled={isLoading} style={{ width: '100%', borderRadius: '20px' }}>
                                        {isLoading ? 'Uploading Image...' : 'Upload'}
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

export default InsuranceProviderChangeIdProofImage;
