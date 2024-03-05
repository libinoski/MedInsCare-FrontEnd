import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';

const HospitalChangeImage = () => {
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
                        setValidationErrors(data.results || {});
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
<div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f0f2f7' }}>
    {/* Navbar */}
    <Navbar />

    {/* Main content */}
    <div className="container-fluid flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
            <div className="container py-5 d-flex justify-content-center">
                <div className="card shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                    <div className="card-body">
                        <form onSubmit={handleImageUpload} encType="multipart/form-data">
                            <div className="mb-4 d-flex justify-content-center align-items-center">
                                {currentImage && (
                                    <img src={currentImage} alt="Current" className="img-thumbnail" style={{ width: '200px', height: '200px', borderRadius: '10px', objectFit: 'cover' }} />
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="hospitalImage" className="form-label">Choose New Image:</label>
                                <input
                                    type="file"
                                    className={`form-control ${validationErrors.hospitalImage ? 'is-invalid' : ''}`}
                                    id="hospitalImage"
                                    ref={fileInputRef}
                                    style={{ borderRadius: '5px' }}
                                />
                                {validationErrors.hospitalImage && (
                                    <div className="invalid-feedback">{validationErrors.hospitalImage}</div>
                                )}
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                    {isLoading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {/* Footer */}
    <Footer />
</div>


    );
};

export default HospitalChangeImage;
