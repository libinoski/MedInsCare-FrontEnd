import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import PatientNavbar from './PatientNavbar';

const PatientChangeIdProofImage = () => {
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
                    setCurrentImage(response.data.data.patientIdProofImage);
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
            const patientId = sessionStorage.getItem('patientId');
            const formData = new FormData();
            formData.append('patientIdProofImage', fileInputRef.current.files[0]);
            formData.append('patientId', patientId);

            const response = await axios.post(
                'http://localhost:1313/api/mic/patient/patientChangeIdProofImage',
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
    <div className="container py-5">
        <div className="row justify-content-center">
            <div className="col-md-8">
                <div className="card" style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                    <div className="card-body">
                        <form onSubmit={handleIdProofImageUpload} encType="multipart/form-data">
                            {currentImage && (
                                <div className="mb-3 text-center">
                                    <img
                                        src={currentImage}
                                        alt="Current Id Proof"
                                        className="img-fluid img-preview"
                                        style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '5px' }}
                                    />
                                </div>
                            )}
                            <div className="mb-3">
                                <label htmlFor="patientIdProofImage" className="form-label">Choose New ID Proof Image:</label>
                                <input
                                    type="file"
                                    className={`form-control ${validationErrors.patientIdProofImage ? 'is-invalid' : ''}`}
                                    id="patientIdProofImage"
                                    ref={fileInputRef}
                                />
                                {validationErrors.patientIdProofImage && (
                                    <div className="invalid-feedback">{validationErrors.patientIdProofImage}</div>
                                )}
                            </div>
                            <div className="text-center d-flex justify-content-center align-items-center">
                                <button 
                                    type="submit" 
                                    className={`btn ${isLoading ? 'btn-secondary' : 'btn-outline-secondary text-dark'} d-flex justify-content-center align-items-center`}
                                    disabled={isLoading}
                                    style={{
                                        border: '2px solid #6c757d',
                                        color: '#6c757d',
                                        fontWeight: 'bold',
                                        boxShadow: '0px 4px 8px rgba(108, 117, 125, 0.6)',
                                        padding: '10px 20px',
                                        borderRadius: '25px',
                                        width: '100%',
                                        maxWidth: '200px',
                                        textDecoration: 'none',
                                        transition: 'background-color .3s'
                                    }}
                                >
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

export default PatientChangeIdProofImage;
