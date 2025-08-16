import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row">
          {/* Brand Column */}
          <div className="col-md-4 mb-3">
            <h5>Teaching Torch</h5>
            <p className="text-muted">
              Free educational resources for Sri Lankan students from Grade 6 to Advanced Level.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" className="text-light me-3" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://twitter.com" className="text-light me-3" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="https://youtube.com" className="text-light me-3" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-youtube"></i>
              </a>
              <a href="mailto:info@teachingtorch.lk" className="text-light" aria-label="Email">
                <i className="bi bi-envelope"></i>
              </a>
            </div>
          </div>

          {/* Grades 6-11 Column */}
          <div className="col-md-2 mb-3">
            <h6 className="text-light">Grades 6-11</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/grade/grade6" className="text-light-emphasis">
                  Grade 6
                </Link>
              </li>
              <li>
                <Link to="/grade/grade7" className="text-light-emphasis">
                  Grade 7
                </Link>
              </li>
              <li>
                <Link to="/grade/grade8" className="text-light-emphasis">
                  Grade 8
                </Link>
              </li>
              <li>
                <Link to="/grade/grade9" className="text-light-emphasis">
                  Grade 9
                </Link>
              </li>
              <li>
                <Link to="/grade/grade10" className="text-light-emphasis">
                  Grade 10
                </Link>
              </li>
              <li>
                <Link to="/grade/grade11" className="text-light-emphasis">
                  Grade 11
                </Link>
              </li>
            </ul>
          </div>

          {/* Advanced Level Column */}
          <div className="col-md-2 mb-3">
            <h6 className="text-light">Advanced Level</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/grade/al" className="text-light-emphasis">
                  A/L Resources
                </Link>
              </li>
              <li>
                <Link to="/grade/al" className="text-light-emphasis">
                  Mathematics
                </Link>
              </li>
              <li>
                <Link to="/grade/al" className="text-light-emphasis">
                  Science
                </Link>
              </li>
              <li>
                <Link to="/grade/al" className="text-light-emphasis">
                  Commerce
                </Link>
              </li>
              <li>
                <Link to="/grade/al" className="text-light-emphasis">
                  Arts
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="col-md-2 mb-3">
            <h6 className="text-light">Resources</h6>
            <ul className="list-unstyled">
              <li>
                <span className="text-light-emphasis">Textbooks</span>
              </li>
              <li>
                <span className="text-light-emphasis">Past Papers</span>
              </li>
              <li>
                <span className="text-light-emphasis">Short Notes</span>
              </li>
              <li>
                <span className="text-light-emphasis">Video Lessons</span>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="col-md-2 mb-3">
            <h6 className="text-light">Support</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/about" className="text-light-emphasis">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-light-emphasis">
                  Contact
                </Link>
              </li>
              <li>
                <a href="mailto:help@teachingtorch.lk" className="text-light-emphasis">
                  Help
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4" />

        {/* Bottom Row */}
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0">&copy; 2025 Teaching Torch. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <small className="text-muted">
              Made with ❤️ for Sri Lankan Education 🇱🇰
            </small>
          </div>
        </div>
      </div>

      <style jsx>{`
        .text-light-emphasis {
          color: rgba(255, 255, 255, 0.75) !important;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .text-light-emphasis:hover {
          color: rgba(255, 255, 255, 1) !important;
          text-decoration: underline;
        }

        .social-links a {
          transition: color 0.3s ease;
        }

        .social-links a:hover {
          color: var(--primary) !important;
        }
      `}</style>
    </footer>
  );
};

export default Footer;