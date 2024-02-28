import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import backgroundImage from '../../images/Hospital/bg1.jpg'; // Import the background image
import HospitalStaffNavbar from './HospitalStaffNavbar';

const HospitalStaffUpdateIdProofImage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [currentImage, setCurrentImage] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchCurrentImage = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const hospitalStaffId = sessionStorage.getItem('hospitalStaffId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospitalStaff/hospitalStaffViewProfile',
                    { hospitalStaffId },
                    { headers: { token } }
                );
                if (response.status === 200) {
                    setCurrentImage(response.data.data.hospitalStaffIdProofImage);
                }
            } catch (error) {
                console.error('Error fetching current image:', error);
            }
        };

        fetchCurrentImage();
    }, []);

    const handleIdProofImageUpload = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setIsLoading(true);
        setValidationErrors({});

        try {
            const token = sessionStorage.getItem('token');
            const hospitalStaffId = sessionStorage.getItem('hospitalStaffId');
            const formData = new FormData();
            formData.append('hospitalStaffIdProofImage', fileInputRef.current.files[0]);
            formData.append('hospitalStaffId', hospitalStaffId);

            const response = await axios.post(
                'http://localhost:1313/api/mic/hospitalStaff/hospitalStaffChangeIdProofImage',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data', 'token': token } }
            );

            if (response.status === 200) {
                alert(response.data.message);
                navigate('/hospitalStaffViewProfile')
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
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    paddingTop: '56px',
                    position: 'relative',
                }}
            >
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card transparent-card">
                                <div className="card-body">
                                    <form onSubmit={handleIdProofImageUpload} encType="multipart/form-data">
                                        {currentImage && (
                                            <div className="mb-3">
                                                <img
                                                    src={currentImage}
                                                    alt="Current ID Proof"
                                                    className="img-fluid img-preview"
                                                />
                                            </div>
                                        )}
                                        <div className="mb-3">
                                            <label htmlFor="hospitalStaffIdProofImage" className="form-label">Choose New ID Proof Image:</label>
                                            <input
                                                type="file"
                                                className={`form-control ${validationErrors.hospitalStaffIdProofImage ? 'is-invalid' : ''}`}
                                                id="hospitalStaffIdProofImage"
                                                ref={fileInputRef}
                                            />
                                            {validationErrors.hospitalStaffIdProofImage && (
                                                <div className="invalid-feedback">{validationErrors.hospitalStaffIdProofImage}</div>
                                            )}
                                        </div>
                                        <div className="d-grid mt-4">
                                            <button type="submit" className={`btn btn-${Object.keys(validationErrors).length ? 'danger' : 'success'}`} disabled={isLoading} style={{width: '100px'}}>
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

export default HospitalStaffUpdateIdProofImage;
