import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faYoutube, faFacebook, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { faCopy, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="text-center text-lg-start bg-light text-muted">
      {/* Social media links */}
      <section className="p-4 border-bottom">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="d-flex flex-column flex-lg-row justify-content-center mb-4 mb-lg-0">
                <span className="mb-2 mb-lg-0 me-lg-5">Connect with us on social media:</span>
                <a href="https://www.instagram.com" className="me-4 text-reset" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faInstagram} style={{ color: '#E1306C' }} /> Instagram
                </a>
                <a href="https://www.youtube.com" className="me-4 text-reset" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faYoutube} style={{ color: '#FF0000' }} /> YouTube
                </a>
                <a href="https://www.facebook.com" className="me-4 text-reset" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faFacebook} style={{ color: '#3b5998' }} /> Facebook
                </a>
                <a href="https://t.me" className="me-4 text-reset" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faTelegram} style={{ color: '#0088cc' }} /> Telegram
                </a>
                <a href="mailto:yourgmail@gmail.com" className="me-4 text-reset" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faEnvelope} style={{ color: '#d14836' }} /> Gmail
                </a>
                <span className="text-reset" style={{ color: '#000' }}>
                  <FontAwesomeIcon icon={faPhone} /> 123456787
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us link */}
      <section>
        <div className="container text-center text-md-start mt-5">
          <div className="row mt-3">
            <div className="col-12 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                About Us
              </h6>
              <p>
                <Link to="/aboutus" className="text-reset">Learn more about our mission and services</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Copyright notice */}
      <div className="text-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        <p className="mb-0">
          <FontAwesomeIcon icon={faCopy} /> {new Date().getFullYear()} Liboski. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
