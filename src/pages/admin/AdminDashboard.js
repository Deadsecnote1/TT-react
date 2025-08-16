import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { getStats, exportData } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGrade, setSelectedGrade] = useState('grade6');
  const [selectedSubject, setSelectedSubject] = useState('mathematics');
  const [selectedResourceType, setSelectedResourceType] = useState('textbook');
  const [selectedLanguages, setSelectedLanguages] = useState(['english']);
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [recentUploads, setRecentUploads] = useState([]);
  
  const stats = getStats();

  // Load uploaded files from localStorage on component mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('teachingTorch_uploadedFiles');
    if (savedFiles) {
      setUploadedFiles(JSON.parse(savedFiles));
    }
    
    const savedRecent = localStorage.getItem('teachingTorch_recentUploads');
    if (savedRecent) {
      setRecentUploads(JSON.parse(savedRecent));
    }
  }, []);

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

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setFileList(files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setFileList(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleLanguageToggle = (language) => {
    setSelectedLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(lang => lang !== language)
        : [...prev, language]
    );
  };

  const saveToLocalStorage = (files) => {
    const currentFiles = JSON.parse(localStorage.getItem('teachingTorch_uploadedFiles') || '[]');
    const updatedFiles = [...currentFiles, ...files];
    localStorage.setItem('teachingTorch_uploadedFiles', JSON.stringify(updatedFiles));
    setUploadedFiles(updatedFiles);

    // Update recent uploads (keep last 10)
    const recentFiles = files.slice(0, 10);
    const currentRecent = JSON.parse(localStorage.getItem('teachingTorch_recentUploads') || '[]');
    const updatedRecent = [...recentFiles, ...currentRecent].slice(0, 10);
    localStorage.setItem('teachingTorch_recentUploads', JSON.stringify(updatedRecent));
    setRecentUploads(updatedRecent);
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      alert('Please select files to upload');
      return;
    }

    if (selectedLanguages.length === 0) {
      alert('Please select at least one language');
      return;
    }

    // Reset progress
    setUploadProgress(0);

    // Process files
    const processedFiles = fileList.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      grade: selectedGrade,
      subject: selectedSubject,
      resourceType: selectedResourceType,
      languages: selectedLanguages,
      uploadDate: new Date().toISOString(),
      id: Date.now() + Math.random()
    }));

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Save to localStorage
          saveToLocalStorage(processedFiles);
          
          // Success notification
          alert(`✅ Successfully uploaded ${fileList.length} file(s)!\n\n` +
                `Grade: ${selectedGrade}\n` +
                `Subject: ${selectedSubject}\n` +
                `Type: ${selectedResourceType}\n` +
                `Languages: ${selectedLanguages.join(', ')}`);
          
          // Reset form
          setFileList([]);
          setUploadProgress(0);
          document.getElementById('fileInput').value = '';
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDeleteSelected = () => {
    if (window.confirm('Are you sure you want to delete all uploaded files? This action cannot be undone.')) {
      localStorage.removeItem('teachingTorch_uploadedFiles');
      localStorage.removeItem('teachingTorch_recentUploads');
      setUploadedFiles([]);
      setRecentUploads([]);
      alert('✅ All files deleted successfully!');
    }
  };

  const handleRefresh = () => {
    // Reload from localStorage
    const savedFiles = localStorage.getItem('teachingTorch_uploadedFiles');
    if (savedFiles) {
      setUploadedFiles(JSON.parse(savedFiles));
    }
    
    const savedRecent = localStorage.getItem('teachingTorch_recentUploads');
    if (savedRecent) {
      setRecentUploads(JSON.parse(savedRecent));
    }
    
    alert('📁 File manager refreshed!');
  };

  // Group uploaded files by grade/subject/type
  const getFileGroups = () => {
    const groups = {};
    uploadedFiles.forEach(file => {
      const key = `${file.grade}/${file.subject}/${file.resourceType}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(file);
    });
    return groups;
  };

  const fileGroups = getFileGroups();

  return (
    <div className="admin-dashboard">
      {/* Admin Header */}
      <header className="page-header">
        <div className="container">
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

      {/* Navigation Tabs */}
      <section className="py-3 bg-light">
        <div className="container">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="bi bi-speedometer2 me-2"></i>
                Overview
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'resources' ? 'active' : ''}`}
                onClick={() => setActiveTab('resources')}
              >
                <i className="bi bi-folder me-2"></i>
                Manage Resources
              </button>
            </li>
          </ul>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-5">
        <div className="container">
          {activeTab === 'overview' && (
            <>
              {/* Statistics Cards */}
              <div className="row g-4 mb-5">
                <div className="col-md-3">
                  <div className="card text-center h-100">
                    <div className="card-body">
                      <i className="bi bi-book text-primary" style={{ fontSize: '3rem' }}></i>
                      <h3 className="mt-3">{stats.totalGrades}</h3>
                      <p className="text-muted">Grade Levels</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card text-center h-100">
                    <div className="card-body">
                      <i className="bi bi-translate text-success" style={{ fontSize: '3rem' }}></i>
                      <h3 className="mt-3">{stats.totalLanguages}</h3>
                      <p className="text-muted">Languages</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card text-center h-100">
                    <div className="card-body">
                      <i className="bi bi-file-earmark text-info" style={{ fontSize: '3rem' }}></i>
                      <h3 className="mt-3">{uploadedFiles.length}</h3>
                      <p className="text-muted">Uploaded Files</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card text-center h-100">
                    <div className="card-body">
                      <i className="bi bi-clock text-warning" style={{ fontSize: '3rem' }}></i>
                      <h3 className="mt-3">24/7</h3>
                      <p className="text-muted">Access</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card h-100">
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
                          className="btn btn-success"
                          onClick={() => setActiveTab('resources')}
                        >
                          <i className="bi bi-folder-plus me-2"></i>
                          Manage Resources ({uploadedFiles.length} files)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-header">
                      <h5>Upload Summary</h5>
                    </div>
                    <div className="card-body">
                      {uploadedFiles.length > 0 ? (
                        <div>
                          <p>Total files uploaded: <strong>{uploadedFiles.length}</strong></p>
                          <p>Storage locations: <strong>{Object.keys(fileGroups).length}</strong></p>
                          <p>Recent uploads: <strong>{recentUploads.length}</strong></p>
                        </div>
                      ) : (
                        <p className="text-muted">No files uploaded yet. Use the Manage Resources tab to upload files.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'resources' && (
            <div className="row g-4">
              {/* Upload Files Section */}
              <div className="col-md-8">
                <div className="card">
                  <div className="card-header">
                    <h5>
                      <i className="bi bi-cloud-upload me-2"></i>
                      Upload Files
                    </h5>
                  </div>
                  <div className="card-body">
                    {/* Selection Controls */}
                    <div className="row g-3 mb-4">
                      <div className="col-md-4">
                        <label className="form-label">Select Grade</label>
                        <select 
                          className="form-select"
                          value={selectedGrade}
                          onChange={(e) => setSelectedGrade(e.target.value)}
                        >
                          <option value="grade6">Grade 6</option>
                          <option value="grade7">Grade 7</option>
                          <option value="grade8">Grade 8</option>
                          <option value="grade9">Grade 9</option>
                          <option value="grade10">Grade 10</option>
                          <option value="grade11">Grade 11</option>
                          <option value="al">Advanced Level</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Select Subject</label>
                        <select 
                          className="form-select"
                          value={selectedSubject}
                          onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                          <option value="mathematics">Mathematics</option>
                          <option value="science">Science</option>
                          <option value="english">English</option>
                          <option value="history">History</option>
                          <option value="geography">Geography</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Resource Type</label>
                        <select 
                          className="form-select"
                          value={selectedResourceType}
                          onChange={(e) => setSelectedResourceType(e.target.value)}
                        >
                          <option value="textbook">Textbook</option>
                          <option value="notes">Notes</option>
                          <option value="papers">Past Papers</option>
                          <option value="videos">Videos</option>
                        </select>
                      </div>
                    </div>

                    {/* Language Selection */}
                    <div className="mb-4">
                      <label className="form-label">Select Language(s)</label>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className={`btn ${selectedLanguages.includes('sinhala') ? 'btn-danger' : 'btn-outline-danger'}`}
                          onClick={() => handleLanguageToggle('sinhala')}
                        >
                          සිංහල
                        </button>
                        <button
                          type="button"
                          className={`btn ${selectedLanguages.includes('tamil') ? 'btn-success' : 'btn-outline-success'}`}
                          onClick={() => handleLanguageToggle('tamil')}
                        >
                          தமிழ்
                        </button>
                        <button
                          type="button"
                          className={`btn ${selectedLanguages.includes('english') ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => handleLanguageToggle('english')}
                        >
                          English
                        </button>
                      </div>
                    </div>

                    {/* File Upload Area */}
                    <div 
                      className="upload-area p-4 border-2 border-dashed border-success rounded text-center"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <i className="bi bi-cloud-upload text-success" style={{ fontSize: '3rem' }}></i>
                      <h5 className="mt-3">Drop files here or click to browse</h5>
                      <p className="text-muted">Support PDF, DOC, DOCX, MP4, and image files</p>
                      <input 
                        type="file" 
                        multiple 
                        className="form-control d-none" 
                        id="fileInput"
                        onChange={handleFileSelect}
                        accept=".pdf,.doc,.docx,.mp4,.jpg,.jpeg,.png"
                      />
                      <label htmlFor="fileInput" className="btn btn-success">
                        <i className="bi bi-folder me-2"></i>
                        Choose Files
                      </label>
                    </div>

                    {/* Selected Files */}
                    {fileList.length > 0 && (
                      <div className="mt-3">
                        <h6>Selected Files ({fileList.length})</h6>
                        <ul className="list-group">
                          {fileList.map((file, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                              <span>
                                <i className="bi bi-file-earmark me-2"></i>
                                {file.name}
                              </span>
                              <small className="text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</small>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Upload Progress */}
                    {uploadProgress > 0 && (
                      <div className="mt-3">
                        <div className="progress">
                          <div 
                            className="progress-bar progress-bar-striped progress-bar-animated" 
                            style={{ width: `${uploadProgress}%` }}
                          >
                            {uploadProgress}%
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Upload Button */}
                    <div className="mt-3 d-flex gap-2">
                      <button 
                        className="btn btn-primary"
                        onClick={handleUpload}
                        disabled={fileList.length === 0 || uploadProgress > 0}
                      >
                        <i className="bi bi-upload me-2"></i>
                        Upload Files
                      </button>
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setFileList([]);
                          document.getElementById('fileInput').value = '';
                        }}
                        disabled={uploadProgress > 0}
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* File Manager Section */}
              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5>
                      <i className="bi bi-folder me-2"></i>
                      File Manager
                    </h5>
                    <button className="btn btn-outline-primary btn-sm" onClick={handleRefresh}>
                      <i className="bi bi-arrow-clockwise"></i>
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="file-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {Object.entries(fileGroups).length > 0 ? (
                        Object.entries(fileGroups).map(([path, files]) => (
                          <div key={path} className="d-flex justify-content-between align-items-center p-2 border-bottom">
                            <div>
                              <i className="bi bi-folder me-2 text-warning"></i>
                              <small>{path}</small>
                            </div>
                            <span className="badge bg-primary rounded-pill">{files.length}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted">
                          <i className="bi bi-folder-x" style={{ fontSize: '2rem' }}></i>
                          <p>No files uploaded yet</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 d-grid gap-2">
                      <button 
                        className="btn btn-outline-danger btn-sm" 
                        onClick={handleDeleteSelected}
                        disabled={uploadedFiles.length === 0}
                      >
                        <i className="bi bi-trash me-2"></i>
                        Delete All Files
                      </button>
                      <button className="btn btn-outline-info btn-sm" onClick={handleRefresh}>
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Refresh
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Uploads */}
                <div className="card mt-3">
                  <div className="card-header">
                    <h6>
                      <i className="bi bi-clock-history me-2"></i>
                      Recent Uploads ({recentUploads.length})
                    </h6>
                  </div>
                  <div className="card-body">
                    {recentUploads.length > 0 ? (
                      <div className="recent-uploads">
                        {recentUploads.slice(0, 5).map((file, index) => (
                          <div key={index} className="d-flex align-items-center mb-2 p-2 bg-light rounded">
                            <i className="bi bi-file-earmark me-2 text-primary"></i>
                            <div className="flex-grow-1">
                              <small className="d-block text-truncate" style={{ maxWidth: '150px' }}>
                                {file.name}
                              </small>
                              <small className="text-muted">
                                {new Date(file.uploadDate).toLocaleDateString()}
                              </small>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted text-center">No recent uploads</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="alert alert-info mt-4">
            <h5><i className="bi bi-info-circle me-2"></i>File Upload Demo</h5>
            <p className="mb-0">
              {activeTab === 'overview' ? 
                'This dashboard provides an overview of uploaded files and platform statistics.' :
                '🔹 This is a functional demo that saves files to browser localStorage. Files persist until you clear browser data or delete them.\n🔹 In production, files would be uploaded to a server/cloud storage.\n🔹 Try uploading some sample files to test the functionality!'
              }
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .upload-area {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .upload-area:hover {
          background-color: rgba(25, 135, 84, 0.05);
          border-color: var(--success) !important;
        }
        
        .nav-tabs .nav-link {
          color: var(--text-secondary);
          border: none;
          background: none;
        }
        
        .nav-tabs .nav-link.active {
          color: var(--primary);
          background-color: var(--card-bg);
          border-bottom: 2px solid var(--primary);
        }
        
        .nav-tabs .nav-link:hover {
          color: var(--primary);
          background-color: rgba(46, 125, 50, 0.1);
        }

        .recent-uploads {
          max-height: 200px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;