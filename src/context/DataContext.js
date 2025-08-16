import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Create Data Context
const DataContext = createContext();

// Initial State
const initialState = {
  grades: {},
  subjects: {},
  resources: {},
  videos: {},
  settings: {},
  loading: false,
  error: null
};

// Data Reducer
const dataReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'INITIALIZE_DATA':
      return { ...state, ...action.payload, loading: false };
    
    case 'ADD_TEXTBOOK':
      const { gradeId, subjectId, medium, fileData } = action.payload;
      return {
        ...state,
        resources: {
          ...state.resources,
          [gradeId]: {
            ...state.resources[gradeId],
            [subjectId]: {
              ...state.resources[gradeId]?.[subjectId],
              textbooks: {
                ...state.resources[gradeId]?.[subjectId]?.textbooks,
                [medium]: {
                  ...fileData,
                  language: medium,
                  uploadDate: new Date().toISOString()
                }
              }
            }
          }
        }
      };
    
    case 'ADD_PAPER':
      const { gradeId: gId, subjectId: sId, paperType, paperCategory, fileData: fData, schoolName, language } = action.payload;
      const paperInfo = {
        id: Date.now().toString() + Math.random(),
        ...fData,
        school: schoolName || 'Unknown School',
        language: language || 'english',
        uploadDate: new Date().toISOString()
      };
      
      const currentResources = state.resources[gId]?.[sId] || { papers: { terms: { term1: [], term2: [], term3: [] }, chapters: {} } };
      
      if (paperType === 'term') {
        return {
          ...state,
          resources: {
            ...state.resources,
            [gId]: {
              ...state.resources[gId],
              [sId]: {
                ...currentResources,
                papers: {
                  ...currentResources.papers,
                  terms: {
                    ...currentResources.papers.terms,
                    [paperCategory]: [...(currentResources.papers.terms[paperCategory] || []), paperInfo]
                  }
                }
              }
            }
          }
        };
      } else {
        return {
          ...state,
          resources: {
            ...state.resources,
            [gId]: {
              ...state.resources[gId],
              [sId]: {
                ...currentResources,
                papers: {
                  ...currentResources.papers,
                  chapters: {
                    ...currentResources.papers.chapters,
                    [paperCategory]: [...(currentResources.papers.chapters[paperCategory] || []), paperInfo]
                  }
                }
              }
            }
          }
        };
      }
    
    case 'ADD_VIDEO':
      const { gradeId: videoGradeId, subjectId: videoSubjectId, videoData } = action.payload;
      const video = {
        id: Date.now().toString(),
        ...videoData,
        language: videoData.language || 'english',
        addedDate: new Date().toISOString()
      };
      
      return {
        ...state,
        videos: {
          ...state.videos,
          [videoGradeId]: {
            ...state.videos[videoGradeId],
            [videoSubjectId]: [...(state.videos[videoGradeId]?.[videoSubjectId] || []), video]
          }
        }
      };
    
    case 'DELETE_RESOURCE':
      // Implementation for delete operations
      return state;
    
    case 'LOG_ACTIVITY':
      const newActivity = {
        message: action.payload,
        timestamp: new Date().toISOString(),
        id: Date.now()
      };
      
      const activities = state.settings.activities || [];
      const updatedActivities = [newActivity, ...activities].slice(0, 50);
      
      return {
        ...state,
        settings: {
          ...state.settings,
          activities: updatedActivities,
          lastUpdated: new Date().toISOString()
        }
      };
    
    default:
      return state;
  }
};

