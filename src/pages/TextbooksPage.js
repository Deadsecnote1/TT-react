import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

const TextbooksPage = () => {
  const { gradeId } = useParams();
  const { generateGradePageData } = useData();
  const { selectedLanguage, shouldShowResource } = useLanguage();

  // Generate page data
  const pageData = useMemo(() => {
    return generateGradePageData(gradeId);
  }, [gradeId, generateGradePageData]);

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

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Generate textbook download component
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
            // Track download
            console.log(`Downloaded: ${textbook.filename}`);
          }}
        >
          <i className="bi bi-download me-1"></i>Download
        </a>
      </div>
    );
  };

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
          {Object.keys(subjects).map(subjectId => {
            const subject = subjects[subjectId];
            const textbooks = subject.resources.textbooks || {};
            
            // Filter textbooks by selected language
            const filteredTextbooks = Object.entries(textbooks).filter(([medium]) => 
              shouldShowResource(medium)
            );

            // Skip subject if no textbooks match filter
            if (filteredTextbooks.length === 0 && selectedLanguage !== 'all') {
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
                        {filteredTextbooks.length} textbook{filteredTextbooks.length !== 1 ? 's' : ''} available
                      </small>
                    </div>
                  </div>
                </div>

                <div className="row g-4">
                  {/* Sinhala Textbook */}
                  <div className="col-md-4">
                    <div className={`textbook-medium-card h-100 ${shouldShowResource('sinhala') ? '' : 'd-none'}`}>
                      <div className="card h-100">
                        <div className="card-header bg-warning text-dark text-center">
                          <h5 className="mb-0">
                            <i className="bi bi-download me-2"></i>සිංහල (Sinhala)
                          </h5>
                        </div>
                        <div className="card-body">
                          <TextbookDownload 
                            textbook={textbooks.sinhala} 
                            medium="Sinhala" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tamil Textbook */}
                  <div className="col-md-4">
                    <div className={`textbook-medium-card h-100 ${shouldShowResource('tamil') ? '' : 'd-none'}`}>
                      <div className="card h-100">
                        <div className="card-header bg-info text-white text-center">
                          <h5 className="mb-0">
                            <i className="bi bi-download me-2"></i>தமிழ் (Tamil)
                          </h5>
                        </div>
                        <div className="card-body">
                          <TextbookDownload 
                            textbook={textbooks.tamil} 
                            medium="Tamil" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* English Textbook */}
                  <div className="col-md-4">
                    <div className={`textbook-medium-card h-100 ${shouldShowResource('english') ? '' : 'd-none'}`}>
                      <div className="card h-100">
                        <div className="card-header bg-primary text-white text-center">
                          <h5 className="mb-0">
                            <i className="bi bi-download me-2"></i>English
                          </h5>
                        </div>
                        <div className="card-body">
                          <TextbookDownload 
                            textbook={textbooks.english} 
                            medium="English" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* No Subjects Message */}
          {Object.keys(subjects).length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-book text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">No textbooks available</h4>
              <p className="text-muted">Textbooks for this grade haven't been added yet.</p>
              <Link to={`/grade/${gradeId}`} className="btn btn-primary">
                <i className="bi bi-arrow-left me-1"></i>Back to Grade Overview
              </Link>
            </div>
          )}

          {/* No Results for Filter */}
          {Object.keys(subjects).length > 0 && 
           selectedLanguage !== 'all' && 
           !Object.values(subjects).some(subject => 
             Object.keys(subject.resources.textbooks || {}).some(medium => shouldShowResource(medium))
           ) && (
            <div className="text-center py-5">
              <i className="bi bi-search text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">No textbooks found</h4>
              <p className="text-muted">
                No textbooks available in{' '}
                {selectedLanguage === 'sinhala' && 'Sinhala'}
                {selectedLanguage === 'tamil' && 'Tamil'}
                {selectedLanguage === 'english' && 'English'}
                {' '}for this grade.
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
    </div>
  );
};

export default TextbooksPage;