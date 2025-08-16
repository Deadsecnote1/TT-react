import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-section py-4 mt-auto">
      <div className="container">
        <div className="row">
          {/* Brand Column */}
          <div className="col-md-4 mb-3">
            <h5 className="footer-title">Teaching Torch</h5>
            <p className="footer-text">
              Free educational resources for Sri Lankan students from Grade 6 to Advanced Level.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" className="footer-link me-3" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://twitter.com" className="footer-link me-3" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="https://youtube.com" className="footer-link me-3" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-youtube"></i>
              </a>
              <a href="mailto:info@teachingtorch.lk" className="footer-link" aria-label="Email">
                <i className="bi bi-envelope"></i>
              </a>
            </div>
          </div>

          {/* Grades 6-11 Column */}
          <div className="col-md-2 mb-3">
            <h6 className="footer-heading">Grades 6-11</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/grade/grade6" className="footer-nav-link">
                  Grade 6
                </Link>
              </li>
              <li>
                <Link to="/grade/grade7" className="footer-nav-link">
                  Grade 7
                </Link>
              </li>
              <li>
                <Link to="/grade/grade8" className="footer-nav-link">
                  Grade 8
                </Link>
              </li>
              <li>
                <Link to="/grade/grade9" className="footer-nav-link">
                  Grade 9
                </Link>
              </li>
              <li>
                <Link to="/grade/grade10" className="footer-nav-link">
                  Grade 10
                </Link>
              </li>
              <li>
                <Link to="/grade/grade11" className="footer-nav-link">
                  Grade 11
                </Link>
              </li>
            </ul>
          </div>

          {/* Advanced Level Column */}
          <div className="col-md-2 mb-3">
            <h6 className="footer-heading">Advanced Level</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/grade/al" className="footer-nav-link">
                  Mathematics
                </Link>
              </li>
              <li>
                <Link to="/grade/al" className="footer-nav-link">
                  Science
                </Link>
              </li>
              <li>
                <Link to="/grade/al" className="footer-nav-link">
                  Commerce
                </Link>
              </li>
              <li>
                <Link to="/grade/al" className="footer-nav-link">
                  Arts
                </Link>
              </li>
              <li>
                <Link to="/grade/al" className="footer-nav-link">
                  Technology
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="col-md-2 mb-3">
            <h6 className="footer-heading">Resources</h6>
            <ul className="list-unstyled">
              <li>
                <span className="footer-nav-link">Textbooks</span>
              </li>
              <li>
                <span className="footer-nav-link">Past Papers</span>
              </li>
              <li>
                <span className="footer-nav-link">Short Notes</span>
              </li>
              <li>
                <span className="footer-nav-link">Video Lessons</span>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="col-md-2 mb-3">
            <h6 className="footer-heading">Support</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/about" className="footer-nav-link">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-nav-link">
                  Contact
                </Link>
              </li>
              <li>
                <a href="mailto:help@teachingtorch.lk" className="footer-nav-link">
                  Help
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="footer-divider my-4" />

        {/* Bottom Row */}
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="footer-copyright mb-0">&copy; 2025 Teaching Torch. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <small className="footer-made-with">
              Made with ❤️ for Sri Lankan Education 🇱🇰
            </small>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-section {
          background-color: var(--bg-tertiary) !important;
          color: var(--text-primary) !important;
          border-top: 1px solid var(--border-color);
          margin-top: auto;
        }

        .footer-title,
        .footer-heading {
          color: var(--text-primary) !important;
          font-weight: 600;
        }

        .footer-text,
        .footer-copyright {
          color: var(--text-secondary) !important;
        }

        .footer-nav-link,
        .footer-link {
          color: var(--text-secondary) !important;
          text-decoration: none;
          transition: color 0.3s ease;
          cursor: pointer;
        }

        .footer-nav-link:hover,
        .footer-link:hover {
          color: var(--primary) !important;
          text-decoration: none;
        }

        .footer-made-with {
          color: var(--text-muted) !important;
        }

        .footer-divider {
          border-color: var(--border-color) !important;
        }

        .social-links a {
          font-size: 1.2rem;
          transition: color 0.3s ease, transform 0.2s ease;
        }

        .social-links a:hover {
          color: var(--primary) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </footer>
  );
};

export default Footer;