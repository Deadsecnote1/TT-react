import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const GradePage = () => {
  const { gradeId } = useParams();
  const { generateGradePageData } = useData();
  const [selectedStream, setSelectedStream] = useState('science');

  // A/L Streams Configuration
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

  // Get subjects based on grade type
  const getSubjects = () => {
    if (gradeId === 'al') {
      return alStreams[selectedStream].subjects;
    }
    return subjects;
  };

  const currentSubjects = getSubjects();

  // Helper functions for counting resources
  const countTextbooks = (subjects) => {
    let count = 0;
    Object.keys(subjects).forEach(subjectId => {
      const textbooks = subjects[subjectId].resources?.textbooks;
      if (textbooks) {
        count += Object.keys(textbooks).length;
      }
    });
    return count;
  };

  const countPapers = (subjects) => {
    let count = 0;
    Object.keys(subjects).forEach(subjectId => {
      const papers = subjects[subjectId].resources?.papers;
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
      const notes = subjects[subjectId].resources?.notes;
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
    if (subject.resources?.textbooks) count += Object.keys(subject.resources.textbooks).length;
    if (subject.resources?.papers) {
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
    if (subject.resources?.notes) count += Object.keys(subject.resources.notes).length;
    if (subject.videos) count += subject.videos.length;
    return count;
  };

  return (
    <div className="grade-page">
      {/* Grade Header */}
      <header className="grade-header">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">{grade.display} Resources</h1>
          <p className="lead">
            {gradeId === 'al' ? 
              'Complete study materials for Advanced Level streams' : 
              'Complete study materials in all three mediums'
            }
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
              <li className="breadcrumb-item active" aria-current="page">
                {grade.display}
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* A/L Stream Selector */}
      {gradeId === 'al' && (
        <section className="py-4 bg-primary bg-opacity-10">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-10">
                <h4 className="text-center mb-4">Select Your A/L Stream</h4>
                <div className="row g-3">
                  {Object.entries(alStreams).map(([streamId, stream]) => (
                    <div key={streamId} className="col-md-3">
                      <div 
                        className={`stream-card ${selectedStream === streamId ? 'active' : ''}`}
                        onClick={() => setSelectedStream(streamId)}
                      >
                        <div className="stream-icon mb-3">
                          <i className={`bi ${
                            streamId === 'science' ? 'bi-atom' :
                            streamId === 'commerce' ? 'bi-briefcase' :
                            streamId === 'arts' ? 'bi-palette' : 'bi-gear'
                          }`} style={{ fontSize: '3rem' }}></i>
                        </div>
                        <h5>{stream.name}</h5>
                        <p className="text-muted mb-0">{Object.keys(stream.subjects).length} subjects</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Resource Type Cards */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4 mb-5">
            <div className="col-md-3">
              <Link 
                to={`/grade/${gradeId}/textbooks`} 
                className="resource-type-card textbooks"
              >
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <div className="resource-type-icon mb-3">
                      <i className="bi bi-book text-primary" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5 className="card-title">Textbooks</h5>
                    <p className="card-text">
                      {gradeId === 'al' ? 'Stream textbooks' : 'All subjects in 3 mediums'}
                    </p>
                    <span className="badge bg-primary">{countTextbooks(currentSubjects)} files</span>
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
                    <span className="badge bg-info">{countPapers(currentSubjects)} files</span>
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
                    <span className="badge bg-warning">{countNotes(currentSubjects)} files</span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-md-3">
              <Link to={`/grade/${gradeId}/videos`} className="resource-type-card videos">
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <div className="resource-type-icon mb-3">
                      <i className="bi bi-play-circle text-danger" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5 className="card-title">Video Lessons</h5>
                    <p className="card-text">Educational videos</p>
                    <span className="badge bg-danger">{countVideos(currentSubjects)} videos</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Stream Info for A/L */}
          {gradeId === 'al' && (
            <div className="row mb-5">
              <div className="col-12">
                <div className="alert alert-info">
                  <h5 className="mb-3">
                    <i className={`bi ${
                      selectedStream === 'science' ? 'bi-atom' :
                      selectedStream === 'commerce' ? 'bi-briefcase' :
                      selectedStream === 'arts' ? 'bi-palette' : 'bi-gear'
                    } me-2`}></i>
                    {alStreams[selectedStream].name} - Available Subjects
                  </h5>
                  <div className="row g-3">
                    {Object.entries(currentSubjects).map(([subjectId, subject]) => (
                      <div key={subjectId} className="col-md-4 col-lg-3">
                        <div className="d-flex align-items-center">
                          <i className={subject.icon} style={{ fontSize: '1.5rem', color: 'var(--primary)' }} className="me-2"></i>
                          <span>{subject.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subjects Overview */}
          <div className="subjects-overview">
            <h3 className="mb-4 text-center">
              {gradeId === 'al' ? 
                `${alStreams[selectedStream].name} Subjects` : 
                'Available Subjects'
              }
            </h3>
            <div className="row g-4">
              {Object.entries(currentSubjects).map(([subjectId, subject]) => (
                <div key={subjectId} className="col-lg-4 col-md-6">
                  <div className="subject-card">
                    <div className="subject-icon">
                      <i className={subject.icon}></i>
                    </div>
                    <div className="subject-info">
                      <h5>{subject.name}</h5>
                      <div className="resource-stats">
                        <div className="stat-item">
                          <small>Resources Available</small>
                          <div className="stat-number">{getSubjectResourceCount(subject)}</div>
                        </div>
                      </div>
                      <div className="resource-links mt-3">
                        <Link 
                          to={`/grade/${gradeId}/textbooks`} 
                          className="btn btn-outline-primary btn-sm me-2"
                        >
                          <i className="bi bi-book me-1"></i>Textbooks
                        </Link>
                        <Link 
                          to={`/grade/${gradeId}/papers`} 
                          className="btn btn-outline-info btn-sm me-2"
                        >
                          <i className="bi bi-file-text me-1"></i>Papers
                        </Link>
                        <Link 
                          to={`/grade/${gradeId}/notes`} 
                          className="btn btn-outline-warning btn-sm"
                        >
                          <i className="bi bi-sticky me-1"></i>Notes
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="row g-4 mt-5">
            <div className="col-12">
              <div className="stats-summary">
                <h4 className="text-center mb-4">Resource Statistics</h4>
                <div className="row g-4 text-center">
                  <div className="col-md-3">
                    <div className="stat-card">
                      <i className="bi bi-journals text-primary" style={{ fontSize: '2.5rem' }}></i>
                      <h3 className="mt-2">{Object.keys(currentSubjects).length}</h3>
                      <p className="text-muted">Subjects</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card">
                      <i className="bi bi-book text-success" style={{ fontSize: '2.5rem' }}></i>
                      <h3 className="mt-2">{countTextbooks(currentSubjects)}</h3>
                      <p className="text-muted">Textbooks</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card">
                      <i className="bi bi-file-earmark-text text-info" style={{ fontSize: '2.5rem' }}></i>
                      <h3 className="mt-2">{countPapers(currentSubjects)}</h3>
                      <p className="text-muted">Papers</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card">
                      <i className="bi bi-sticky text-warning" style={{ fontSize: '2.5rem' }}></i>
                      <h3 className="mt-2">{countNotes(currentSubjects)}</h3>
                      <p className="text-muted">Notes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-4 bg-light">
        <div className="container text-center">
          <h4 className="mb-3">Need More Resources?</h4>
          <p className="text-muted mb-4">
            Can't find what you're looking for? Contact our admin team to request additional materials.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/contact" className="btn btn-primary">
              <i className="bi bi-envelope me-2"></i>Contact Us
            </Link>
            <Link to="/admin/login" className="btn btn-outline-primary">
              <i className="bi bi-shield-lock me-2"></i>Admin Login
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .resource-type-card {
          text-decoration: none;
          color: inherit;
          display: block;
          transition: all 0.3s ease;
        }

        .resource-type-card:hover {
          text-decoration: none;
          color: inherit;
          transform: translateY(-5px);
        }

        .resource-type-card .card {
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .resource-type-card:hover .card {
          border-color: var(--primary);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .stream-card {
          background: var(--card-bg);
          border-radius: 15px;
          padding: 2rem 1rem;
          text-align: center;
          border: 2px solid var(--border-color);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .stream-card:hover {
          border-color: var(--primary);
          transform: translateY(-3px);
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }

        .stream-card.active {
          border-color: var(--primary);
          background: var(--primary);
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(46, 125, 50, 0.3);
        }

        .stream-card.active .stream-icon {
          color: white;
        }

        .stream-card.active .text-muted {
          color: rgba(255, 255, 255, 0.8) !important;
        }

        .stream-icon {
          color: var(--primary);
          transition: color 0.3s ease;
        }

        .subject-card {
          background: var(--card-bg);
          border-radius: 15px;
          padding: 1.5rem;
          border: 2px solid var(--border-color);
          transition: all 0.3s ease;
          height: 100%;
        }

        .subject-card:hover {
          border-color: var(--primary);
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .subject-icon {
          text-align: center;
          margin-bottom: 1rem;
        }

        .subject-icon i {
          font-size: 3rem;
          color: var(--primary);
        }

        .subject-info {
          text-align: center;
        }

        .resource-stats {
          margin: 1rem 0;
        }

        .stat-item {
          display: inline-block;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--primary);
        }

        .stat-card {
          background: var(--card-bg);
          border-radius: 15px;
          padding: 2rem 1rem;
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }

        .stats-summary {
          background: var(--card-bg);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
        }

        @media (max-width: 768px) {
          .stream-card {
            padding: 1.5rem 1rem;
          }
          
          .stream-icon i {
            font-size: 2rem;
          }
          
          .subject-card {
            padding: 1rem;
          }
          
          .subject-icon i {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default GradePage;