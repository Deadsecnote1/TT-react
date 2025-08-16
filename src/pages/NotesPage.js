import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

const NotesPage = () => {
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

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper function to format chapter names
  const formatChapterName = (chapterKey) => {
    if (chapterKey.includes('_')) {
      // Remove language suffix for display
      const baseName = chapterKey.split('_')[0];
      if (baseName.startsWith('ch')) {
        const chapterNum = baseName.replace('ch', '');
        return `Chapter ${chapterNum}`;
      }
      return baseName.charAt(0).toUpperCase() + baseName.slice(1).replace('-', ' ');
    }
    
    if (chapterKey.startsWith('ch')) {
      const chapterNum = chapterKey.replace('ch', '');
      return `Chapter ${chapterNum}`;
    }
    return chapterKey.charAt(0).toUpperCase() + chapterKey.slice(1).replace('-', ' ');
  };

  // Generate notes grid component
  const NotesGrid = ({ notes }) => {
    if (!notes || Object.keys(notes).length === 0) {
      return (
        <div className="text-center py-5">
          <i className="bi bi-sticky text-muted" style={{ fontSize: '4rem' }}></i>
          <h5 className="mt-3 text-muted">No notes available</h5>
          <p className="text-muted">Short notes for this subject haven't been added yet.</p>
        </div>
      );
    }

    // Filter notes by language
    const filteredNotes = Object.entries(notes).filter(([noteKey, note]) => 
      shouldShowResource(note.language)
    );

    if (filteredNotes.length === 0 && selectedLanguage !== 'all') {
      return (
        <div className="text-center py-5">
          <i className="bi bi-search text-muted" style={{ fontSize: '4rem' }}></i>
          <h5 className="mt-3 text-muted">No notes found</h5>
          <p className="text-muted">
            No notes available in{' '}
            {selectedLanguage === 'sinhala' && 'Sinhala'}
            {selectedLanguage === 'tamil' && 'Tamil'}
            {selectedLanguage === 'english' && 'English'}
            {' '}for this subject.
          </p>
        </div>
      );
    }

    return (
      <div className="notes-grid">
        <div className="row g-3">
          {filteredNotes.map(([noteKey, note]) => (
            <div key={noteKey} className="col-md-6 col-lg-4">
              <div className="note-card h-100" data-language={note.language}>
                <div className="card h-100">
                  <div className="card-body d-flex flex-column">
                    <div className="note-header mb-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="note-icon">
                          <i className="bi bi-file-pdf text-danger" style={{ fontSize: '2rem' }}></i>
                        </div>
                        <div className="language-badge">
                          <span 
                            className="language-indicator"
                            {...getLanguageIndicator(note.language)}
                          ></span>
                        </div>
                      </div>
                    </div>

                    <div className="note-content flex-grow-1">
                      <h6 className="note-title mb-2">
                        {formatChapterName(note.chapter || noteKey)}
                      </h6>
                      <div className="note-meta mb-3">
                        <small className="text-muted d-block">{note.filename}</small>
                        <small className="text-muted d-block">{formatFileSize(note.size)}</small>
                        <small className="text-muted d-block">
                          <span 
                            className="language-indicator me-1"
                            {...getLanguageIndicator(note.language)}
                          ></span>
                          {note.language.charAt(0).toUpperCase() + note.language.slice(1)}
                        </small>
                      </div>
                    </div>

                    <div className="note-actions mt-auto">
                      <a 
                        href={`/${note.path}`} 
                        className="btn btn-primary btn-sm w-100" 
                        download
                        onClick={() => console.log(`Downloaded note: ${note.filename}`)}
                      >
                        <i className="bi bi-download me-1"></i>Download Notes
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="notes-page">
      {/* Page Header */}
      <header className="grade-header">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">{grade.display} Short Notes</h1>
          <p className="lead">Quick reference notes for all chapters</p>
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
                Short Notes
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
                Showing notes in: <strong>
                  {selectedLanguage === 'sinhala' && 'සිංහල (Sinhala)'}
                  {selectedLanguage === 'tamil' && 'தமிழ் (Tamil)'}
                  {selectedLanguage === 'english' && 'English'}
                </strong>
              </small>
            </div>
          </div>
        </section>
      )}

      {/* Notes Content */}
      <section className="py-5">
        <div className="container">
          {Object.keys(subjects).map(subjectId => {
            const subject = subjects[subjectId];
            const notes = subject.resources.notes || {};

            // Check if any notes match the filter
            const hasFilteredNotes = Object.values(notes).some(note => shouldShowResource(note.language));

            // Skip subject if no notes match filter
            if (selectedLanguage !== 'all' && !hasFilteredNotes) {
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
                      <small className="text-muted">Chapter-wise short notes</small>
                    </div>
                  </div>
                </div>

                <NotesGrid notes={notes} />
              </div>
            );
          })}

          {/* No Subjects Message */}
          {Object.keys(subjects).length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-sticky text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">No notes available</h4>
              <p className="text-muted">Short notes for this grade haven't been added yet.</p>
              <Link to={`/grade/${gradeId}`} className="btn btn-primary">
                <i className="bi bi-arrow-left me-1"></i>Back to Grade Overview
              </Link>
            </div>
          )}

          {/* No Results for Filter */}
          {Object.keys(subjects).length > 0 && 
           selectedLanguage !== 'all' && 
           !Object.values(subjects).some(subject => 
             Object.values(subject.resources.notes || {}).some(note => shouldShowResource(note.language))
           ) && (
            <div className="text-center py-5">
              <i className="bi bi-search text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">No notes found</h4>
              <p className="text-muted">
                No notes available in{' '}
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

export default NotesPage;