import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = sessionStorage.getItem('token'); // Assuming you store the token in sessionStorage
                const hospitalId = sessionStorage.getItem('hospitalId'); // Assuming you store the hospitalId in sessionStorage
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/dashboard',
                    { hospitalId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                setDashboardData(response.data.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    if (error) {
        return <div className="alert alert-danger" role="alert">
            Error: {error}
        </div>;
    }

    return (
<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />

            <div className="container py-5 my-5" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {dashboardData && (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center align-items-center">
                        <div className="col">
                            <div className="card h-100 text-white rounded-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #FF96F9 0%, #C32BAC 100%)' }}>
                                <div className="card-body text-center">
                                    <h5 className="card-title">Staff Count</h5>
                                    <p className="card-text">{dashboardData.staffCount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card h-100 text-white rounded-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #FF96F9 0%, #C32BAC 100%)' }}>
                                <div className="card-body text-center">
                                    <h5 className="card-title">Patient Count</h5>
                                    <p className="card-text">{dashboardData.patientCount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card h-100 text-white rounded-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #FF96F9 0%, #C32BAC 100%)' }}>
                                <div className="card-body text-center">
                                    <h5 className="card-title">Insurance Provider Count</h5>
                                    <p className="card-text">{dashboardData.insuranceProviderCount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card h-100 text-white rounded-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #FF96F9 0%, #C32BAC 100%)' }}>
                                <div className="card-body text-center">
                                    <h5 className="card-title">Medical Record Count</h5>
                                    <p className="card-text">{dashboardData.medicalRecordCount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card h-100 text-white rounded-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #FF96F9 0%, #C32BAC 100%)' }}>
                                <div className="card-body text-center">
                                    <h5 className="card-title">Review Count</h5>
                                    <p className="card-text">{dashboardData.reviewCount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card h-100 text-white rounded-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #FF96F9 0%, #C32BAC 100%)' }}>
                                <div className="card-body text-center">
                                    <h5 className="card-title">Pending Discharge Request Count</h5>
                                    <p className="card-text">{dashboardData.pendingDischargeRequestCount}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />

        </div>

    );
}









  

export default Dashboard;
