import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { selectedLanguage, setLanguage, getAvailableLanguages, getCurrentLanguage } = useLanguage();
  const location = useLocation();
  const languages = getAvailableLanguages();

  // Check if link is active
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img 
            src="/assets/images/T.png" 
            alt="Teaching Torch" 
            width="40" 
            height="40" 
            className="me-2"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span className="brand-text">Teaching Torch</span>
        </Link>

        {/* Mobile Toggle */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Main Navigation */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                to="/"
              >
                <i className="bi bi-house-fill me-1"></i>Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                to="/about"
              >
                <i className="bi bi-info-circle-fill me-1"></i>About
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
                to="/contact"
              >
                <i className="bi bi-envelope-fill me-1"></i>Contact
              </Link>
            </li>

            {/* Grades Dropdown */}
            <li className="nav-item dropdown">
              <button 
                className="nav-link dropdown-toggle btn btn-link border-0" 
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                <i className="bi bi-book-fill me-1"></i>Grades
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/grade/grade6">
                    Grade 6
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/grade/grade7">
                    Grade 7
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/grade/grade8">
                    Grade 8
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/grade/grade9">
                    Grade 9
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/grade/grade10">
                    Grade 10
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/grade/grade11">
                    Grade 11
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item" to="/grade/al">
                    <i className="bi bi-mortarboard-fill me-1"></i>Advanced Level
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          {/* Right Side Controls */}
          <ul className="navbar-nav">
            {/* Language Filter Dropdown */}
            <li className="nav-item dropdown">
              <button 
                className="nav-link dropdown-toggle btn btn-link border-0" 
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                id="languageToggle"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                <i className="bi bi-translate me-1"></i>
                <span id="currentLanguage">
                  {getCurrentLanguage().display}
                </span>
              </button>
              <ul className="dropdown-menu">
                {Object.entries(languages).map(([langKey, langConfig]) => (
                  <li key={langKey}>
                    <button
                      className={`dropdown-item language-option ${selectedLanguage === langKey ? 'active' : ''}`}
                      onClick={() => setLanguage(langKey)}
                    >
                      <i className={`${langConfig.icon} me-2`} 
                         style={{ color: langConfig.color }}></i>
                      {langConfig.display}
                    </button>
                  </li>
                ))}
              </ul>
            </li>

            {/* Theme Toggle */}
            <li className="nav-item">
              <button 
                className="nav-link btn btn-link" 
                id="themeToggle" 
                title="Toggle Dark Mode"
                onClick={toggleTheme}
              >
                <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-fill'}`} 
                   id="themeIcon"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;