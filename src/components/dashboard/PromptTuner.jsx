import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useSentimentAnalysis } from '../../hooks/useSentimentAnalysis';

const PromptTuner = () => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [testText, setTestText] = useState('');
  const [originalResult, setOriginalResult] = useState(null);
  const [customResult, setCustomResult] = useState(null);
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [promptName, setPromptName] = useState('');
  const [isComparing, setIsComparing] = useState(false);
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(-1);

  const { analyzeText, isAnalyzing } = useSentimentAnalysis();

  // Default prompts library
  const defaultPrompts = [
    {
      name: 'Standard Analysis',
      prompt: `Analyze the sentiment of the following text. Respond with JSON format:
{
  "sentiment": "positive/negative/neutral",
  "confidence": 0.95,
  "score": 0.8,
  "keywords": ["keyword1", "keyword2"],
  "reasoning": "analysis reasoning",
  "emotions": {"joy": 0.8, "anger": 0.1, "sadness": 0.05, "fear": 0.05}
}`,
      description: 'Basic sentiment analysis with emotion breakdown'
    },
    {
      name: 'Detailed Analysis',
      prompt: `You are an expert sentiment analyst. Provide comprehensive analysis of the text including:
1. Overall sentiment (positive/negative/neutral)
2. Confidence level (0-1)
3. Sentiment score (-1 to +1)
4. Key emotional indicators
5. Reasoning for your assessment
6. Emotional distribution across joy, anger, sadness, fear

Format as JSON with detailed explanations.`,
      description: 'In-depth analysis with detailed explanations'
    },
    {
      name: 'Business Review Analysis',
      prompt: `Analyze this business review or feedback. Focus on:
- Customer satisfaction level
- Specific complaints or praise
- Service quality indicators
- Product quality mentions
- Recommendation likelihood

Provide JSON response with sentiment, confidence, key issues, and actionable insights.`,
      description: 'Specialized for business reviews and feedback'
    },
    {
      name: 'Social Media Analysis',
      prompt: `Analyze this social media post considering:
- Emotional tone and intensity
- Sarcasm or irony detection
- Trending sentiment
- Engagement potential
- Viral characteristics

Return JSON with sentiment analysis optimized for social media content.`,
      description: 'Optimized for social media posts and content'
    },
    {
      name: 'News Article Analysis',
      prompt: `Analyze the sentiment of this news content focusing on:
- Objectivity vs bias
- Emotional language usage
- Political or social implications
- Public reaction potential
- Overall news sentiment

Provide structured JSON analysis for news content.`,
      description: 'Tailored for news articles and journalistic content'
    }
  ];

  // Load saved prompts from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('sentimentAnalysisPrompts');
    if (saved) {
      try {
        setSavedPrompts(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved prompts:', error);
      }
    }
  }, []);

  // Save prompts to localStorage
  const savePromptsToStorage = (prompts) => {
    try {
      localStorage.setItem('sentimentAnalysisPrompts', JSON.stringify(prompts));
    } catch (error) {
      console.error('Error saving prompts:', error);
    }
  };

  // Handle comparison analysis
  const handleCompareAnalysis = async () => {
    if (!testText.trim()) {
      alert('Please enter test text to analyze');
      return;
    }

    setIsComparing(true);
    setOriginalResult(null);
    setCustomResult(null);

    try {
      // Analyze with default prompt
      const originalAnalysis = await analyzeText(testText);
      setOriginalResult(originalAnalysis);

      // Analyze with custom prompt if provided
      if (customPrompt.trim()) {
        const customAnalysis = await analyzeText(testText, customPrompt);
        setCustomResult(customAnalysis);
      }
    } catch (error) {
      alert(`Analysis failed: ${error.message}`);
    } finally {
      setIsComparing(false);
    }
  };

  // Save custom prompt
  const saveCustomPrompt = () => {
    if (!promptName.trim() || !customPrompt.trim()) {
      alert('Please enter both prompt name and content');
      return;
    }

    const newPrompt = {
      id: Date.now(),
      name: promptName.trim(),
      prompt: customPrompt.trim(),
      description: `Custom prompt created on ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString()
    };

    const updatedPrompts = [...savedPrompts, newPrompt];
    setSavedPrompts(updatedPrompts);
    savePromptsToStorage(updatedPrompts);
    setPromptName('');
    alert('Prompt saved successfully!');
  };

  // Load prompt from library
  const loadPrompt = (prompt, index) => {
    setCustomPrompt(prompt.prompt);
    setSelectedPromptIndex(index);
  };

  // Delete saved prompt
  const deletePrompt = (id) => {
    if (confirm('Are you sure you want to delete this prompt?')) {
      const updatedPrompts = savedPrompts.filter(p => p.id !== id);
      setSavedPrompts(updatedPrompts);
      savePromptsToStorage(updatedPrompts);
    }
  };

  // Get result comparison
  const getResultComparison = () => {
    if (!originalResult || !customResult) return null;

    return {
      sentimentMatch: originalResult.result.sentiment === customResult.result.sentiment,
      confidenceDiff: (customResult.result.confidence - originalResult.result.confidence),
      scoreDiff: (customResult.result.score - originalResult.result.score),
      keywordOverlap: originalResult.result.keywords.filter(k => 
        customResult.result.keywords.includes(k)
      ).length
    };
  };

  const comparison = getResultComparison();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Prompt Editor */}
      <Card title="Custom Prompt Editor" subtitle="Create and test custom analysis prompts">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Prompt Name Input */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px' }}>
            <input
              type="text"
              value={promptName}
              onChange={(e) => setPromptName(e.target.value)}
              placeholder="Enter prompt name..."
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            <Button
              variant="secondary"
              onClick={saveCustomPrompt}
              disabled={!promptName.trim() || !customPrompt.trim()}
              size="sm"
            >
              💾 Save Prompt
            </Button>
          </div>

          {/* Custom Prompt Textarea */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: 500, 
              color: '#374151', 
              marginBottom: '8px' 
            }}>
              Custom Prompt Content
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter your custom analysis prompt here..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'monospace',
                resize: 'vertical',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              Tip: Include instructions for JSON format response with sentiment, confidence, score, keywords, and reasoning
            </div>
          </div>

          {/* Test Text Input */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: 500, 
              color: '#374151', 
              marginBottom: '8px' 
            }}>
              Test Text for Comparison
            </label>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Enter text to test both default and custom prompts..."
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                resize: 'vertical',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              variant="primary"
              onClick={handleCompareAnalysis}
              loading={isComparing}
              disabled={!testText.trim() || isAnalyzing}
            >
              {isComparing ? 'Comparing...' : '🔄 Compare Analysis'}
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => {
                setCustomPrompt('');
                setTestText('');
                setOriginalResult(null);
                setCustomResult(null);
                setSelectedPromptIndex(-1);
              }}
              disabled={isComparing}
            >
              🗑️ Clear All
            </Button>
          </div>
        </div>
      </Card>

      {/* Prompt Library */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Default Prompts */}
        <Card title="Default Prompt Library" subtitle="Pre-built prompts for different use cases">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {defaultPrompts.map((prompt, index) => (
              <div
                key={index}
                style={{
                  padding: '12px',
                  border: selectedPromptIndex === index ? '2px solid #2563eb' : '1px solid #e5e7eb',
                  borderRadius: '6px',
                  backgroundColor: selectedPromptIndex === index ? '#f0f9ff' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => loadPrompt(prompt, index)}
                onMouseOver={(e) => {
                  if (selectedPromptIndex !== index) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedPromptIndex !== index) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827', marginBottom: '4px' }}>
                  {prompt.name}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.4 }}>
                  {prompt.description}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Saved Custom Prompts */}
        <Card title="Saved Custom Prompts" subtitle={`Your custom prompts (${savedPrompts.length})`}>
          {savedPrompts.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '20px', 
              color: '#6b7280' 
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💾</div>
              <div>No saved prompts yet</div>
              <div style={{ fontSize: '12px' }}>Create and save custom prompts above</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {savedPrompts.map((prompt, index) => (
                <div
                  key={prompt.id}
                  style={{
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    backgroundColor: 'white'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div 
                      style={{ flex: 1, cursor: 'pointer' }}
                      onClick={() => loadPrompt(prompt, index + defaultPrompts.length)}
                    >
                      <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827', marginBottom: '4px' }}>
                        {prompt.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {prompt.description}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePrompt(prompt.id);
                      }}
                      style={{
                        padding: '4px',
                        border: 'none',
                        background: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      title="Delete prompt"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Comparison Results */}
      {(originalResult || customResult) && (
        <Card title="Analysis Comparison" subtitle="Compare results between default and custom prompts">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            
            {/* Original Result */}
            {originalResult && (
              <div style={{
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>
                  📊 Default Prompt Result
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Sentiment:</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, textTransform: 'capitalize' }}>
                      {originalResult.result.sentiment}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Confidence:</span>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>
                      {Math.round(originalResult.result.confidence * 100)}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Score:</span>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>
                      {originalResult.result.score}
                    </span>
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Keywords:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {originalResult.result.keywords.map((keyword, i) => (
                        <span key={i} style={{
                          padding: '2px 6px',
                          fontSize: '11px',
                          backgroundColor: '#e5e7eb',
                          borderRadius: '3px'
                        }}>
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Result */}
            {customResult && (
              <div style={{
                padding: '16px',
                backgroundColor: '#f0f9ff',
                borderRadius: '6px',
                border: '1px solid #0ea5e9'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>
                  🎛️ Custom Prompt Result
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Sentiment:</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, textTransform: 'capitalize' }}>
                      {customResult.result.sentiment}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Confidence:</span>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>
                      {Math.round(customResult.result.confidence * 100)}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Score:</span>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>
                      {customResult.result.score}
                    </span>
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Keywords:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {customResult.result.keywords.map((keyword, i) => (
                        <span key={i} style={{
                          padding: '2px 6px',
                          fontSize: '11px',
                          backgroundColor: '#dbeafe',
                          borderRadius: '3px'
                        }}>
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Comparison Summary */}
          {comparison && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #10b981',
              borderRadius: '6px'
            }}>
              <h5 style={{ fontSize: '14px', fontWeight: 600, color: '#047857', marginBottom: '8px' }}>
                📊 Comparison Summary
              </h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '12px' }}>
                <div>
                  <span style={{ color: '#6b7280' }}>Sentiment Match:</span>
                  <span style={{ 
                    marginLeft: '8px', 
                    fontWeight: 600, 
                    color: comparison.sentimentMatch ? '#059669' : '#dc2626' 
                  }}>
                    {comparison.sentimentMatch ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>Confidence Diff:</span>
                  <span style={{ marginLeft: '8px', fontWeight: 600 }}>
                    {comparison.confidenceDiff > 0 ? '+' : ''}{Math.round(comparison.confidenceDiff * 100)}%
                  </span>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>Score Diff:</span>
                  <span style={{ marginLeft: '8px', fontWeight: 600 }}>
                    {comparison.scoreDiff > 0 ? '+' : ''}{comparison.scoreDiff.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>Keyword Overlap:</span>
                  <span style={{ marginLeft: '8px', fontWeight: 600 }}>
                    {comparison.keywordOverlap} words
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Instructions */}
      <Card title="📋 Prompt Tuning Guide" style={{ backgroundColor: '#fefce8', border: '1px solid #f59e0b' }}>
        <div style={{ color: '#92400e', fontSize: '14px', lineHeight: 1.6 }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#92400e' }}>
            How to create effective prompts:
          </h4>
          <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px' }}>
            <li>Be specific about the desired output format (JSON recommended)</li>
            <li>Include clear instructions for sentiment classification</li>
            <li>Specify confidence levels and scoring ranges</li>
            <li>Request keyword extraction and reasoning</li>
            <li>Consider your specific use case (reviews, social media, news, etc.)</li>
          </ul>
          
          <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#92400e' }}>
            Testing tips:
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Test with various types of text (positive, negative, neutral)</li>
            <li>Compare results with the default prompt</li>
            <li>Save prompts that work well for future use</li>
            <li>Iterate and refine based on comparison results</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default PromptTuner;