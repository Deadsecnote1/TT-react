import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

const TextbooksPage = () => {
  const { gradeId } = useParams();
  const { generateGradePageData } = useData();
  const { selectedLanguage, shouldShowResource } = useLanguage();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Load uploaded files from localStorage
  useEffect(() => {
    const savedFiles = localStorage.getItem('teachingTorch_uploadedFiles');
    if (savedFiles) {
      setUploadedFiles(JSON.parse(savedFiles));
    }
  }, []);

  // Generate page data
  const pageData = useMemo(() => {
    return generateGradePageData(gradeId);
  }, [gradeId, generateGradePageData]);

  // Filter uploaded textbooks for current grade
  const getUploadedTextbooks = () => {
    return uploadedFiles.filter(file => 
      file.grade === gradeId && 
      file.resourceType === 'textbook'
    );
  };

  // Group uploaded textbooks by subject and language
  const getTextbooksBySubject = () => {
    const uploadedTextbooks = getUploadedTextbooks();
    const groupedTextbooks = {};

    uploadedTextbooks.forEach(file => {
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

  const { grade, subjects } = pageData;
  const uploadedTextbooks = getTextbooksBySubject();

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Generate textbook download component for original data
  const TextbookDownload = ({ textbook, medium }) => {
    if (!textbook) {
      return (
        <div className="text-center py-4">
          <i className="bi bi-file-earmark text-muted" style={{ fontSize: '3rem' }}></i>
          <p className="text-muted mt-2">No {medium} textbook available</p>
        </div>
      );
    }

    return (
      <div className="download-item text-center">
        <div className="download-icon mb-3">
          <i className="bi bi-file-pdf text-danger" style={{ fontSize: '3rem' }}></i>
        </div>
        <div className="download-info mb-3">
          <h6 className="mb-1">{textbook.filename}</h6>
          <small className="text-muted">{formatFileSize(textbook.size)}</small>
        </div>
        <a 
          href={`/${textbook.path}`} 
          className="btn btn-primary btn-sm" 
          download
          onClick={() => {
            console.log(`Downloaded: ${textbook.filename}`);
          }}
        >
          <i className="bi bi-download me-1"></i>Download
        </a>
      </div>
    );
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
              <h6 className="mb-1 small">{file.name}</h6>
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
                alert(`📁 File: ${file.name}\n📊 Size: ${formatFileSize(file.size)}\n📅 Uploaded: ${new Date(file.uploadDate).toLocaleDateString()}\n\n⚠️ Note: In production, this would download the actual file from server storage.`);
              }}
            >
              <i className="bi bi-download me-1"></i>Download
            </button>
          </div>
        ))}
      </div>
    );
  };

  // Get subject list (combine original and uploaded)
  const getAllSubjects = () => {
    const subjectList = { ...subjects };
    
    // Add subjects from uploaded files
    Object.keys(uploadedTextbooks).forEach(subjectId => {
      if (!subjectList[subjectId]) {
        // Create a basic subject entry for uploaded subjects
        subjectList[subjectId] = {
          name: subjectId.charAt(0).toUpperCase() + subjectId.slice(1),
          icon: 'bi bi-book',
          resources: { textbooks: {} }
        };
      }
    });

    return subjectList;
  };

  const allSubjects = getAllSubjects();

  return (
    <div className="textbooks-page">
      {/* Page Header */}
      <header className="grade-header">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">{grade.display} Textbooks</h1>
          <p className="lead">Download textbooks in Sinhala, Tamil, and English</p>
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

      {/* Upload Status */}
      {getUploadedTextbooks().length > 0 && (
        <section className="py-2 bg-success bg-opacity-10">
          <div className="container">
            <div className="text-center">
              <small className="text-success">
                <i className="bi bi-cloud-check me-1"></i>
                <strong>{getUploadedTextbooks().length} uploaded textbook{getUploadedTextbooks().length !== 1 ? 's' : ''}</strong> available for {grade.display}
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
                  {selectedLanguage === 'tamil' && 'தமிழ் (Tamil)'}
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
          {Object.keys(allSubjects).map(subjectId => {
            const subject = allSubjects[subjectId];
            const originalTextbooks = subject.resources.textbooks || {};
            const uploadedSubjectTextbooks = uploadedTextbooks[subjectId] || {};
            
            // Check if there are any textbooks for this subject (original or uploaded)
            const hasOriginalTextbooks = Object.keys(originalTextbooks).length > 0;
            const hasUploadedTextbooks = Object.keys(uploadedSubjectTextbooks).length > 0;
            
            if (!hasOriginalTextbooks && !hasUploadedTextbooks) {
              return null;
            }

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
                        {hasOriginalTextbooks && `${Object.keys(originalTextbooks).length} original`}
                        {hasOriginalTextbooks && hasUploadedTextbooks && ' + '}
                        {hasUploadedTextbooks && `${Object.values(uploadedSubjectTextbooks).flat().length} uploaded`}
                        {' '}textbook{(Object.keys(originalTextbooks).length + Object.values(uploadedSubjectTextbooks).flat().length) !== 1 ? 's' : ''} available
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
                          {/* Original Textbook */}
                          {originalTextbooks.sinhala && (
                            <div className="mb-3">
                              <small className="text-muted d-block mb-2">
                                <i className="bi bi-archive me-1"></i>Original Textbook
                              </small>
                              <TextbookDownload 
                                textbook={originalTextbooks.sinhala} 
                                medium="Sinhala" 
                              />
                            </div>
                          )}
                          
                          {/* Uploaded Textbooks */}
                          {uploadedSubjectTextbooks.sinhala && (
                            <div>
                              <small className="text-success d-block mb-2">
                                <i className="bi bi-cloud-upload me-1"></i>Uploaded Textbooks
                              </small>
                              <UploadedTextbookDownload 
                                files={uploadedSubjectTextbooks.sinhala}
                                medium="Sinhala" 
                                language="sinhala"
                              />
                            </div>
                          )}
                          
                          {/* No textbooks */}
                          {!originalTextbooks.sinhala && !uploadedSubjectTextbooks.sinhala && (
                            <div className="text-center py-4">
                              <i className="bi bi-file-earmark text-muted" style={{ fontSize: '3rem' }}></i>
                              <p className="text-muted mt-2">No Sinhala textbook available</p>
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
                          {/* Original Textbook */}
                          {originalTextbooks.tamil && (
                            <div className="mb-3">
                              <small className="text-muted d-block mb-2">
                                <i className="bi bi-archive me-1"></i>Original Textbook
                              </small>
                              <TextbookDownload 
                                textbook={originalTextbooks.tamil} 
                                medium="Tamil" 
                              />
                            </div>
                          )}
                          
                          {/* Uploaded Textbooks */}
                          {uploadedSubjectTextbooks.tamil && (
                            <div>
                              <small className="text-success d-block mb-2">
                                <i className="bi bi-cloud-upload me-1"></i>Uploaded Textbooks
                              </small>
                              <UploadedTextbookDownload 
                                files={uploadedSubjectTextbooks.tamil}
                                medium="Tamil" 
                                language="tamil"
                              />
                            </div>
                          )}
                          
                          {/* No textbooks */}
                          {!originalTextbooks.tamil && !uploadedSubjectTextbooks.tamil && (
                            <div className="text-center py-4">
                              <i className="bi bi-file-earmark text-muted" style={{ fontSize: '3rem' }}></i>
                              <p className="text-muted mt-2">No Tamil textbook available</p>
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
                          {/* Original Textbook */}
                          {originalTextbooks.english && (
                            <div className="mb-3">
                              <small className="text-muted d-block mb-2">
                                <i className="bi bi-archive me-1"></i>Original Textbook
                              </small>
                              <TextbookDownload 
                                textbook={originalTextbooks.english} 
                                medium="English" 
                              />
                            </div>
                          )}
                          
                          {/* Uploaded Textbooks */}
                          {uploadedSubjectTextbooks.english && (
                            <div>
                              <small className="text-success d-block mb-2">
                                <i className="bi bi-cloud-upload me-1"></i>Uploaded Textbooks
                              </small>
                              <UploadedTextbookDownload 
                                files={uploadedSubjectTextbooks.english}
                                medium="English" 
                                language="english"
                              />
                            </div>
                          )}
                          
                          {/* No textbooks */}
                          {!originalTextbooks.english && !uploadedSubjectTextbooks.english && (
                            <div className="text-center py-4">
                              <i className="bi bi-file-earmark text-muted" style={{ fontSize: '3rem' }}></i>
                              <p className="text-muted mt-2">No English textbook available</p>
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

          {/* No Textbooks Message */}
          {Object.keys(allSubjects).length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-book text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">No textbooks available</h4>
              <p className="text-muted">
                Textbooks for this grade haven't been added yet.
                <br />
                <Link to="/admin/login" className="text-primary">
                  Admin can upload textbooks here
                </Link>
              </p>
              <Link to={`/grade/${gradeId}`} className="btn btn-primary">
                <i className="bi bi-arrow-left me-1"></i>Back to Grade Overview
              </Link>
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
      `}</style>
    </div>
  );
};

export default TextbooksPage;