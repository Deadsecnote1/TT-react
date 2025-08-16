import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const About = () => {
  const { getStats } = useData();
  const stats = getStats();

  return (
    <div className="about-page">
      {/* Page Header */}
      <header className="page-header">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">About Teaching Torch</h1>
          <p className="lead">Empowering Sri Lankan students with free educational resources</p>
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
                About
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-5">
                <h2 className="mb-4">Our Mission</h2>
                <p className="lead text-muted">
                  To provide free, accessible, and comprehensive educational resources for all Sri Lankan students, 
                  breaking down barriers to quality education and fostering academic excellence across the nation.
                </p>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="mission-card">
                <i className="bi bi-heart-fill text-danger"></i>
                <h4>Free Education</h4>
                <p>
                  We believe education should be accessible to everyone. All our resources are completely free 
                  to download and use, ensuring no student is left behind due to financial constraints.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="mission-card">
                <i className="bi bi-translate text-primary"></i>
                <h4>Multi-Language Support</h4>
                <p>
                  Recognizing Sri Lanka's linguistic diversity, we provide resources in Sinhala, Tamil, and English, 
                  ensuring every student can learn in their preferred language.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="mission-card">
                <i className="bi bi-award-fill text-warning"></i>
                <h4>Quality Content</h4>
                <p>
                  Our resources are carefully curated and organized to meet curriculum standards, 
                  helping students achieve their academic goals with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2>Our Impact</h2>
            <p className="text-muted">Numbers that reflect our commitment to Sri Lankan education</p>
          </div>
          
          <div className="row text-center">
            <div className="col-md-3 mb-4">
              <div className="stat-card">
                <h3 className="display-4 fw-bold text-primary">{stats.totalGrades}</h3>
                <p className="mb-0">Grade Levels</p>
                <small className="text-muted">From Grade 6 to A/L</small>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="stat-card">
                <h3 className="display-4 fw-bold text-success">{stats.totalSubjects}</h3>
                <p className="mb-0">Subjects</p>
                <small className="text-muted">Comprehensive coverage</small>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="stat-card">
                <h3 className="display-4 fw-bold text-info">{stats.totalResources}</h3>
                <p className="mb-0">Resources</p>
                <small className="text-muted">Textbooks, papers & notes</small>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="stat-card">
                <h3 className="display-4 fw-bold text-danger">{stats.totalVideos}</h3>
                <p className="mb-0">Video Lessons</p>
                <small className="text-muted">Educational tutorials</small>
              </div>
            </div>
          </div>

          {/* Language Distribution */}
          <div className="row justify-content-center mt-5">
            <div className="col-lg-8">
              <div className="language-stats">
                <h4 className="text-center mb-4">Resources by Language</h4>
                <div className="row text-center">
                  <div className="col-md-4">
                    <div className="language-stat">
                      <div className="language-icon sinhala mb-2">
                        <span className="language-indicator sinhala"></span>
                      </div>
                      <h5>{stats.languageBreakdown.sinhala}</h5>
                      <p className="mb-0">සිංහල Resources</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="language-stat">
                      <div className="language-icon tamil mb-2">
                        <span className="language-indicator tamil"></span>
                      </div>
                      <h5>{stats.languageBreakdown.tamil}</h5>
                      <p className="mb-0">தமிழ் Resources</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="language-stat">
                      <div className="language-icon english mb-2">
                        <span className="language-indicator english"></span>
                      </div>
                      <h5>{stats.languageBreakdown.english}</h5>
                      <p className="mb-0">English Resources</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-5">
        <div className="container">
          <div className="vision-section">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h2 className="mb-4">Our Vision</h2>
                <p className="mb-4">
                  We envision a Sri Lanka where every student, regardless of their background or location, 
                  has access to high-quality educational resources that help them reach their full potential.
                </p>
                <p className="mb-4">
                  Through technology and community collaboration, we aim to bridge the educational gap 
                  and create equal opportunities for all students across the country.
                </p>
                <h3 className="h5 mb-3">What We Offer:</h3>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Complete textbook collections in all three languages
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Past examination papers for practice
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Concise chapter-wise study notes
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Educational video lessons and tutorials
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Mobile-friendly access anytime, anywhere
                  </li>
                </ul>
              </div>
              <div className="col-lg-6">
                <div className="vision-graphic text-center">
                  <div className="icon-stack">
                    <i className="bi bi-mortarboard-fill text-primary" style={{ fontSize: '6rem' }}></i>
                    <div className="mt-3">
                      <h4 className="text-primary">Education for All</h4>
                      <p className="text-muted">Building a brighter future for Sri Lankan students</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2>Our Commitment</h2>
            <p className="text-muted">Dedicated to excellence in educational support</p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="commitment-card text-center">
                <i className="bi bi-shield-check text-success mb-3" style={{ fontSize: '3rem' }}></i>
                <h5>Quality Assurance</h5>
                <p className="text-muted">
                  All resources are carefully reviewed and aligned with the Sri Lankan curriculum 
                  to ensure accuracy and relevance.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="commitment-card text-center">
                <i className="bi bi-clock text-info mb-3" style={{ fontSize: '3rem' }}></i>
                <h5>Regular Updates</h5>
                <p className="text-muted">
                  We continuously add new resources and update existing content to keep pace 
                  with curriculum changes and student needs.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="commitment-card text-center">
                <i className="bi bi-people text-warning mb-3" style={{ fontSize: '3rem' }}></i>
                <h5>Community Driven</h5>
                <p className="text-muted">
                  Built by educators and students for the educational community, fostering 
                  collaboration and shared learning experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5">
        <div className="container">
          <div className="cta-section text-center">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <h2 className="mb-4">Join Our Educational Journey</h2>
                <p className="lead mb-4">
                  Whether you're a student seeking quality resources or an educator looking to support 
                  your students, Teaching Torch is here to help you succeed.
                </p>
                <div className="cta-buttons">
                  <Link to="/" className="btn btn-primary btn-lg me-3">
                    <i className="bi bi-book me-2"></i>Explore Resources
                  </Link>
                  <Link to="/contact" className="btn btn-outline-primary btn-lg">
                    <i className="bi bi-envelope me-2"></i>Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2>Our Values</h2>
            <p className="text-muted">The principles that guide everything we do</p>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="value-card text-center h-100">
                <div className="value-icon mb-3">
                  <i className="bi bi-unlock-fill text-primary" style={{ fontSize: '2.5rem' }}></i>
                </div>
                <h5>Accessibility</h5>
                <p className="text-muted small">
                  Making quality education accessible to every student, regardless of economic background.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="value-card text-center h-100">
                <div className="value-icon mb-3">
                  <i className="bi bi-star-fill text-warning" style={{ fontSize: '2.5rem' }}></i>
                </div>
                <h5>Excellence</h5>
                <p className="text-muted small">
                  Striving for the highest quality in all our educational resources and services.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="value-card text-center h-100">
                <div className="value-icon mb-3">
                  <i className="bi bi-globe text-info" style={{ fontSize: '2.5rem' }}></i>
                </div>
                <h5>Inclusivity</h5>
                <p className="text-muted small">
                  Embracing linguistic and cultural diversity to serve all Sri Lankan students.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="value-card text-center h-100">
                <div className="value-icon mb-3">
                  <i className="bi bi-lightbulb-fill text-success" style={{ fontSize: '2.5rem' }}></i>
                </div>
                <h5>Innovation</h5>
                <p className="text-muted small">
                  Leveraging technology to create better learning experiences for modern students.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Message */}
      <section className="py-4">
        <div className="container">
          <div className="text-center">
            <p className="text-muted mb-0">
              <i className="bi bi-heart-fill text-danger me-1"></i>
              Made with love for Sri Lankan Education 🇱🇰
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;