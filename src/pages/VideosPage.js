import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

const VideosPage = () => {
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

  // Helper function to extract YouTube video ID
  const extractYouTubeId = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Generate videos grid component
  const VideosGrid = ({ videos }) => {
    if (!videos || videos.length === 0) {
      return (
        <div className="text-center py-5">
          <i className="bi bi-youtube text-muted" style={{ fontSize: '4rem' }}></i>
          <h5 className="mt-3 text-muted">No video lessons available</h5>
          <p className="text-muted">Video lessons for this subject haven't been added yet.</p>
        </div>
      );
    }

    // Filter videos by language
    const filteredVideos = videos.filter(video => shouldShowResource(video.language));

    if (filteredVideos.length === 0 && selectedLanguage !== 'all') {
      return (
        <div className="text-center py-5">
          <i className="bi bi-search text-muted" style={{ fontSize: '4rem' }}></i>
          <h5 className="mt-3 text-muted">No videos found</h5>
          <p className="text-muted">
            No video lessons available in{' '}
            {selectedLanguage === 'sinhala' && 'Sinhala'}
            {selectedLanguage === 'tamil' && 'Tamil'}
            {selectedLanguage === 'english' && 'English'}
            {' '}for this subject.
          </p>
        </div>
      );
    }

    return (
      <div className="videos-grid">
        <div className="row g-4">
          {filteredVideos.map((video, index) => {
            const videoId = extractYouTubeId(video.url);
            const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;

            return (
              <div key={video.id || index} className="col-md-6 col-lg-4">
                <div className="video-card h-100" data-language={video.language}>
                  <div className="card h-100">
                    {/* Video Thumbnail */}
                    <div className="video-thumbnail position-relative">
                      {thumbnail ? (
                        <img 
                          src={thumbnail} 
                          alt={video.title}
                          className="card-img-top"
                          style={{ height: '200px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      
                      {/* Fallback thumbnail */}
                      <div 
                        className="placeholder-thumbnail d-flex align-items-center justify-content-center bg-light"
                        style={{ 
                          height: '200px', 
                          display: thumbnail ? 'none' : 'flex'
                        }}
                      >
                        <i className="bi bi-play-circle text-muted" style={{ fontSize: '4rem' }}></i>
                      </div>

                      {/* Play overlay */}
                      <div className="play-overlay position-absolute top-50 start-50 translate-middle">
                        <div className="play-button bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
                             style={{ width: '60px', height: '60px' }}>
                          <i className="bi bi-play-fill" style={{ fontSize: '1.5rem', marginLeft: '4px' }}></i>
                        </div>
                      </div>

                      {/* Language badge */}
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className="badge bg-dark bg-opacity-75 d-flex align-items-center">
                          <span 
                            className="language-indicator me-1"
                            {...getLanguageIndicator(video.language)}
                          ></span>
                          {video.language}
                        </span>
                      </div>
                    </div>

                    {/* Video Content */}
                    <div className="card-body d-flex flex-column">
                      <div className="video-content flex-grow-1">
                        <h6 className="video-title mb-2">{video.title}</h6>
                        
                        {video.chapter && (
                          <p className="text-muted mb-2">
                            <i className="bi bi-bookmark me-1"></i>
                            <small>{video.chapter}</small>
                          </p>
                        )}

                        {video.description && (
                          <p className="text-muted small mb-3">{video.description}</p>
                        )}

                        <div className="video-meta">
                          <small className="text-muted d-block">
                            <i className="bi bi-calendar me-1"></i>
                            Added: {new Date(video.addedDate).toLocaleDateString()}
                          </small>
                        </div>
                      </div>

                      {/* Video Actions */}
                      <div className="video-actions mt-3">
                        <a 
                          href={video.url} 
                          className="btn btn-danger btn-sm w-100" 
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            console.log(`Video watched: ${video.title}`);
                            // Track video view
                          }}
                        >
                          <i className="bi bi-youtube me-1"></i>Watch on YouTube
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="videos-page">
      {/* Page Header */}
      <header className="grade-header">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">{grade.display} Video Lessons</h1>
          <p className="lead">Educational videos and tutorials</p>
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
                Video Lessons
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
                Showing videos in: <strong>
                  {selectedLanguage === 'sinhala' && 'සිංහල (Sinhala)'}
                  {selectedLanguage === 'tamil' && 'தமிழ் (Tamil)'}
                  {selectedLanguage === 'english' && 'English'}
                </strong>
              </small>
            </div>
          </div>
        </section>
      )}

      {/* Videos Content */}
      <section className="py-5">
        <div className="container">
          {Object.keys(subjects).map(subjectId => {
            const subject = subjects[subjectId];
            const videos = subject.videos || [];

            // Check if any videos match the filter
            const hasFilteredVideos = videos.some(video => shouldShowResource(video.language));

            // Skip subject if no videos match filter
            if (selectedLanguage !== 'all' && !hasFilteredVideos) {
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
                      <small className="text-muted">Educational video lessons</small>
                    </div>
                  </div>
                </div>

                <VideosGrid videos={videos} />
              </div>
            );
          })}

          {/* No Subjects Message */}
          {Object.keys(subjects).length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-youtube text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">No video lessons available</h4>
              <p className="text-muted">Video lessons for this grade haven't been added yet.</p>
              <Link to={`/grade/${gradeId}`} className="btn btn-primary">
                <i className="bi bi-arrow-left me-1"></i>Back to Grade Overview
              </Link>
            </div>
          )}

          {/* No Results for Filter */}
          {Object.keys(subjects).length > 0 && 
           selectedLanguage !== 'all' && 
           !Object.values(subjects).some(subject => 
             (subject.videos || []).some(video => shouldShowResource(video.language))
           ) && (
            <div className="text-center py-5">
              <i className="bi bi-search text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">No videos found</h4>
              <p className="text-muted">
                No video lessons available in{' '}
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

export default VideosPage;