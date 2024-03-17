import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../Common/Footer';
import HospitalNavbar from './HospitalNavbar';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/dashboard', 
                    { hospitalId }, 
                    { headers: { token } }
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
        return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    if (error) {
        return <div className="alert alert-danger text-center" role="alert">
            Error: {error}
        </div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <HospitalNavbar />

            <div className="container py-5 my-5" style={{ flexGrow: 1 }}>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {dashboardData && Object.entries(dashboardData).map(([key, value]) => (
                        <div key={key} className="col">
                            <div className="card h-100 border-0 shadow" style={{ borderRadius: '0.5rem' }}>
                                <div className="card-body">
                                    <h5 className="card-title text-center">{key.replace(/([A-Z])/g, ' $1').trim()}</h5>
                                    <p className="card-text display-6 text-center">{value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Dashboard;
