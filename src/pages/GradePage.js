import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

const GradePage = () => {
  const { gradeId } = useParams();
  const { generateGradePageData } = useData();
  const { filterByLanguage, selectedLanguage } = useLanguage();

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

  // Helper functions for counting resources
  const countTextbooks = (subjects) => {
    let count = 0;
    Object.keys(subjects).forEach(subjectId => {
      const textbooks = subjects[subjectId].resources.textbooks;
      if (textbooks) {
        count += Object.keys(textbooks).length;
      }
    });
    return count;
  };

  const countPapers = (subjects) => {
    let count = 0;
    Object.keys(subjects).forEach(subjectId => {
      const papers = subjects[subjectId].resources.papers;
      if (papers) {
        if (papers.terms) {
          Object.keys(papers.terms).forEach(term => {
            const termPapers = papers.terms[term];
            if (Array.isArray(termPapers)) {
              count += termPapers.length;
            }
          });
        }
        if (papers.chapters) {
          Object.keys(papers.chapters).forEach(chapter => {
            const chapterPapers = papers.chapters[chapter];
            if (Array.isArray(chapterPapers)) {
              count += chapterPapers.length;
            }
          });
        }
      }
    });
    return count;
  };

  const countNotes = (subjects) => {
    let count = 0;
    Object.keys(subjects).forEach(subjectId => {
      const notes = subjects[subjectId].resources.notes;
      if (notes) {
        count += Object.keys(notes).length;
      }
    });
    return count;
  };

  const countVideos = (subjects) => {
    let count = 0;
    Object.keys(subjects).forEach(subjectId => {
      const videos = subjects[subjectId].videos;
      if (videos) {
        count += videos.length;
      }
    });
    return count;
  };

  const getSubjectResourceCount = (subject) => {
    let count = 0;
    if (subject.resources.textbooks) count += Object.keys(subject.resources.textbooks).length;
    if (subject.resources.papers) {
      if (subject.resources.papers.terms) {
        Object.keys(subject.resources.papers.terms).forEach(term => {
          const termPapers = subject.resources.papers.terms[term];
          if (Array.isArray(termPapers)) count += termPapers.length;
        });
      }
      if (subject.resources.papers.chapters) {
        Object.keys(subject.resources.papers.chapters).forEach(chapter => {
          const chapterPapers = subject.resources.papers.chapters[chapter];
          if (Array.isArray(chapterPapers)) count += chapterPapers.length;
        });
      }
    }
    if (subject.resources.notes) count += Object.keys(subject.resources.notes).length;
    if (subject.videos) count += subject.videos.length;
    return count;
  };

  return (
    <div className="grade-page">
      {/* Grade Header */}
      <header className="grade-header">
        <div className="container text-center">
          <div className="grade-number">
            {grade.display.includes('A/L') ? 'A/L' : grade.display.split(' ')[1]}
          </div>
          <h1 className="display-4 fw-bold">{grade.display} Resources</h1>
          <p className="lead">Complete study materials in all three mediums</p>
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
              <li className="breadcrumb-item active" aria-current="page">
                {grade.display}
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Resource Type Cards */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4 mb-5">
            <div className="col-md-3">
              <Link to={`/grade/${gradeId}/textbooks`} className="resource-type-card textbooks">
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <div className="resource-type-icon mb-3">
                      <i className="bi bi-book text-primary" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5 className="card-title">Textbooks</h5>
                    <p className="card-text">All subjects in 3 mediums</p>
                    <span className="badge bg-primary">{countTextbooks(subjects)} files</span>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="col-md-3">
              <Link to={`/grade/${gradeId}/papers`} className="resource-type-card papers">
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <div className="resource-type-icon mb-3">
                      <i className="bi bi-file-earmark-text text-info" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5 className="card-title">Exam Papers</h5>
                    <p className="card-text">Term & chapter papers</p>
                    <span className="badge bg-info">{countPapers(subjects)} files</span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-md-3">
              <Link to={`/grade/${gradeId}/notes`} className="resource-type-card notes">
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <div className="resource-type-icon mb-3">
                      <i className="bi bi-sticky text-warning" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5 className="card-title">Short Notes</h5>
                    <p className="card-text">Chapter-wise summaries</p>
                    <span className="badge bg-warning">{countNotes(subjects)} files</span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-md-3">
              <Link to={`/grade/${gradeId}/videos`} className="resource-type-card videos">
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <div className="resource-type-icon mb-3">
                      <i className="bi bi-youtube text-danger" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5 className="card-title">Video Lessons</h5>
                    <p className="card-text">YouTube tutorials</p>
                    <span className="badge bg-danger">{countVideos(subjects)} videos</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Available Subjects */}
          <h3 className="mb-4">Available Subjects</h3>
          <div className="row g-4">
            {Object.keys(subjects).map(subjectId => {
              const subject = subjects[subjectId];
              const resourceCount = getSubjectResourceCount(subject);
              
              return (
                <div key={subjectId} className="col-md-4 col-lg-3">
                  <div className="subject-overview-card">
                    <div className="subject-icon mb-3">
                      <i className={subject.icon} style={{ fontSize: '2.5rem', color: 'var(--primary)' }}></i>
                    </div>
                    <h6 className="mb-2">{subject.name}</h6>
                    <div className="subject-stats">
                      <small className="text-muted">{resourceCount} resources</small>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* No Subjects Message */}
          {Object.keys(subjects).length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-book text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">No subjects available</h4>
              <p className="text-muted">Subjects for this grade haven't been added yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default GradePage;