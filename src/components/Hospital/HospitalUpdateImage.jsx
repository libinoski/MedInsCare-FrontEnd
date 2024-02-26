// HospitalUpdateImage.js

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import '../../css/Hospital/HospitalUpdateImage.css';
import Footer from '../Common/Footer';

const HospitalUpdateImage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [currentImage, setCurrentImage] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchCurrentImage = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/hospitalViewProfile',
                    { hospitalId },
                    { headers: { token } }
                );
                if (response.status === 200) {
                    setCurrentImage(response.data.data.hospitalImage);
                }
            } catch (error) {
                console.error('Error fetching current image:', error);
            }
        };

        fetchCurrentImage();
    }, []);

    const handleImageUpload = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setIsLoading(true);
        setValidationErrors({});

        try {
            const token = sessionStorage.getItem('token');
            const hospitalId = sessionStorage.getItem('hospitalId');
            const formData = new FormData();
            formData.append('hospitalImage', fileInputRef.current.files[0]);
            formData.append('hospitalId', hospitalId);

            const response = await axios.post(
                'http://localhost:1313/api/mic/hospital/hospitalChangeImage',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data', 'token': token } }
            );

            if (response.status === 200) {
                alert(response.data.message);
                navigate('/hospitalViewProfile');
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        setValidationErrors({ file: data.results });
                        break;
                    case 401:
                    case 403:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        navigate('/hospitalLogin');
                        break;
                    case 422:
                        alert(data.error || 'An error occurred during image update.');
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
        <div>
            <Navbar />
            <div className="hospital-update-image-container">
                <div className="hospital-update-image-content">
                    <div className="card hospital-update-image-card transparent-card">
                        <h2 className="card-header">Revamp Your Look: Refresh Your Profile Picture!</h2>
                        <div className="card-body">
                            <form onSubmit={handleImageUpload} encType="multipart/form-data">
                                <div className="mb-3 img-preview-container">
                                    {currentImage && (
                                        <img
                                            src={currentImage}
                                            alt="Current Hospital"
                                            className="img-fluid img-preview mb-3"
                                        />
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="hospitalImage" className="form-label">Choose New Image:</label>
                                    <input
                                        type="file"
                                        className={`form-control ${validationErrors.file ? 'is-invalid' : ''}`}
                                        id="hospitalImage"
                                        ref={fileInputRef}
                                    />
                                    {validationErrors.file && (
                                        <div className="invalid-feedback">{validationErrors.file}</div>
                                    )}
                                </div>
                                <div className="d-grid mt-4">
                                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                        {isLoading ? 'Uploading Image...' : 'Upload'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default HospitalUpdateImage;
