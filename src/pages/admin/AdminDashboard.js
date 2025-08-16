import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { getStats, exportData } = useData();
  const stats = getStats();

  // Check if admin is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/');
  };

  const handleAddResource = () => {
    alert('Add New Resource feature will be implemented in the next update!\n\nFor now, you can:\n• Export current data\n• View website statistics\n• Monitor usage');
  };

  return (
    <div className="admin-dashboard">
      {/* Admin Header */}
      <header className="page-header">
        <div className="container text-center">
          <div className="d-flex justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <h1 className="display-4 fw-bold">Admin Dashboard</h1>
              <p className="lead">Teaching Torch Administration Panel</p>
            </div>
            <button onClick={handleLogout} className="btn btn-outline-light">
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <section className="py-5">
        <div className="container">
          {/* Statistics Cards */}
          <div className="row g-4 mb-5">
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <i className="bi bi-book text-primary" style={{ fontSize: '3rem' }}></i>
                  <h3 className="mt-3">{stats.totalGrades}</h3>
                  <p className="text-muted">Grade Levels</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <i className="bi bi-journal text-success" style={{ fontSize: '3rem' }}></i>
                  <h3 className="mt-3">{stats.totalSubjects}</h3>
                  <p className="text-muted">Subjects</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <i className="bi bi-files text-info" style={{ fontSize: '3rem' }}></i>
                  <h3 className="mt-3">{stats.totalResources}</h3>
                  <p className="text-muted">Resources</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <i className="bi bi-play-circle text-danger" style={{ fontSize: '3rem' }}></i>
                  <h3 className="mt-3">{stats.totalVideos}</h3>
                  <p className="text-muted">Videos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Language Breakdown */}
          <div className="row mb-5">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5>Resources by Language</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>🇱🇰 Sinhala</span>
                      <span>{stats.languageBreakdown.sinhala}</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>🇱🇰 Tamil</span>
                      <span>{stats.languageBreakdown.tamil}</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>🇬🇧 English</span>
                      <span>{stats.languageBreakdown.english}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5>Quick Actions</h5>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <button 
                      onClick={exportData}
                      className="btn btn-primary"
                    >
                      <i className="bi bi-download me-2"></i>
                      Export All Data
                    </button>
                    <Link to="/" className="btn btn-secondary">
                      <i className="bi bi-house me-2"></i>
                      View Website
                    </Link>
                    <button 
                      className="btn btn-warning"
                      onClick={handleAddResource}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Add New Resource
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="alert alert-info">
            <h5><i className="bi bi-info-circle me-2"></i>Admin Panel</h5>
            <p className="mb-0">
              This is a basic admin dashboard. You can view statistics, export data, and manage the Teaching Torch platform.
              More features like file upload and content management can be added in future updates.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;