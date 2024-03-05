import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import hospitalImage from '../../images/Hospital/hl.jpg'; 
import insuranceProviderImage from '../../images/InsuranceProvider/insploginpurp.svg';
import hospitalStaffImage from '../../images/HospitalStaff/groupofstaffs.svg'; 
import patientImage from '../../images/Patient/ptmain.svg'; 
import Footer from '../Common/Footer';
import logoImage from '../../images/Home/logonobg.png'; // Add your logo image path here

const HomePage = () => {
    const [hoveredKey, setHoveredKey] = useState(null);

    const handleMouseEnter = (key) => {
        setHoveredKey(key);
    };

    const handleMouseLeave = () => {
        setHoveredKey(null);
    };

    const cardStyle = (key) => {
        let boxShadow = '';

        if (hoveredKey === key) {
            boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
        }

        return {
            transform: hoveredKey === key ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease, border-color 0.3s ease',
            boxShadow: boxShadow,
            borderWidth: '4px',
            borderStyle: 'solid',
            filter: hoveredKey && hoveredKey !== key ? 'blur(4px)' : 'none',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1rem',
            borderRadius: '15px',
        };
    };

    return (
        <div>
            <div className="container py-5">
                {/* First Row: Logo */}
                <div className="row mb-4">
    <div className="col-12 text-center d-flex justify-content-center align-items-center">
        <img src={logoImage} alt="Logo" style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain' }} />
    </div>
</div>

                {/* Second Row: Introduction Text */}
                <div className="row mb-4">
                    <div className="col-12 text-center">
                        <h2 className="fw-bold">Welcome to MedInsCare</h2>
                        <p className="lead">
                            Your premier solution for modern hospital management. Seamlessly integrating staff coordination, patient care, and insurance provider interactions, MedInsCare is your one-stop platform for optimizing hospital operations.
                        </p>
                    </div>
                </div>
                {/* Third Row: Cards */}
                <div className="row justify-content-center g-4">
                    {[
                        { link: "/hospitalLogin", image: hospitalImage, title: "Hospital Login", text: "Are you a hospital administrator?", key: "hospital" },
                        { link: "/insuranceProviderLogin", image: insuranceProviderImage, title: "Insurance Provider Login", text: "Are you an insurance provider?", key: "insurance" },
                        { link: "/hospitalStaffLogin", image: hospitalStaffImage, title: "Hospital Staff Login", text: "Are you a hospital staff member?", key: "staff" },
                        { link: "/patientLogin", image: patientImage, title: "Patient Login", text: "Are you a patient?", key: "patient" }
                    ].map((card, index) => (
                        <div className="col-12 col-md-6 col-lg-3 d-flex align-items-stretch" key={index}>
                            <Link to={card.link} className="text-decoration-none w-100">
                                <div className="card border-0 shadow h-100" 
                                    style={cardStyle(card.key)}
                                    onMouseEnter={() => handleMouseEnter(card.key)}
                                    onMouseLeave={handleMouseLeave}>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: '15px' }}>
                                        <img src={card.image} style={{
                                            maxHeight: '100%',
                                            maxWidth: '100%',
                                            objectFit: 'contain'
                                        }} className="card-img-top" alt={card.title} />
                                    </div>
                                    <div className="text-center" style={{ margin: '0.5rem', padding: '1rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', textAlign: 'center', fontWeight: 'bold', borderRadius: '10px', transition: 'background-color 0.3s ease' }}>
                                        <h5 className="card-title">{card.title}</h5>
                                        <p className="card-text">{card.text}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default HomePage;
