import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faUsers } from '@fortawesome/free-solid-svg-icons'; // Import faUsers icon
import { faInstagram, faYoutube, faFacebook, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="py-5" style={{ background: 'linear-gradient(45deg, rgba(142, 68, 173, 0.8), rgba(192, 57, 43, 0.8))', border: '2px solid #9400D3' }}>
      <div className="container">
        <div className="row">
          {/* Social media links */}
          <div className="col-lg-6 mb-4 mb-lg-0 d-flex align-items-center justify-content-center justify-content-lg-start">
            {/* Connect with us */}
            <p className="me-3 mb-0 fs-5 text-white fw-bold"><FontAwesomeIcon icon={faUsers} className="me-2" />Connect with us:</p>
            <div className="me-4">
              <Link to="https://www.instagram.com" className="text-reset text-decoration-none">
                <FontAwesomeIcon icon={faInstagram} size="3x" style={{ color: '#E4405F' }} />
              </Link>
            </div>
            <div className="me-4">
              <Link to="https://www.youtube.com" className="text-reset text-decoration-none">
                <FontAwesomeIcon icon={faYoutube} size="3x" style={{ color: '#FF0000' }} />
              </Link>
            </div>
            <div className="me-4">
              <Link to="https://www.facebook.com" className="text-reset text-decoration-none">
                <FontAwesomeIcon icon={faFacebook} size="3x" style={{ color: '#3B5998' }} />
              </Link>
            </div>
            <div className="me-4">
              <Link to="https://t.me" className="text-reset text-decoration-none">
                <FontAwesomeIcon icon={faTelegram} size="3x" style={{ color: '#0088cc' }} />
              </Link>
            </div>
            <div className="me-4">
              <Link to="mailto:yourgmail@gmail.com" className="text-reset text-decoration-none">
                <FontAwesomeIcon icon={faEnvelope} size="3x" style={{ color: '#EA4335' }} />
              </Link>
            </div>
            <div>
              <span className="text-reset">
                <FontAwesomeIcon icon={faPhone} size="3x" style={{ color: '#6CC24A' }} />
              </span>
            </div>
          </div>

          {/* About Us link */}
          <div className="col-lg-6 text-center text-lg-end">
            <h5 className="mb-3 text-white fw-bold"><FontAwesomeIcon icon={faInfoCircle} /> About Us</h5>
            {/* Remove the paragraph with the link */}
          </div>
        </div>
      </div>

      {/* Copyright notice */}
      <div className="container-fluid text-center mt-4">
        <p className="mb-0 fs-6 fw-bold" style={{ color: '#000000' }}>
          &copy; {new Date().getFullYear()} Liboski. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
