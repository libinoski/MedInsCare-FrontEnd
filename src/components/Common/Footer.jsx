import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faUsers, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faYoutube, faFacebook, faTelegram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="py-5" style={{ background: 'linear-gradient(135deg, #2C3E50 10%, #1B2631 100%)', borderTop: '5px solid #BDC3C7' }}>
      <div className="container">
        <div className="row">
          {/* Social media links */}
          <div className="col-lg-6 mb-4 mb-lg-0 d-flex flex-column flex-lg-row align-items-center justify-content-center justify-content-lg-start">
            <p className="me-3 mb-3 mb-lg-0 fs-5 text-light fw-bold"><FontAwesomeIcon icon={faUsers} className="me-2" />Connect with us:</p>
            <div className="d-flex">
              <Link to="/instagram" className="text-reset text-decoration-none me-3">
                <FontAwesomeIcon icon={faInstagram} size="2x" style={{ color: '#E4405F' }} />
              </Link>
              <Link to="/youtube" className="text-reset text-decoration-none me-3">
                <FontAwesomeIcon icon={faYoutube} size="2x" style={{ color: '#FF0000' }} />
              </Link>
              <Link to="/facebook" className="text-reset text-decoration-none me-3">
                <FontAwesomeIcon icon={faFacebook} size="2x" style={{ color: '#3B5998' }} />
              </Link>
              <Link to="/telegram" className="text-reset text-decoration-none me-3">
                <FontAwesomeIcon icon={faTelegram} size="2x" style={{ color: '#0088cc' }} />
              </Link>
              <Link to="mailto:yourgmail@gmail.com" className="text-reset text-decoration-none">
                <FontAwesomeIcon icon={faEnvelope} size="2x" style={{ color: '#EA4335' }} />
              </Link>
              <span className="text-reset ms-3">
                <FontAwesomeIcon icon={faPhone} size="2x" style={{ color: '#6CC24A' }} />
              </span>
            </div>
          </div>

          {/* About Us link */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center justify-content-lg-end">
            <h5 className="mb-0 text-light fw-bold"><FontAwesomeIcon icon={faInfoCircle} className="me-2" />About Us</h5>
          </div>
        </div>
      </div>

      {/* Copyright notice */}
      <div className="container-fluid text-center mt-4">
        <p className="mb-0 fs-6" style={{ color: '#6c757d' }}>
          &copy; {new Date().getFullYear()} Liboski. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
