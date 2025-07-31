import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useSentimentAnalysis } from '../../hooks/useSentimentAnalysis';

const BatchAnalyzer = () => {
  const [batchText, setBatchText] = useState('');
  const [batchResults, setBatchResults] = useState([]);
  const [analysisProgress, setAnalysisProgress] = useState({ current: 0, total: 0 });
  const [showResults, setShowResults] = useState(false);

  const { batchAnalyze, isAnalyzing } = useSentimentAnalysis();

  // Handle batch analysis
  const handleBatchAnalysis = async () => {
    if (!batchText.trim()) {
      alert('Please enter texts to analyze');
      return;
    }

    // Split text by lines and filter out empty lines
    const texts = batchText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (texts.length === 0) {
      alert('No valid text found to analyze');
      return;
    }

    if (texts.length > 50) {
      alert('Maximum 50 texts allowed for batch analysis');
      return;
    }

    try {
      setAnalysisProgress({ current: 0, total: texts.length });
      setBatchResults([]);
      setShowResults(true);

      const results = await batchAnalyze(texts, (current, total, result) => {
        setAnalysisProgress({ current, total });
        setBatchResults(prev => [...prev, { 
          text: result.text, 
          result: result.result,
          id: result.id 
        }]);
      });

      console.log('Batch analysis completed:', results);
    } catch (error) {
      alert(`Batch analysis failed: ${error.message}`);
    }
  };

  // Clear batch results
  const clearBatchResults = () => {
    setBatchResults([]);
    setShowResults(false);
    setAnalysisProgress({ current: 0, total: 0 });
  };

  // Get sentiment color
  const getSentimentColor = (sentiment) => {
    const colors = {
      positive: '#10b981',
      negative: '#ef4444',
      neutral: '#6b7280'
    };
    return colors[sentiment] || '#6b7280';
  };

  // Get sentiment icon
  const getSentimentIcon = (sentiment) => {
    const icons = {
      positive: '😊',
      negative: '😞',
      neutral: '😐'
    };
    return icons[sentiment] || '😐';
  };

  // Generate summary statistics
  const generateSummary = () => {
    if (batchResults.length === 0) return null;

    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    let totalConfidence = 0;
    let totalScore = 0;

    batchResults.forEach(item => {
      sentimentCounts[item.result.sentiment]++;
      totalConfidence += item.result.confidence;
      totalScore += item.result.score;
    });

    const total = batchResults.length;
    return {
      total,
      sentimentCounts,
      averageConfidence: (totalConfidence / total).toFixed(2),
      averageScore: (totalScore / total).toFixed(2),
      mostCommon: Object.entries(sentimentCounts).reduce((a, b) => 
        sentimentCounts[a[0]] > sentimentCounts[b[0]] ? a : b
      )[0]
    };
  };

  const summary = generateSummary();

  // Example texts for batch analysis
  const exampleBatchTexts = [
    "Today's presentation went incredibly well, the team was impressed.",
    "The new software has some bugs that need to be fixed urgently.",
    "The weather forecast shows rain for the next three days.",
    "I absolutely love the new design, it's so user-friendly!",
    "The service quality has declined significantly over the past month."
  ].join('\n');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Input Section */}
      <Card title="Batch Sentiment Analysis" subtitle="Analyze multiple texts at once">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Batch Text Input */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: 500, 
              color: '#374151', 
              marginBottom: '8px' 
            }}>
              Texts to Analyze (one per line)
            </label>
            <textarea
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              placeholder="Enter multiple texts, one per line..."
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '8px'
            }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                {batchText.split('\n').filter(line => line.trim().length > 0).length} texts found
              </span>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                Maximum 50 texts allowed
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Button
              variant="primary"
              onClick={handleBatchAnalysis}
              loading={isAnalyzing}
              disabled={!batchText.trim() || isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Start Batch Analysis'}
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => setBatchText('')}
              disabled={!batchText.trim() || isAnalyzing}
            >
              Clear
            </Button>

            <Button
              variant="secondary"
              onClick={() => setBatchText(exampleBatchTexts)}
              disabled={isAnalyzing}
            >
              Load Example
            </Button>

            {batchResults.length > 0 && (
              <Button
                variant="danger"
                size="sm"
                onClick={clearBatchResults}
                disabled={isAnalyzing}
              >
                Clear Results
              </Button>
            )}
          </div>

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
                  Processing: {analysisProgress.current} / {analysisProgress.total}
                </span>
                <span style={{ fontSize: '12px', color: '#0369a1' }}>
                  {Math.round((analysisProgress.current / analysisProgress.total) * 100)}%
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
                  width: `${(analysisProgress.current / analysisProgress.total) * 100}%`,
                  height: '100%',
                  backgroundColor: '#0ea5e9',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Results Summary */}
      {summary && (
        <Card title="Batch Analysis Summary" subtitle={`Results for ${summary.total} texts`}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '16px' 
          }}>
            <div style={{
              padding: '12px',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 600, color: '#2563eb', marginBottom: '4px' }}>
                {summary.total}
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
                {summary.averageConfidence}
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
                {summary.averageScore > 0 ? '+' : ''}{summary.averageScore}
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
                {summary.mostCommon === 'positive' ? 'Positive' :
                 summary.mostCommon === 'negative' ? 'Negative' : 'Neutral'}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Most Common</div>
            </div>
          </div>

          {/* Sentiment Distribution */}
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>
              Sentiment Distribution
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(summary.sentimentCounts).map(([sentiment, count]) => {
                const percentage = Math.round((count / summary.total) * 100);
                return (
                  <div key={sentiment} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '16px' }}>
                      {getSentimentIcon(sentiment)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151', textTransform: 'capitalize' }}>
                          {sentiment}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: getSentimentColor(sentiment) }}>
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
                          backgroundColor: getSentimentColor(sentiment),
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Detailed Results */}
      {showResults && batchResults.length > 0 && (
        <Card title="Detailed Results" subtitle={`Analysis results for each text`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {batchResults.map((item, index) => (
              <div
                key={item.id || index}
                style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  borderLeft: `4px solid ${getSentimentColor(item.result.sentiment)}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '18px' }}>
                        {getSentimentIcon(item.result.sentiment)}
                      </span>
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: 600,
                        color: getSentimentColor(item.result.sentiment),
                        textTransform: 'capitalize'
                      }}>
                        {item.result.sentiment}
                      </span>
                      <span style={{
                        padding: '2px 6px',
                        fontSize: '11px',
                        backgroundColor: getSentimentColor(item.result.sentiment),
                        color: 'white',
                        borderRadius: '8px'
                      }}>
                        {Math.round(item.result.confidence * 100)}%
                      </span>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        Score: {item.result.score > 0 ? '+' : ''}{item.result.score}
                      </span>
                    </div>
                    
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#374151', 
                      margin: '0 0 8px 0',
                      lineHeight: 1.5
                    }}>
                      {item.text}
                    </p>

                    {/* Keywords */}
                    {item.result.keywords && item.result.keywords.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {item.result.keywords.map((keyword, keyIndex) => (
                          <span
                            key={keyIndex}
                            style={{
                              padding: '2px 6px',
                              fontSize: '11px',
                              backgroundColor: '#e5e7eb',
                              color: '#374151',
                              borderRadius: '3px'
                            }}
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#9ca3af', 
                    textAlign: 'right',
                    minWidth: '60px'
                  }}>
                    #{index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Instructions */}
      <Card title="📋 Instructions" style={{ backgroundColor: '#fefce8', border: '1px solid #f59e0b' }}>
        <div style={{ color: '#92400e', fontSize: '14px', lineHeight: 1.6 }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#92400e' }}>
            How to use Batch Analysis:
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Enter multiple texts, <strong>one per line</strong></li>
            <li>Maximum <strong>50 texts</strong> per batch</li>
            <li>Each text should be meaningful (not just single words)</li>
            <li>Results will appear in real-time as analysis progresses</li>
            <li>View summary statistics and detailed results below</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default BatchAnalyzer;