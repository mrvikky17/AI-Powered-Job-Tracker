import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import resumeService from '../services/resumeService';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [useDemo, setUseDemo] = useState(false);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid PDF file.');
      setFile(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleAnalyze = async () => {
    if (!file && !useDemo) {
      setError('Please select a resume file or try the demo.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let result;
      if (useDemo) {
        // Use mock data for demo
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading
        result = resumeService.getMockAnalysisResult();
      } else {
        // Try enhanced analysis first, fallback to simple
        try {
          result = await resumeService.analyzeResume(file);
        } catch (enhancedError) {
          console.log('Enhanced analysis failed, trying simple analysis...');
          const simpleResult = await resumeService.analyzeResumeSimple(file);
          // Convert simple result to enhanced format
          result = {
            success: true,
            data: {
              skills: resumeService.formatSkillsForDisplay(simpleResult.skills),
              totalSkills: simpleResult.skills.length,
              extractedInfo: {
                skillCoverage: Math.min(100, (simpleResult.skills.length / 10) * 100)
              },
              recommendations: [
                {
                  type: 'general',
                  message: 'Consider adding more technical skills to strengthen your profile',
                  priority: 'medium'
                }
              ],
              analysis: {
                fileName: file.name,
                fileSize: file.size,
                processedAt: new Date().toISOString()
              }
            }
          };
        }
      }
      
      setAnalysisResult(result.data);
    } catch (err) {
      setError(err.message || 'Failed to analyze resume');
      console.error('Resume analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setAnalysisResult(null);
    setError(null);
    setUseDemo(false);
  };

  const renderSkillCategory = (category, skills) => {
    return (
      <div key={category} style={styles.skillCategory}>
        <h4 style={styles.categoryTitle}>{category}</h4>
        <div style={styles.skillsList}>
          {skills.map((skill, index) => (
            <span key={index} style={styles.skillTag}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderRecommendations = (recommendations) => {
    if (!recommendations || recommendations.length === 0) return null;

    return (
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>💡 Recommendations</h3>
        <div style={styles.recommendationsList}>
          {recommendations.map((rec, index) => (
            <div 
              key={index} 
              style={{
                ...styles.recommendationItem,
                borderLeftColor: rec.priority === 'high' ? '#ef4444' : 
                                rec.priority === 'medium' ? '#f59e0b' : '#10b981'
              }}
            >
              <div style={styles.recHeader}>
                <span style={styles.recType}>{rec.type.replace('_', ' ').toUpperCase()}</span>
                <span style={{
                  ...styles.recPriority,
                  color: rec.priority === 'high' ? '#ef4444' : 
                         rec.priority === 'medium' ? '#f59e0b' : '#10b981'
                }}>
                  {rec.priority.toUpperCase()}
                </span>
              </div>
              <p style={styles.recMessage}>{rec.message}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🤖 AI Resume Analyzer</h1>
          <p style={styles.subtitle}>
            Upload your resume and get instant AI-powered insights about your skills and career recommendations
          </p>
        </div>
        <Link to="/dashboard" style={styles.backButton}>
          ← Back to Dashboard
        </Link>
      </div>

      {!analysisResult ? (
        <div style={styles.uploadSection}>
          {/* File Upload Area */}
          <div 
            style={{
              ...styles.dropZone,
              ...(isDragOver ? styles.dropZoneActive : {}),
              ...(file ? styles.dropZoneWithFile : {})
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <input
              id="fileInput"
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              style={styles.hiddenInput}
            />
            
            <div style={styles.dropZoneContent}>
              {file ? (
                <>
                  <div style={styles.fileIcon}>📄</div>
                  <h3 style={styles.fileName}>{file.name}</h3>
                  <p style={styles.fileSize}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p style={styles.changeFile}>Click to change file</p>
                </>
              ) : (
                <>
                  <div style={styles.uploadIcon}>📁</div>
                  <h3 style={styles.uploadTitle}>Drop your resume here</h3>
                  <p style={styles.uploadText}>or click to browse files</p>
                  <p style={styles.supportedFormats}>Supports PDF files up to 5MB</p>
                </>
              )}
            </div>
          </div>

          {/* Demo Option */}
          <div style={styles.demoSection}>
            <p style={styles.demoText}>Don't have a resume handy?</p>
            <button 
              onClick={() => setUseDemo(true)}
              style={styles.demoButton}
            >
              Try Demo Analysis
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div style={styles.errorMessage}>
              ⚠️ {error}
            </div>
          )}

          {/* Analyze Button */}
          <button 
            onClick={handleAnalyze}
            disabled={loading || (!file && !useDemo)}
            style={{
              ...styles.analyzeButton,
              ...(loading || (!file && !useDemo) ? styles.analyzeButtonDisabled : {})
            }}
          >
            {loading ? (
              <>
                <div style={styles.spinner}></div>
                Analyzing Resume...
              </>
            ) : (
              'Analyze Resume'
            )}
          </button>
        </div>
      ) : (
        /* Results Section */
        <div style={styles.resultsSection}>
          {/* Analysis Summary */}
          <div style={styles.summaryCard}>
            <div style={styles.summaryHeader}>
              <h2 style={styles.summaryTitle}>✅ Analysis Complete</h2>
              <button onClick={handleReset} style={styles.newAnalysisButton}>
                New Analysis
              </button>
            </div>
            
            <div style={styles.summaryStats}>
              <div style={styles.stat}>
                <div style={styles.statNumber}>{analysisResult.totalSkills}</div>
                <div style={styles.statLabel}>Skills Found</div>
              </div>
              
              <div style={styles.stat}>
                <div style={styles.statNumber}>{analysisResult.extractedInfo?.skillCoverage || 0}%</div>
                <div style={styles.statLabel}>Skill Coverage</div>
              </div>
              
              <div style={styles.stat}>
                <div style={styles.statNumber}>{Object.keys(analysisResult.skills).length}</div>
                <div style={styles.statLabel}>Categories</div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🎯 Extracted Skills</h3>
            <div style={styles.skillsContainer}>
              {Object.entries(analysisResult.skills).map(([category, skills]) => 
                renderSkillCategory(category, skills)
              )}
            </div>
          </div>

          {/* Recommendations */}
          {renderRecommendations(analysisResult.recommendations)}

          {/* Additional Info */}
          {analysisResult.extractedInfo && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>📋 Additional Information</h3>
              <div style={styles.infoGrid}>
                {analysisResult.extractedInfo.email && (
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Email:</span>
                    <span style={styles.infoValue}>{analysisResult.extractedInfo.email[0]}</span>
                  </div>
                )}
                {analysisResult.extractedInfo.phone && (
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Phone:</span>
                    <span style={styles.infoValue}>{analysisResult.extractedInfo.phone[0]}</span>
                  </div>
                )}
                {analysisResult.extractedInfo.experience && (
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Experience:</span>
                    <span style={styles.infoValue}>{analysisResult.extractedInfo.experience[0]}</span>
                  </div>
                )}
                {analysisResult.extractedInfo.education && analysisResult.extractedInfo.education.length > 0 && (
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Education:</span>
                    <span style={styles.infoValue}>
                      {analysisResult.extractedInfo.education.slice(0, 3).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analysis Metadata */}
          {analysisResult.analysis && (
            <div style={styles.metadataSection}>
              <h4 style={styles.metadataTitle}>Analysis Details</h4>
              <div style={styles.metadata}>
                <span>File: {analysisResult.analysis.fileName}</span>
                <span>Size: {(analysisResult.analysis.fileSize / 1024).toFixed(1)} KB</span>
                <span>Processed: {new Date(analysisResult.analysis.processedAt).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Enhanced styles for modern UI
const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '24px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 8px 0'
  },
  subtitle: {
    color: '#6b7280',
    margin: 0,
    fontSize: '16px',
    lineHeight: '1.5'
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '14px'
  },
  uploadSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  dropZone: {
    border: '2px dashed #d1d5db',
    borderRadius: '12px',
    padding: '48px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '24px'
  },
  dropZoneActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff'
  },
  dropZoneWithFile: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4'
  },
  dropZoneContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  hiddenInput: {
    display: 'none'
  },
  uploadIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  fileIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  uploadTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 8px 0'
  },
  fileName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#059669',
    margin: '0 0 4px 0'
  },
  uploadText: {
    color: '#6b7280',
    margin: '0 0 8px 0'
  },
  fileSize: {
    color: '#9ca3af',
    fontSize: '14px',
    margin: '0 0 8px 0'
  },
  changeFile: {
    color: '#3b82f6',
    fontSize: '14px',
    margin: 0
  },
  supportedFormats: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0
  },
  demoSection: {
    textAlign: 'center',
    padding: '24px',
    borderTop: '1px solid #e5e7eb',
    marginBottom: '24px'
  },
  demoText: {
    color: '#6b7280',
    margin: '0 0 12px 0'
  },
  demoButton: {
    padding: '8px 16px',
    backgroundColor: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  errorMessage: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    textAlign: 'center'
  },
  analyzeButton: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s'
  },
  analyzeButtonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed'
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid #ffffff40',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  resultsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  summaryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  summaryTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0
  },
  newAnalysisButton: {
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  summaryStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px'
  },
  stat: {
    textAlign: 'center',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px'
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#3b82f6',
    margin: '0 0 4px 0'
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 20px 0'
  },
  skillsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  skillCategory: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px'
  },
  categoryTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 12px 0'
  },
  skillsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  skillTag: {
    padding: '6px 12px',
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500'
  },
  recommendationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  recommendationItem: {
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    borderLeft: '4px solid',
  },
  recHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  recType: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase'
  },
  recPriority: {
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  recMessage: {
    color: '#374151',
    margin: 0,
    lineHeight: '1.5'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px'
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  infoLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280'
  },
  infoValue: {
    fontSize: '14px',
    color: '#1f2937'
  },
  metadataSection: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '20px'
  },
  metadataTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280',
    margin: '0 0 8px 0'
  },
  metadata: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    fontSize: '12px',
    color: '#9ca3af'
  }
};

// Add spinner animation
if (!document.querySelector('#spinner-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'spinner-styles';
  styleSheet.type = 'text/css';
  styleSheet.innerText = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default ResumeAnalyzer;
