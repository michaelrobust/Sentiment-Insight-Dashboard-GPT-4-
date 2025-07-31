import React, { useState, useRef } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useSentimentAnalysis } from '../../hooks/useSentimentAnalysis';

const FileUploader = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [fileResults, setFileResults] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const fileInputRef = useRef(null);

  const { batchAnalyze, isAnalyzing } = useSentimentAnalysis();

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['text/plain', 'text/csv', 'application/json'];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.txt') && !file.name.endsWith('.csv')) {
      alert('Please upload a text file (.txt, .csv, or .json)');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploadedFile(file);
    
    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      processFileContent(content, file.type);
    };
    reader.readAsText(file);
  };

  // Process file content based on file type
  const processFileContent = (content, fileType) => {
    let texts = [];

    try {
      if (fileType === 'application/json' || content.trim().startsWith('{') || content.trim().startsWith('[')) {
        // JSON file
        const jsonData = JSON.parse(content);
        if (Array.isArray(jsonData)) {
          texts = jsonData.map(item => 
            typeof item === 'string' ? item : 
            item.text || item.content || item.message || JSON.stringify(item)
          );
        } else if (typeof jsonData === 'object') {
          texts = Object.values(jsonData).filter(value => typeof value === 'string');
        }
      } else if (fileType === 'text/csv' || content.includes(',')) {
        // CSV file - assume first column or look for text-like columns
        const lines = content.split('\n').filter(line => line.trim());
        texts = lines.map(line => {
          const columns = line.split(',');
          // Try to find the column with the most text
          return columns.reduce((longest, current) => 
            current.length > longest.length ? current.trim().replace(/"/g, '') : longest, 
            ''
          );
        }).filter(text => text.length > 10); // Filter out short texts
      } else {
        // Plain text file
        texts = content
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
      }

      // Limit to 100 texts
      if (texts.length > 100) {
        texts = texts.slice(0, 100);
        alert(`File contains ${texts.length} texts. Only the first 100 will be processed.`);
      }

      setFileContent(texts.join('\n'));
    } catch (error) {
      alert('Error processing file. Please check the file format.');
      console.error('File processing error:', error);
    }
  };

  // Analyze file content
  const handleAnalyzeFile = async () => {
    if (!fileContent.trim()) {
      alert('No valid content found in the file');
      return;
    }

    const texts = fileContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (texts.length === 0) {
      alert('No valid texts found to analyze');
      return;
    }

    try {
      setUploadProgress({ current: 0, total: texts.length });
      setFileResults([]);

      const results = await batchAnalyze(texts, (current, total, result) => {
        setUploadProgress({ current, total });
        setFileResults(prev => [...prev, result]);
      });

      console.log('File analysis completed:', results);
    } catch (error) {
      alert(`File analysis failed: ${error.message}`);
    }
  };

  // Clear file and results
  const clearFile = () => {
    setUploadedFile(null);
    setFileContent('');
    setFileResults([]);
    setUploadProgress({ current: 0, total: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Download results as JSON
  const downloadResults = () => {
    if (fileResults.length === 0) return;

    const dataToDownload = {
      fileName: uploadedFile?.name || 'unknown',
      analysisDate: new Date().toISOString(),
      totalTexts: fileResults.length,
      results: fileResults.map(result => ({
        text: result.text,
        sentiment: result.result.sentiment,
        confidence: result.result.confidence,
        score: result.result.score,
        keywords: result.result.keywords,
        reasoning: result.result.reasoning,
        emotions: result.result.emotions
      }))
    };

    const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentiment_analysis_${uploadedFile?.name || 'results'}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get sentiment statistics
  const getFileStatistics = () => {
    if (fileResults.length === 0) return null;

    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    let totalConfidence = 0;
    let totalScore = 0;

    fileResults.forEach(result => {
      sentimentCounts[result.result.sentiment]++;
      totalConfidence += result.result.confidence;
      totalScore += result.result.score;
    });

    const total = fileResults.length;
    return {
      total,
      sentimentCounts,
      averageConfidence: (totalConfidence / total).toFixed(2),
      averageScore: (totalScore / total).toFixed(2)
    };
  };

  const statistics = getFileStatistics();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* File Upload Section */}
      <Card title="File Upload Analysis" subtitle="Upload text files for batch sentiment analysis">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Upload Area */}
          <div
            style={{
              border: '2px dashed #d1d5db',
              borderRadius: '6px',
              padding: '24px',
              textAlign: 'center',
              backgroundColor: uploadedFile ? '#f0fdf4' : '#f9fafb',
              borderColor: uploadedFile ? '#10b981' : '#d1d5db',
              transition: 'all 0.2s'
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#2563eb';
              e.currentTarget.style.backgroundColor = '#f0f9ff';
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = uploadedFile ? '#10b981' : '#d1d5db';
              e.currentTarget.style.backgroundColor = uploadedFile ? '#f0fdf4' : '#f9fafb';
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = uploadedFile ? '#10b981' : '#d1d5db';
              e.currentTarget.style.backgroundColor = uploadedFile ? '#f0fdf4' : '#f9fafb';
              const files = e.dataTransfer.files;
              if (files.length > 0) {
                const event = { target: { files } };
                handleFileUpload(event);
              }
            }}
          >
            {uploadedFile ? (
              <div>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#059669', marginBottom: '8px' }}>
                  File Uploaded Successfully
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                  {uploadedFile.name}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
                <div style={{ fontSize: '16px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                  Drag and drop your file here, or click to browse
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  Supports .txt, .csv, and .json files (max 5MB)
                </div>
              </div>
            )}
          </div>

          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.csv,.json,text/plain,text/csv,application/json"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
            >
              📁 Select File
            </Button>

            {uploadedFile && (
              <>
                <Button
                  variant="primary"
                  onClick={handleAnalyzeFile}
                  loading={isAnalyzing}
                  disabled={!fileContent.trim() || isAnalyzing}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze File'}
                </Button>

                <Button
                  variant="secondary"
                  onClick={clearFile}
                  disabled={isAnalyzing}
                >
                  Clear File
                </Button>
              </>
            )}

            {fileResults.length > 0 && (
              <Button
                variant="secondary"
                onClick={downloadResults}
                disabled={isAnalyzing}
              >
                💾 Download Results
              </Button>
            )}
          </div>

          {/* File Content Preview */}
          {fileContent && (
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 500, 
                color: '#374151', 
                marginBottom: '8px' 
              }}>
                File Content Preview ({fileContent.split('\n').filter(line => line.trim()).length} texts found)
              </label>
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                style={{
                  width: '100%',
                  height: '120px',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  resize: 'vertical',
                  backgroundColor: '#f8fafc'
                }}
                readOnly={isAnalyzing}
              />
            </div>
          )}

          {/* Progress Display */}
          {isAnalyzing && (
            <div style={{
              padding: '12px',
              backgroundColor: '#f0f9ff',
              border: '1px solid #0ea5e9',
              borderRadius: '6px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#0369a1' }}>
                  Analyzing: {uploadProgress.current} / {uploadProgress.total}
                </span>
                <span style={{ fontSize: '12px', color: '#0369a1' }}>
                  {Math.round((uploadProgress.current / uploadProgress.total) * 100)}%
                </span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                backgroundColor: '#e0f2fe', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                  height: '100%',
                  backgroundColor: '#0ea5e9',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Results Statistics */}
      {statistics && (
        <Card title="File Analysis Results" subtitle={`Analysis complete for ${statistics.total} texts`}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '16px',
            marginBottom: '16px'
          }}>
            <div style={{
              padding: '12px',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 600, color: '#2563eb', marginBottom: '4px' }}>
                {statistics.total}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Analyzed</div>
            </div>

            <div style={{
              padding: '12px',
              backgroundColor: '#f0fdf4',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 600, color: '#059669', marginBottom: '4px' }}>
                {statistics.averageConfidence}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Avg Confidence</div>
            </div>

            <div style={{
              padding: '12px',
              backgroundColor: '#fefce8',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 600, color: '#ca8a04', marginBottom: '4px' }}>
                {statistics.averageScore > 0 ? '+' : ''}{statistics.averageScore}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Avg Score</div>
            </div>

            <div style={{
              padding: '12px',
              backgroundColor: '#f3e8ff',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 600, color: '#9333ea', marginBottom: '4px' }}>
                {uploadedFile?.name.split('.').pop().toUpperCase() || 'FILE'}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>File Type</div>
            </div>
          </div>

          {/* Sentiment Distribution Chart */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>
              Sentiment Distribution
            </h4>
            {Object.entries(statistics.sentimentCounts).map(([sentiment, count]) => {
              const percentage = Math.round((count / statistics.total) * 100);
              const colors = {
                positive: '#10b981',
                negative: '#ef4444',
                neutral: '#6b7280'
              };
              const icons = {
                positive: '😊',
                negative: '😞',
                neutral: '😐'
              };
              
              return (
                <div key={sentiment} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '16px' }}>
                    {icons[sentiment]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151', textTransform: 'capitalize' }}>
                        {sentiment}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: colors[sentiment] }}>
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      height: '6px', 
                      backgroundColor: '#f3f4f6', 
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: colors[sentiment],
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Sample Results Display */}
      {fileResults.length > 0 && (
        <Card title="Sample Results" subtitle={`Showing first 10 results (${fileResults.length} total)`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {fileResults.slice(0, 10).map((result, index) => {
              const colors = {
                positive: '#10b981',
                negative: '#ef4444',
                neutral: '#6b7280'
              };
              const icons = {
                positive: '😊',
                negative: '😞',
                neutral: '😐'
              };
              
              return (
                <div
                  key={result.id || index}
                  style={{
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    borderLeft: `4px solid ${colors[result.result.sentiment]}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '16px' }}>
                          {icons[result.result.sentiment]}
                        </span>
                        <span style={{ 
                          fontSize: '14px', 
                          fontWeight: 500,
                          color: colors[result.result.sentiment],
                          textTransform: 'capitalize'
                        }}>
                          {result.result.sentiment}
                        </span>
                        <span style={{
                          padding: '2px 6px',
                          fontSize: '11px',
                          backgroundColor: colors[result.result.sentiment],
                          color: 'white',
                          borderRadius: '8px'
                        }}>
                          {Math.round(result.result.confidence * 100)}%
                        </span>
                      </div>
                      <p style={{ 
                        fontSize: '13px', 
                        color: '#374151', 
                        margin: 0,
                        lineHeight: 1.4
                      }}>
                        {result.text.length > 150 ? result.text.substring(0, 150) + '...' : result.text}
                      </p>
                    </div>
                    <div style={{ fontSize: '11px', color: '#9ca3af', minWidth: '40px', textAlign: 'right' }}>
                      #{index + 1}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {fileResults.length > 10 && (
            <div style={{ 
              marginTop: '12px',
              padding: '8px',
              textAlign: 'center', 
              fontSize: '12px', 
              color: '#6b7280',
              backgroundColor: '#f9fafb',
              borderRadius: '4px'
            }}>
              Showing 10 of {fileResults.length} results. Download full results using the "💾 Download Results" button above.
            </div>
          )}
        </Card>
      )}

      {/* Instructions */}
      <Card title="📋 File Upload Instructions" style={{ backgroundColor: '#fefce8', border: '1px solid #f59e0b' }}>
        <div style={{ color: '#92400e', fontSize: '14px', lineHeight: 1.6 }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#92400e' }}>
            Supported File Formats:
          </h4>
          <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px' }}>
            <li><strong>.txt files:</strong> One text per line</li>
            <li><strong>.csv files:</strong> Automatically detects text columns</li>
            <li><strong>.json files:</strong> Arrays of strings or objects with text properties</li>
          </ul>
          
          <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#92400e' }}>
            Requirements:
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Maximum file size: <strong>5MB</strong></li>
            <li>Maximum texts per file: <strong>100</strong></li>
            <li>Each text should be meaningful (not just single words)</li>
            <li>Results can be downloaded as JSON for further analysis</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default FileUploader;