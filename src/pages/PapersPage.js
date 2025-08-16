import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

const PapersPage = () => {
  const { gradeId } = useParams();
  const { generateGradePageData } = useData();
  const { selectedLanguage, shouldShowResource, getLanguageIndicator } = useLanguage();

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

  // Helper function to format term names
  const formatTermName = (termKey) => {
    const termNames = {
      'term1': '1st Term',
      'term2': '2nd Term', 
      'term3': '3rd Term'
    };
    return termNames[termKey] || termKey.charAt(0).toUpperCase() + termKey.slice(1);
  };

  // Helper function to format chapter names
  const formatChapterName = (chapterKey) => {
    if (chapterKey.startsWith('ch')) {
      const chapterNum = chapterKey.replace('ch', '');
      return `Chapter ${chapterNum}`;
    }
    return chapterKey.charAt(0).toUpperCase() + chapterKey.slice(1).replace('-', ' ');
  };

  // Generate term papers component
  const TermPapers = ({ termPapers }) => {
    if (!termPapers || Object.keys(termPapers).length === 0) {
      return (
        <div className="text-center py-4">
          <i className="bi bi-file-earmark text-muted" style={{ fontSize: '2rem' }}></i>
          <p className="text-muted mt-2">No term papers available</p>
        </div>
      );
    }

    return (
      <div className="papers-list">
        {Object.entries(termPapers).map(([termKey, papers]) => {
          if (!Array.isArray(papers) || papers.length === 0) return null;

          // Filter papers by language
          const filteredPapers = papers.filter(paper => shouldShowResource(paper.language));
          
          if (filteredPapers.length === 0 && selectedLanguage !== 'all') return null;

          return (
            <div key={termKey} className="term-section mb-4">
              <h6 className="text-primary mb-3">
                <i className="bi bi-calendar me-2"></i>
                {formatTermName(termKey)}
              </h6>
              <div className="row g-2">
                {filteredPapers.map((paper, index) => (
                  <div key={paper.id || index} className="col-12">
                    <div className="paper-item-enhanced d-flex align-items-center justify-content-between p-3 border rounded">
                      <div className="paper-info d-flex align-items-center">
                        <i className="bi bi-file-earmark-pdf text-danger me-3" style={{ fontSize: '1.5rem' }}></i>
                        <div>
                          <h6 className="mb-1">{paper.filename}</h6>
                          <div className="d-flex align-items-center gap-2">
                            <small className="text-muted">{paper.school || 'Unknown School'}</small>
                            <span 
                              className="language-indicator"
                              {...getLanguageIndicator(paper.language)}
                            ></span>
                            <small className="text-muted">{paper.language}</small>
                          </div>
                        </div>
                      </div>
                      <a 
                        href={`/${paper.path}`} 
                        className="btn btn-sm btn-primary" 
                        download
                        onClick={() => console.log(`Downloaded: ${paper.filename}`)}
                      >
                        <i className="bi bi-download"></i>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Generate chapter papers component
  const ChapterPapers = ({ chapterPapers }) => {
    if (!chapterPapers || Object.keys(chapterPapers).length === 0) {
      return (
        <div className="text-center py-4">
          <i className="bi bi-file-earmark text-muted" style={{ fontSize: '2rem' }}></i>
          <p className="text-muted mt-2">No chapter papers available</p>
        </div>
      );
    }

    return (
      <div className="papers-list">
        {Object.entries(chapterPapers).map(([chapterKey, papers]) => {
          if (!Array.isArray(papers) || papers.length === 0) return null;

          // Filter papers by language
          const filteredPapers = papers.filter(paper => shouldShowResource(paper.language));
          
          if (filteredPapers.length === 0 && selectedLanguage !== 'all') return null;

          return (
            <div key={chapterKey} className="chapter-section mb-4">
              <h6 className="text-success mb-3">
                <i className="bi bi-journal-text me-2"></i>
                {formatChapterName(chapterKey)}
              </h6>
              <div className="row g-2">
                {filteredPapers.map((paper, index) => (
                  <div key={paper.id || index} className="col-12">
                    <div className="paper-item-enhanced d-flex align-items-center justify-content-between p-3 border rounded">
                      <div className="paper-info d-flex align-items-center">
                        <i className="bi bi-file-earmark-pdf text-danger me-3" style={{ fontSize: '1.5rem' }}></i>
                        <div>
                          <h6 className="mb-1">{paper.filename}</h6>
                          <div className="d-flex align-items-center gap-2">
                            <small className="text-muted">{paper.school || 'Unknown School'}</small>
                            <span 
                              className="language-indicator"
                              {...getLanguageIndicator(paper.language)}
                            ></span>
                            <small className="text-muted">{paper.language}</small>
                          </div>
                        </div>
                      </div>
                      <a 
                        href={`/${paper.path}`} 
                        className="btn btn-sm btn-primary" 
                        download
                        onClick={() => console.log(`Downloaded: ${paper.filename}`)}
                      >
                        <i className="bi bi-download"></i>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="papers-page">
      {/* Page Header */}
      <header className="grade-header">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">{grade.display} Exam Papers</h1>
          <p className="lead">Past papers for practice and preparation</p>
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
                Exam Papers
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
                Showing papers in: <strong>
                  {selectedLanguage === 'sinhala' && 'සිංහල (Sinhala)'}
                  {selectedLanguage === 'tamil' && 'தமிழ் (Tamil)'}
                  {selectedLanguage === 'english' && 'English'}
                </strong>
              </small>
            </div>
          </div>
        </section>
      )}

      {/* Papers Content */}
      <section className="py-5">
        <div className="container">
          {Object.keys(subjects).map(subjectId => {
            const subject = subjects[subjectId];
            const papers = subject.resources.papers || {};

            // Check if any papers match the filter
            const hasTermPapers = papers.terms && Object.values(papers.terms).some(termPapers => 
              Array.isArray(termPapers) && termPapers.some(paper => shouldShowResource(paper.language))
            );
            const hasChapterPapers = papers.chapters && Object.values(papers.chapters).some(chapterPapers => 
              Array.isArray(chapterPapers) && chapterPapers.some(paper => shouldShowResource(paper.language))
            );

            // Skip subject if no papers match filter
            if (selectedLanguage !== 'all' && !hasTermPapers && !hasChapterPapers) {
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
                      <small className="text-muted">Past examination papers</small>
                    </div>
                  </div>
                </div>

                <div className="row g-4">
                  {/* Term Papers */}
                  <div className="col-md-6">
                    <div className="paper-type-card h-100">
                      <div className="card h-100">
                        <div className="card-header bg-primary text-white">
                          <h5 className="mb-0">
                            <i className="bi bi-calendar me-2"></i>Term Papers
                          </h5>
                        </div>
                        <div className="card-body">
                          <TermPapers termPapers={papers.terms} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chapter Papers */}
                  <div className="col-md-6">
                    <div className="paper-type-card h-100">
                      <div className="card h-100">
                        <div className="card-header bg-success text-white">
                          <h5 className="mb-0">
                            <i className="bi bi-journal-text me-2"></i>Chapter Papers
                          </h5>
                        </div>
                        <div className="card-body">
                          <ChapterPapers chapterPapers={papers.chapters} />
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
              <i className="bi bi-file-earmark-text text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">No exam papers available</h4>
              <p className="text-muted">Past papers for this grade haven't been added yet.</p>
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

export default PapersPage;