// Data Provider Component
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Initialize data on mount
  useEffect(() => {
    initializeData();
  }, []);

  // Initialize with default data or load from localStorage
  const initializeData = () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const savedData = localStorage.getItem('teachingTorchData');
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'INITIALIZE_DATA', payload: parsedData });
      } else {
        const defaultData = getDefaultData();
        dispatch({ type: 'INITIALIZE_DATA', payload: defaultData });
        saveData(defaultData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
    }
  };

  // Save data to localStorage
  const saveData = (data = state) => {
    try {
      localStorage.setItem('teachingTorchData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // Save data whenever state changes
  useEffect(() => {
    if (!state.loading && Object.keys(state.grades).length > 0) {
      saveData();
    }
  }, [state]);

  // Get default data structure
  const getDefaultData = () => ({
    grades: {
      'grade6': { name: 'Grade 6', display: 'Grade 6', active: true },
      'grade7': { name: 'Grade 7', display: 'Grade 7', active: true },
      'grade8': { name: 'Grade 8', display: 'Grade 8', active: true },
      'grade9': { name: 'Grade 9', display: 'Grade 9', active: true },
      'grade10': { name: 'Grade 10', display: 'Grade 10', active: true },
      'grade11': { name: 'Grade 11', display: 'Grade 11', active: true },
      'al': { name: 'Advanced Level', display: 'A/L', active: true }
    },
    subjects: {
      'mathematics': { 
        name: 'Mathematics', 
        icon: 'bi-calculator',
        grades: ['grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'grade11']
      },
      'science': { 
        name: 'Science', 
        icon: 'bi-flask',
        grades: ['grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'grade11']
      },
      'sinhala': { 
        name: 'Sinhala', 
        icon: 'bi-book',
        grades: ['grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'grade11']
      },
      'english': { 
        name: 'English', 
        icon: 'bi-globe',
        grades: ['grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'grade11']
      },
      'tamil': { 
        name: 'Tamil', 
        icon: 'bi-book-half',
        grades: ['grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'grade11']
      },
      'social-studies': { 
        name: 'Social Studies', 
        icon: 'bi-geo-alt',
        grades: ['grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'grade11']
      },
      // A/L Subjects
      'combined-maths': { 
        name: 'Combined Mathematics', 
        icon: 'bi-calculator-fill',
        grades: ['al']
      },
      'physics': { 
        name: 'Physics', 
        icon: 'bi-atom',
        grades: ['al']
      },
      'chemistry': { 
        name: 'Chemistry', 
        icon: 'bi-droplet',
        grades: ['al']
      },
      'biology': { 
        name: 'Biology', 
        icon: 'bi-tree',
        grades: ['al']
      }
    },
    resources: {},
    videos: {},
    settings: {
      siteName: 'Teaching Torch',
      adminPassword: 'admin123',
      lastUpdated: new Date().toISOString(),
      activities: []
    }
  });

  // Action creators
  const addTextbook = (gradeId, subjectId, medium, fileData) => {
    dispatch({
      type: 'ADD_TEXTBOOK',
      payload: { gradeId, subjectId, medium, fileData }
    });
    dispatch({
      type: 'LOG_ACTIVITY',
      payload: `Added ${medium} textbook for ${state.subjects[subjectId]?.name} - ${state.grades[gradeId]?.display}`
    });
  };

  const addPaper = (gradeId, subjectId, paperType, paperCategory, fileData, schoolName = '', language = 'english') => {
    dispatch({
      type: 'ADD_PAPER',
      payload: { gradeId, subjectId, paperType, paperCategory, fileData, schoolName, language }
    });
    dispatch({
      type: 'LOG_ACTIVITY',
      payload: `Added ${language} ${paperType} paper (${paperCategory}) from ${schoolName || 'Unknown School'}`
    });
  };

  const addVideo = (gradeId, subjectId, videoData) => {
    dispatch({
      type: 'ADD_VIDEO',
      payload: { gradeId, subjectId, videoData }
    });
    dispatch({
      type: 'LOG_ACTIVITY',
      payload: `Added ${videoData.language || 'english'} video: ${videoData.title}`
    });
  };

  const logActivity = (message) => {
    dispatch({
      type: 'LOG_ACTIVITY',
      payload: message
    });
  };

  // Utility functions
  const getSubjectsForGrade = (gradeId) => {
    const subjects = {};
    Object.keys(state.subjects).forEach(subjectId => {
      const subject = state.subjects[subjectId];
      if (subject.grades.includes(gradeId)) {
        subjects[subjectId] = subject;
      }
    });
    return subjects;
  };

  const getResources = (gradeId, subjectId) => {
    return state.resources[gradeId]?.[subjectId] || {
      textbooks: {},
      papers: { 
        terms: { term1: [], term2: [], term3: [] }, 
        chapters: {} 
      },
      notes: {}
    };
  };

  const getVideos = (gradeId, subjectId) => {
    return state.videos[gradeId]?.[subjectId] || [];
  };

  const getStats = () => {
    const stats = {
      totalGrades: Object.keys(state.grades).length,
      totalSubjects: Object.keys(state.subjects).length,
      totalResources: 0,
      totalVideos: 0,
      languageBreakdown: {
        sinhala: 0,
        tamil: 0,
        english: 0
      }
    };

    // Count resources
    Object.keys(state.resources).forEach(gradeId => {
      Object.keys(state.resources[gradeId]).forEach(subjectId => {
        const resources = state.resources[gradeId][subjectId];
        
        // Count textbooks
        if (resources.textbooks) {
          Object.keys(resources.textbooks).forEach(medium => {
            stats.totalResources++;
            if (stats.languageBreakdown[medium] !== undefined) {
              stats.languageBreakdown[medium]++;
            }
          });
        }
        
        // Count papers
        if (resources.papers) {
          if (resources.papers.terms) {
            Object.keys(resources.papers.terms).forEach(term => {
              const termPapers = resources.papers.terms[term];
              if (Array.isArray(termPapers)) {
                termPapers.forEach(paper => {
                  stats.totalResources++;
                  if (paper.language && stats.languageBreakdown[paper.language] !== undefined) {
                    stats.languageBreakdown[paper.language]++;
                  }
                });
              }
            });
          }
          
          if (resources.papers.chapters) {
            Object.keys(resources.papers.chapters).forEach(chapter => {
              const chapterPapers = resources.papers.chapters[chapter];
              if (Array.isArray(chapterPapers)) {
                chapterPapers.forEach(paper => {
                  stats.totalResources++;
                  if (paper.language && stats.languageBreakdown[paper.language] !== undefined) {
                    stats.languageBreakdown[paper.language]++;
                  }
                });
              }
            });
          }
        }
      });
    });

    // Count videos
    Object.keys(state.videos).forEach(gradeId => {
      Object.keys(state.videos[gradeId]).forEach(subjectId => {
        state.videos[gradeId][subjectId].forEach(video => {
          stats.totalVideos++;
          if (video.language && stats.languageBreakdown[video.language] !== undefined) {
            stats.languageBreakdown[video.language]++;
          }
        });
      });
    });

    return stats;
  };

  const generateGradePageData = (gradeId) => {
    const grade = state.grades[gradeId];
    const subjects = getSubjectsForGrade(gradeId);
    const pageData = {
      grade: grade,
      subjects: {}
    };

    Object.keys(subjects).forEach(subjectId => {
      const subject = subjects[subjectId];
      const resources = getResources(gradeId, subjectId);
      const videos = getVideos(gradeId, subjectId);

      pageData.subjects[subjectId] = {
        ...subject,
        resources,
        videos
      };
    });

    return pageData;
  };

  // Export data
  const exportData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `teaching-torch-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    logActivity('Data exported successfully');
  };

  // Import data
  const importData = (jsonData) => {
    try {
      const importedData = JSON.parse(jsonData);
      
      if (!importedData.grades || !importedData.subjects) {
        throw new Error('Invalid data format');
      }
      
      dispatch({ type: 'INITIALIZE_DATA', payload: importedData });
      logActivity('Data imported successfully');
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Import failed: Invalid data format' });
      return false;
    }
  };

  // Context value
  const value = {
    // State
    ...state,
    
    // Actions
    addTextbook,
    addPaper,
    addVideo,
    logActivity,
    
    // Utilities
    getSubjectsForGrade,
    getResources,
    getVideos,
    getStats,
    generateGradePageData,
    exportData,
    importData,
    
    // State management
    dispatch
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataContext;