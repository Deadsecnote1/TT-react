import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const TextbooksPage = () => {
  const { gradeId } = useParams();
  const { generateGradePageData } = useData();
  const { selectedLanguage, shouldShowResource } = useLanguage();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStream, setSelectedStream] = useState('');

  // Advanced Level Streams Configuration
  const alStreams = {
    'science': {
      name: 'Science Stream',
      subjects: {
        'physics': { name: 'Physics', icon: 'bi bi-atom' },
        'chemistry': { name: 'Chemistry', icon: 'bi bi-flask' },
        'biology': { name: 'Biology', icon: 'bi bi-tree' },
        'mathematics': { name: 'Combined Mathematics', icon: 'bi bi-calculator' },
        'ict': { name: 'ICT', icon: 'bi bi-laptop' }
      }
    },
    'commerce': {
      name: 'Commerce Stream',
      subjects: {
        'accounting': { name: 'Accounting', icon: 'bi bi-calculator-fill' },
        'business-studies': { name: 'Business Studies', icon: 'bi bi-briefcase' },
        'economics': { name: 'Economics', icon: 'bi bi-graph-up' },
        'geography': { name: 'Geography', icon: 'bi bi-globe' },
        'history': { name: 'History', icon: 'bi bi-clock-history' }
      }
    },
    'arts': {
      name: 'Arts Stream',
      subjects: {
        'sinhala': { name: 'Sinhala', icon: 'bi bi-book' },
        'tamil': { name: 'Tamil', icon: 'bi bi-book' },
        'english': { name: 'English', icon: 'bi bi-book' },
        'history': { name: 'History', icon: 'bi bi-clock-history' },
        'geography': { name: 'Geography', icon: 'bi bi-globe' },
        'political-science': { name: 'Political Science', icon: 'bi bi-people' },
        'logic': { name: 'Logic & Scientific Method', icon: 'bi bi-lightbulb' }
      }
    },
    'technology': {
      name: 'Technology Stream',
      subjects: {
        'engineering-technology': { name: 'Engineering Technology', icon: 'bi bi-gear' },
        'bio-system-technology': { name: 'Bio System Technology', icon: 'bi bi-cpu' },
        'ict': { name: 'ICT', icon: 'bi bi-laptop' },
        'science-for-technology': { name: 'Science for Technology', icon: 'bi bi-atom' }
      }
    }
  };

  // Default subjects for other grades
  const defaultSubjects = {
    'mathematics': { name: 'Mathematics', icon: 'bi bi-calculator' },
    'science': { name: 'Science', icon: 'bi bi-flask' },
    'english': { name: 'English', icon: 'bi bi-book' },
    'sinhala': { name: 'Sinhala', icon: 'bi bi-book' },
    'tamil': { name: 'Tamil', icon: 'bi bi-book' },
    'history': { name: 'History', icon: 'bi bi-clock-history' },
    'geography': { name: 'Geography', icon: 'bi bi-globe' },
    'health': { name: 'Health & Physical Education', icon: 'bi bi-heart-pulse' },
    'religion': { name: 'Religion', icon: 'bi bi-book' },
    'art': { name: 'Art', icon: 'bi bi-palette' },
    'music': { name: 'Music', icon: 'bi bi-music-note' },
    'dancing': { name: 'Dancing', icon: 'bi bi-person' },
    'drama': { name: 'Drama & Theatre', icon: 'bi bi-mask' }
  };

  // Load uploaded files from API or localStorage
  useEffect(() => {
    fetchTextbooks();
  }, [gradeId]);

  // Set default stream for AL
  useEffect(() => {
    if (gradeId === 'al' && !selectedStream) {
      setSelectedStream('science');
    }
  }, [gradeId, selectedStream]);

  const fetchTextbooks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/files/${gradeId}/textbook`);
      const data = await response.json();
      
      if (data.success) {
        setUploadedFiles(data.files);
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('Error fetching from API, using localStorage:', error);
      const savedFiles = localStorage.getItem('teachingTorch_uploadedFiles');
      if (savedFiles) {
        const allFiles = JSON.parse(savedFiles);
        const textbooks = allFiles.filter(file => 
          file.grade === gradeId && file.resourceType === 'textbook'
        );
        setUploadedFiles(textbooks);
      }
    }
    setIsLoading(false);
  };

  // Generate page data
  const pageData = useMemo(() => {
    return generateGradePageData(gradeId);
  }, [gradeId, generateGradePageData]);

  // Group uploaded textbooks by subject and language
  const getTextbooksBySubject = () => {
    const groupedTextbooks = {};

    uploadedFiles.forEach(file => {
      if (!groupedTextbooks[file.subject]) {
        groupedTextbooks[file.subject] = {};
      }
      
      file.languages.forEach(language => {
        if (!groupedTextbooks[file.subject][language]) {
          groupedTextbooks[file.subject][language] = [];
        }
        groupedTextbooks[file.subject][language].push(file);
      });
    });

    return groupedTextbooks;
  };

  if (!pageData.grade) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Grade Not Found</h2>
          <p>The requested grade does not exist.</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const { grade } = pageData;
  const uploadedTextbooks = getTextbooksBySubject();

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Generate uploaded textbook component
  const UploadedTextbookDownload = ({ files, medium, language }) => {
    if (!files || files.length === 0) {
      return (
        <div className="text-center py-4">
          <i className="bi bi-file-earmark text-muted" style={{ fontSize: '3rem' }}></i>
          <p className="text-muted mt-2">No {medium} textbook available</p>
        </div>
      );
    }

    return (
      <div className="uploaded-textbooks">
        {files.map((file, index) => (
          <div key={index} className="download-item text-center mb-3">
            <div className="download-icon mb-2">
              <i className="bi bi-file-pdf text-danger" style={{ fontSize: '2.5rem' }}></i>
            </div>
            <div className="download-info mb-2">
              <h6 className="mb-1 small">{file.originalName || file.name}</h6>
              <small className="text-muted">{formatFileSize(file.size)}</small>
              <br />
              <small className="text-success">
                <i className="bi bi-check-circle me-1"></i>
                Uploaded: {new Date(file.uploadDate).toLocaleDateString()}
              </small>
            </div>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => {
                if (file.downloadUrl) {
                  window.open(file.downloadUrl, '_blank');
                } else {
                  alert(`📁 File: ${file.originalName || file.name}\n📊 Size: ${formatFileSize(file.size)}\n📅 Uploaded: ${new Date(file.uploadDate).toLocaleDateString()}\n\n${file.downloadUrl ? '⬇️ Downloading from server...' : '⚠️ Note: In demo mode. In production, this would download the actual file.'}`);
                }
              }}
            >
              <i className="bi bi-download me-1"></i>Download
            </button>
          </div>
        ))}
      </div>
    );
  };

  // Get all subjects (show all subjects whether they have files or not)
  const getAllSubjects = () => {
    if (gradeId === 'al') {
      return selectedStream ? alStreams[selectedStream].subjects : {};
    }
    return defaultSubjects;
  };

  const allSubjects = getAllSubjects();

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading textbooks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="textbooks-page">
      {/* Page Header */}
      <header className="grade-header">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">{grade.display} Textbooks</h1>
          <p className="lead">
            {gradeId === 'al' ? 'Download A/L textbooks by stream' : 'Download textbooks in Sinhala, Tamil, and English'}
          </p>
        </div>
      </header>

      {/* Breadcrumb */}
      <section className="py-3 bg-light">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to={`/grade/${gradeId}`}>{grade.display}</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Textbooks
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* A/L Stream Selector */}
      {gradeId === 'al' && (
        <section className="py-3 bg-primary bg-opacity-10">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8">
                <h5 className="text-center mb-3">Select Your Stream</h5>
                <div className="row g-3">
                  {Object.entries(alStreams).map(([streamId, stream]) => (
                    <div key={streamId} className="col-md-3">
                      <button
                        className={`btn w-100 ${selectedStream === streamId ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setSelectedStream(streamId)}
                      >
                        <div className="text-center">
                          <i className={`bi ${
                            streamId === 'science' ? 'bi-atom' :
                            streamId === 'commerce' ? 'bi-briefcase' :
                            streamId === 'arts' ? 'bi-palette' : 'bi-gear'
                          } d-block mb-1`} style={{ fontSize: '1.5rem' }}></i>
                          <small>{stream.name}</small>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upload Status */}
      {uploadedFiles.length > 0 && (
        <section className="py-2 bg-success bg-opacity-10">
          <div className="container">
            <div className="text-center">
              <small className="text-success">
                <i className="bi bi-cloud-check me-1"></i>
                <strong>{uploadedFiles.length} uploaded textbook{uploadedFiles.length !== 1 ? 's' : ''}</strong> available for {grade.display}
                {uploadedFiles.some(f => f.downloadUrl) && ' | 🔗 Server files available for download'}
              </small>
            </div>
          </div>
        </section>
      )}

      {/* Language Filter Info */}
      {selectedLanguage !== 'all' && (
        <section className="py-2 bg-info bg-opacity-10">
          <div className="container">
            <div className="text-center">
              <small className="text-info">
                <i className="bi bi-filter me-1"></i>
                Showing textbooks in: <strong>
                  {selectedLanguage === 'sinhala' && 'සිංහල (Sinhala)'}
                  {selectedLanguage === 'tamil' && 'தமிழ් (Tamil)'}
                  {selectedLanguage === 'english' && 'English'}
                </strong>
              </small>
            </div>
          </div>
        </section>
      )}

      {/* Textbooks Content */}
      <section className="py-5">
        <div className="container">
          {/* Show selected stream info for A/L */}
          {gradeId === 'al' && selectedStream && (
            <div className="mb-4">
              <div className="alert alert-info">
                <h5 className="mb-2">
                  <i className={`bi ${
                    selectedStream === 'science' ? 'bi-atom' :
                    selectedStream === 'commerce' ? 'bi-briefcase' :
                    selectedStream === 'arts' ? 'bi-palette' : 'bi-gear'
                  } me-2`}></i>
                  {alStreams[selectedStream].name} Subjects
                </h5>
                <p className="mb-0">
                  Showing textbooks for {Object.keys(allSubjects).length} subjects in the {alStreams[selectedStream].name}.
                </p>
              </div>
            </div>
          )}

          {Object.entries(allSubjects).map(([subjectId, subject]) => {
            const uploadedSubjectTextbooks = uploadedTextbooks[subjectId] || {};
            const hasUploadedTextbooks = Object.keys(uploadedSubjectTextbooks).length > 0;

            return (
              <div key={subjectId} className="subject-section mb-5">
                <div className="subject-header mb-4">
                  <div className="d-flex align-items-center">
                    <div className="subject-icon-large me-3">
                      <i className={subject.icon} style={{ fontSize: '2.5rem', color: 'var(--primary)' }}></i>
                    </div>
                    <div>
                      <h3 className="mb-0">{subject.name}</h3>
                      <small className="text-muted">
                        {hasUploadedTextbooks ? 
                          `${Object.values(uploadedSubjectTextbooks).flat().length} textbook${Object.values(uploadedSubjectTextbooks).flat().length !== 1 ? 's' : ''} available` :
                          'No textbooks uploaded yet'
                        }
                      </small>
                    </div>
                  </div>
                </div>

                <div className="row g-4">
                  {/* Sinhala Textbooks */}
                  <div className="col-md-4">
                    <div className={`textbook-medium-card h-100 ${shouldShowResource('sinhala') ? '' : 'd-none'}`}>
                      <div className="card h-100">
                        <div className="card-header bg-warning text-dark text-center">
                          <h5 className="mb-0">
                            <i className="bi bi-download me-2"></i>සිංහල (Sinhala)
                          </h5>
                        </div>
                        <div className="card-body">
                          {/* Uploaded Textbooks */}
                          {uploadedSubjectTextbooks.sinhala ? (
                            <div>
                              <small className="text-success d-block mb-2">
                                <i className="bi bi-cloud-upload me-1"></i>Available Textbooks
                              </small>
                              <UploadedTextbookDownload 
                                files={uploadedSubjectTextbooks.sinhala}
                                medium="Sinhala" 
                                language="sinhala"
                              />
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <i className="bi bi-file-earmark text-muted" style={{ fontSize: '3rem' }}></i>
                              <p className="text-muted mt-2">No Sinhala textbook available</p>
                              <Link to="/admin/login" className="btn btn-outline-primary btn-sm">
                                <i className="bi bi-plus-circle me-1"></i>Upload Textbook
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tamil Textbooks */}
                  <div className="col-md-4">
                    <div className={`textbook-medium-card h-100 ${shouldShowResource('tamil') ? '' : 'd-none'}`}>
                      <div className="card h-100">
                        <div className="card-header bg-success text-white text-center">
                          <h5 className="mb-0">
                            <i className="bi bi-download me-2"></i>தமிழ் (Tamil)
                          </h5>
                        </div>
                        <div className="card-body">
                          {/* Uploaded Textbooks */}
                          {uploadedSubjectTextbooks.tamil ? (
                            <div>
                              <small className="text-success d-block mb-2">
                                <i className="bi bi-cloud-upload me-1"></i>Available Textbooks
                              </small>
                              <UploadedTextbookDownload 
                                files={uploadedSubjectTextbooks.tamil}
                                medium="Tamil" 
                                language="tamil"
                              />
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <i className="bi bi-file-earmark text-muted" style={{ fontSize: '3rem' }}></i>
                              <p className="text-muted mt-2">No Tamil textbook available</p>
                              <Link to="/admin/login" className="btn btn-outline-primary btn-sm">
                                <i className="bi bi-plus-circle me-1"></i>Upload Textbook
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* English Textbooks */}
                  <div className="col-md-4">
                    <div className={`textbook-medium-card h-100 ${shouldShowResource('english') ? '' : 'd-none'}`}>
                      <div className="card h-100">
                        <div className="card-header bg-primary text-white text-center">
                          <h5 className="mb-0">
                            <i className="bi bi-download me-2"></i>English
                          </h5>
                        </div>
                        <div className="card-body">
                          {/* Uploaded Textbooks */}
                          {uploadedSubjectTextbooks.english ? (
                            <div>
                              <small className="text-success d-block mb-2">
                                <i className="bi bi-cloud-upload me-1"></i>Available Textbooks
                              </small>
                              <UploadedTextbookDownload 
                                files={uploadedSubjectTextbooks.english}
                                medium="English" 
                                language="english"
                              />
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <i className="bi bi-file-earmark text-muted" style={{ fontSize: '3rem' }}></i>
                              <p className="text-muted mt-2">No English textbook available</p>
                              <Link to="/admin/login" className="btn btn-outline-primary btn-sm">
                                <i className="bi bi-plus-circle me-1"></i>Upload Textbook
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* No subjects for A/L without stream */}
          {gradeId === 'al' && !selectedStream && (
            <div className="text-center py-5">
              <i className="bi bi-arrow-up text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">Select a Stream</h4>
              <p className="text-muted">Please select your A/L stream above to view available textbooks.</p>
            </div>
          )}
        </div>
      </section>

      {/* Back to Grade Button */}
      <section className="py-3 bg-light">
        <div className="container text-center">
          <Link to={`/grade/${gradeId}`} className="btn btn-outline-primary">
            <i className="bi bi-arrow-left me-2"></i>Back to {grade.display} Overview
          </Link>
        </div>
      </section>

      <style jsx>{`
        .textbook-medium-card .card {
          transition: all 0.3s ease;
        }

        .textbook-medium-card .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .download-item {
          transition: all 0.3s ease;
          padding: 1rem;
          border-radius: 10px;
        }

        .download-item:hover {
          background-color: var(--bg-secondary);
        }

        .uploaded-textbooks {
          max-height: 400px;
          overflow-y: auto;
        }

        .subject-icon-large {
          min-width: 60px;
        }

        .subject-section {
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 2rem;
        }

        .subject-section:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
};

export default TextbooksPage;