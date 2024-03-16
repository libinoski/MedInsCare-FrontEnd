import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import PatientNavbar from './PatientNavbar';

const PatientChangeProfileImage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [currentImage, setCurrentImage] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchCurrentImage = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const patientId = sessionStorage.getItem('patientId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/patient/patientViewProfile',
                    { patientId },
                    { headers: { token } }
                );
                if (response.status === 200) {
                    setCurrentImage(response.data.data.patientProfileImage);
                }
            } catch (error) {
                console.error('Error fetching current image:', error);
            }
        };

        fetchCurrentImage();
    }, []);

    const handleProfileImageUpload = async (e) => {
        e.preventDefault(); // Prevent default form submission

        if (Object.keys(validationErrors).length === 0) {
            const confirmed = window.confirm("Are you sure you want to upload this image?");
            if (!confirmed) return;
        }

        setIsLoading(true);
        setValidationErrors({});

        try {
            const token = sessionStorage.getItem('token');
            const patientId = sessionStorage.getItem('patientId');
            const formData = new FormData();
            formData.append('patientProfileImage', fileInputRef.current.files[0]);
            formData.append('patientId', patientId);

            const response = await axios.post(
                'http://localhost:1313/api/mic/patient/patientChangeProfileImage',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data', 'token': token } }
            );

            if (response.status === 200) {
                alert(response.data.message);
                navigate('/patientViewProfile')
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
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <PatientNavbar />
            <div className="container py-5" style={{ paddingTop: '56px' }}>
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card transparent-card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)' }}>
                            <div className="card-body">
                                <form onSubmit={handleProfileImageUpload} encType="multipart/form-data">
                                    {currentImage && (
                                        <div className="mb-3">
                                            <img
                                                src={currentImage}
                                                alt="Current Profile"
                                                className="img-fluid img-preview"
                                                style={{ maxWidth: '500px', maxHeight: '300px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                                            />
                                        </div>
                                    )}
                                    <div className="mb-3">
                                        <label htmlFor="patientProfileImage" className="form-label">Choose New Profile Image:</label>
                                        <input
                                            type="file"
                                            className={`form-control ${validationErrors.patientProfileImage ? 'is-invalid' : ''}`}
                                            id="patientProfileImage"
                                            ref={fileInputRef}
                                        />
                                        {validationErrors.patientProfileImage && (
                                            <div className="invalid-feedback">{validationErrors.patientProfileImage}</div>
                                        )}
                                    </div>
                                    <div className="d-grid gap-2 mt-4">
                                        <button type="submit" className={`btn btn-lg btn-block btn-${Object.keys(validationErrors).length ? 'danger' : 'primary'}`} disabled={isLoading} style={{ width: '100%' }}>
                                            {isLoading ? 'Uploading Image...' : 'Upload'}
                                        </button>
                                    </div>
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

export default PatientChangeProfileImage;
