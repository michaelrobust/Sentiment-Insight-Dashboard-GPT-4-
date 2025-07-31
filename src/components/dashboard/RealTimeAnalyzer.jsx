import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import SentimentChart from './SentimentChart';
import EmotionRadar from './EmotionRadar';
import StatisticsPanel from './StatisticsPanel';
import { useSentimentAnalysis } from '../../hooks/useSentimentAnalysis';

const RealTimeAnalyzer = () => {
  const [inputText, setInputText] = useState('');
  const [selectedResult, setSelectedResult] = useState(null);
  const [chartType, setChartType] = useState('line'); // 'line', 'bar', 'pie'
  
  const {
    analyzeText,
    isAnalyzing,
    currentAnalysis,
    statistics,
    results,
    getTrendData,
    getSentimentDistribution,
    getRecentSummary,
    clearResults
  } = useSentimentAnalysis();

  // Handle text analysis
  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      alert('Please enter text to analyze');
      return;
    }

    try {
      const result = await analyzeText(inputText);
      if (result) {
        setInputText(''); // Clear input
        setSelectedResult(result); // Set as selected for radar chart
      }
    } catch (error) {
      alert(`Analysis failed: ${error.message}`);
    }
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

  // Use example text
  const handleUseExample = (exampleText) => {
    setInputText(exampleText);
  };

  const exampleTexts = [
    "Today's meeting was incredibly successful, everyone was very satisfied with the final results!",
    "The quality of this product is terrible, completely fails to meet expectations.",
    "Tomorrow's weather forecast shows it will be sunny with a temperature around 25 degrees.",
    "I love this new feature, it makes work so much easier and more enjoyable!"
  ];

  // Chart type selector
  const ChartTypeSelector = () => (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
      {[
        { type: 'line', label: 'Line Chart', icon: '📈' },
        { type: 'bar', label: 'Bar Chart', icon: '📊' },
        { type: 'pie', label: 'Pie Chart', icon: '🥧' }
      ].map(({ type, label, icon }) => (
        <button
          key={type}
          onClick={() => setChartType(type)}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 500,
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: chartType === type ? '#2563eb' : 'white',
            color: chartType === type ? 'white' : '#374151',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {icon} {label}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Input Section */}
      <Card title="Real-time Sentiment Analysis" subtitle="Enter any text for sentiment analysis">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Text Input */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: 500, 
              color: '#374151', 
              marginBottom: '8px' 
            }}>
              Text to Analyze
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Please enter the text you want to analyze..."
              style={{
                width: '100%',
                minHeight: '100px',
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
                {inputText.length} characters
              </span>
              {inputText.length > 1000 && (
                <span style={{ fontSize: '12px', color: '#ef4444' }}>
                  Recommend keeping text under 1000 characters
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Button
              variant="primary"
              onClick={handleAnalyze}
              loading={isAnalyzing}
              disabled={!inputText.trim() || inputText.length > 1000}
            >
              {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => setInputText('')}
              disabled={!inputText.trim() || isAnalyzing}
            >
              Clear
            </Button>

            {results.length > 0 && (
              <Button
                variant="danger"
                size="sm"
                onClick={clearResults}
                disabled={isAnalyzing}
              >
                Clear All Results
              </Button>
            )}
            
            {isAnalyzing && (
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                🔄 Processing your text...
              </span>
            )}
          </div>

          {/* Example Texts */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: 500, 
              color: '#374151', 
              marginBottom: '8px' 
            }}>
              Try these examples:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {exampleTexts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleUseExample(example)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    maxWidth: '250px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#e5e7eb';
                    e.target.style.borderColor = '#9ca3af';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                >
                  {example.substring(0, 40)}...
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Charts and Visualization Section */}
      {results.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          
          {/* Sentiment Trend Chart */}
          <div>
            <ChartTypeSelector />
            <SentimentChart 
              trendData={getTrendData()}
              distributionData={getSentimentDistribution()}
              chartType={chartType}
            />
          </div>

          {/* Emotion Radar Chart */}
          <EmotionRadar 
            emotionData={selectedResult?.result.emotions || currentAnalysis?.result.emotions}
          />
        </div>
      )}

      {/* Current Analysis Result */}
      {currentAnalysis && (
        <Card 
          title="Latest Analysis Result" 
          style={{ 
            backgroundColor: '#f8fafc',
            border: `2px solid ${getSentimentColor(currentAnalysis.result.sentiment)}`
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Main Result */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                fontSize: '48px',
                lineHeight: 1
              }}>
                {getSentimentIcon(currentAnalysis.result.sentiment)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ 
                    fontSize: '18px', 
                    fontWeight: 600,
                    color: getSentimentColor(currentAnalysis.result.sentiment)
                  }}>
                    {currentAnalysis.result.sentiment === 'positive' ? 'Positive Sentiment' :
                     currentAnalysis.result.sentiment === 'negative' ? 'Negative Sentiment' : 'Neutral Sentiment'}
                  </span>
                  <span style={{
                    padding: '2px 8px',
                    fontSize: '12px',
                    backgroundColor: getSentimentColor(currentAnalysis.result.sentiment),
                    color: 'white',
                    borderRadius: '12px'
                  }}>
                    {Math.round(currentAnalysis.result.confidence * 100)}% confidence
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  Sentiment Score: {currentAnalysis.result.score > 0 ? '+' : ''}{currentAnalysis.result.score}
                </div>
              </div>
            </div>

            {/* Analysis Reasoning */}
            <div style={{
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                Analysis Reasoning:
              </h4>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                {currentAnalysis.result.reasoning}
              </p>
            </div>

            {/* Keywords */}
            {currentAnalysis.result.keywords.length > 0 && (
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  Keywords:
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {currentAnalysis.result.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        backgroundColor: '#e5e7eb',
                        color: '#374151',
                        borderRadius: '4px',
                        border: '1px solid #d1d5db'
                      }}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Processing Info */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              fontSize: '12px',
              color: '#9ca3af',
              paddingTop: '8px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <span>Processing Time: {Math.round(currentAnalysis.result.processingTime)}ms</span>
              <span>Mode: {currentAnalysis.result.mode}</span>
              <span>{new Date(currentAnalysis.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Analysis History */}
      {results.length > 0 && (
        <Card title="Analysis History" subtitle={`Last ${Math.min(results.length, 10)} analyses`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {results.slice(0, 10).map((analysis, index) => (
              <div
                key={analysis.id}
                onClick={() => setSelectedResult(analysis)}
                style={{
                  padding: '12px',
                  backgroundColor: selectedResult?.id === analysis.id ? '#f0f9ff' : 
                                   index === 0 ? '#f8fafc' : 'white',
                  border: selectedResult?.id === analysis.id ? '2px solid #2563eb' : '1px solid #e5e7eb',
                  borderRadius: '6px',
                  borderLeft: `4px solid ${getSentimentColor(analysis.result.sentiment)}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  if (selectedResult?.id !== analysis.id) {
                    e.target.style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedResult?.id !== analysis.id) {
                    e.target.style.backgroundColor = index === 0 ? '#f8fafc' : 'white';
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '16px' }}>
                        {getSentimentIcon(analysis.result.sentiment)}
                      </span>
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: 500,
                        color: getSentimentColor(analysis.result.sentiment)
                      }}>
                        {analysis.result.sentiment === 'positive' ? 'Positive' :
                         analysis.result.sentiment === 'negative' ? 'Negative' : 'Neutral'}
                      </span>
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                        {Math.round(analysis.result.confidence * 100)}%
                      </span>
                      {selectedResult?.id === analysis.id && (
                        <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 500 }}>
                          (Selected for Radar)
                        </span>
                      )}
                    </div>
                    <p style={{ 
                      fontSize: '13px', 
                      color: '#6b7280', 
                      margin: '0 0 4px 0',
                      lineHeight: 1.4
                    }}>
                      {analysis.text.length > 100 ? 
                        analysis.text.substring(0, 100) + '...' : 
                        analysis.text
                      }
                    </p>
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'right' }}>
                    {new Date(analysis.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {results.length >= 10 && (
            <div style={{ 
              textAlign: 'center', 
              marginTop: '12px', 
              fontSize: '12px', 
              color: '#9ca3af' 
            }}>
              Showing last 10 analysis results
            </div>
          )}
        </Card>
      )}

      {/* Statistics Panel */}
      <StatisticsPanel 
        statistics={statistics}
        recentSummary={getRecentSummary()}
        showDetailed={results.length > 5}
      />
    </div>
  );
};

export default RealTimeAnalyzer;