import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const PromptLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  // Comprehensive prompt library organized by categories
  const promptLibrary = {
    business: [
      {
        id: 'business-1',
        name: 'Customer Review Analysis',
        category: 'business',
        description: 'Specialized for analyzing customer reviews and feedback',
        prompt: `Analyze this customer review with focus on:
- Overall satisfaction level (1-10 scale)
- Specific product/service aspects mentioned
- Pain points and compliments
- Likelihood to recommend
- Actionable insights for business improvement

Respond in JSON format with sentiment, confidence, score, key_aspects, satisfaction_level, recommendation_likelihood, and business_insights.`,
        tags: ['reviews', 'customer satisfaction', 'business intelligence'],
        useCase: 'E-commerce reviews, service feedback, product evaluations'
      },
      {
        id: 'business-2',
        name: 'Employee Feedback Analysis',
        category: 'business',
        description: 'For analyzing employee surveys and workplace feedback',
        prompt: `Analyze this employee feedback focusing on:
- Job satisfaction indicators
- Management and leadership sentiment
- Work environment concerns
- Career development mentions
- Team dynamics references

Return JSON with sentiment analysis plus workplace_satisfaction, leadership_sentiment, growth_opportunities, and retention_risk_factors.`,
        tags: ['hr', 'employee satisfaction', 'workplace'],
        useCase: 'HR surveys, exit interviews, team feedback'
      }
    ],
    social: [
      {
        id: 'social-1',
        name: 'Social Media Post Analysis',
        category: 'social',
        description: 'Optimized for social media content and posts',
        prompt: `Analyze this social media content considering:
- Emotional tone and intensity
- Viral potential and engagement likelihood
- Community sentiment indicators
- Trend alignment
- Influencer impact potential

Provide JSON response with sentiment, virality_score, engagement_prediction, community_impact, and trending_topics.`,
        tags: ['social media', 'viral content', 'engagement'],
        useCase: 'Twitter posts, Facebook updates, Instagram captions'
      },
      {
        id: 'social-2',
        name: 'Comment Thread Analysis',
        category: 'social',
        description: 'For analyzing comment sections and discussions',
        prompt: `Analyze this comment or discussion thread entry for:
- Conversational tone (constructive/toxic/neutral)
- Agreement/disagreement with main topic
- Emotional escalation potential
- Community building vs. divisive language
- Moderation recommendations

Return JSON with sentiment, toxicity_level, constructiveness_score, escalation_risk, and moderation_advice.`,
        tags: ['comments', 'moderation', 'community'],
        useCase: 'YouTube comments, Reddit threads, forum discussions'
      }
    ],
    news: [
      {
        id: 'news-1',
        name: 'News Article Sentiment',
        category: 'news',
        description: 'For analyzing news articles and journalistic content',
        prompt: `Analyze this news content focusing on:
- Editorial bias and objectivity
- Emotional language usage
- Public sentiment implications
- Political or social impact
- Factual vs. opinion content ratio

Provide JSON with sentiment, bias_level, objectivity_score, public_impact_potential, and content_type_analysis.`,
        tags: ['journalism', 'bias detection', 'news analysis'],
        useCase: 'News articles, press releases, editorial content'
      },
      {
        id: 'news-2',
        name: 'Press Release Analysis',
        category: 'news',
        description: 'Specialized for corporate communications and PR',
        prompt: `Analyze this press release or corporate communication for:
- Corporate messaging tone
- Market confidence indicators
- Stakeholder impact assessment
- Crisis communication elements
- Public relations effectiveness

Return JSON with sentiment, corporate_confidence, stakeholder_impact, crisis_indicators, and pr_effectiveness_score.`,
        tags: ['corporate', 'pr', 'stakeholder communication'],
        useCase: 'Press releases, corporate announcements, investor communications'
      }
    ],
    academic: [
      {
        id: 'academic-1',
        name: 'Research Paper Analysis',
        category: 'academic',
        description: 'For analyzing academic and research content',
        prompt: `Analyze this academic or research content examining:
- Authoritative tone and confidence
- Research methodology sentiment
- Conclusion certainty levels
- Peer review readiness
- Academic impact potential

Provide JSON with sentiment, authority_level, methodology_confidence, conclusion_strength, and academic_rigor_score.`,
        tags: ['research', 'academic', 'methodology'],
        useCase: 'Research papers, academic articles, thesis content'
      },
      {
        id: 'academic-2',
        name: 'Student Feedback Analysis',
        category: 'academic',
        description: 'For analyzing student evaluations and feedback',
        prompt: `Analyze this student feedback focusing on:
- Learning satisfaction levels
- Course content sentiment
- Instructor effectiveness perception
- Difficulty and engagement balance
- Improvement suggestions

Return JSON with sentiment, learning_satisfaction, content_quality, instructor_rating, difficulty_level, and improvement_areas.`,
        tags: ['education', 'student feedback', 'course evaluation'],
        useCase: 'Course evaluations, student surveys, educational feedback'
      }
    ],
    healthcare: [
      {
        id: 'healthcare-1',
        name: 'Patient Feedback Analysis',
        category: 'healthcare',
        description: 'For analyzing patient reviews and healthcare feedback',
        prompt: `Analyze this patient feedback with attention to:
- Care quality satisfaction
- Staff interaction sentiment
- Facility and service aspects
- Treatment outcome satisfaction
- Trust and confidence levels

Provide JSON with sentiment, care_satisfaction, staff_sentiment, facility_rating, treatment_confidence, and trust_indicators.`,
        tags: ['patient care', 'healthcare quality', 'medical feedback'],
        useCase: 'Patient reviews, healthcare surveys, medical service feedback'
      }
    ]
  };

  // Get all prompts or filter by category
  const getFilteredPrompts = () => {
    let prompts = [];
    
    if (selectedCategory === 'all') {
      prompts = Object.values(promptLibrary).flat();
    } else {
      prompts = promptLibrary[selectedCategory] || [];
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      prompts = prompts.filter(prompt => 
        prompt.name.toLowerCase().includes(term) ||
        prompt.description.toLowerCase().includes(term) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(term)) ||
        prompt.useCase.toLowerCase().includes(term)
      );
    }

    return prompts;
  };

  // Get category counts
  const getCategoryCounts = () => {
    const counts = {};
    Object.entries(promptLibrary).forEach(([category, prompts]) => {
      counts[category] = prompts.length;
    });
    return counts;
  };

  // Copy prompt to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Prompt copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
      alert('Failed to copy prompt');
    });
  };

  // Export prompts as JSON
  const exportPrompts = () => {
    const dataStr = JSON.stringify(promptLibrary, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sentiment_analysis_prompts.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredPrompts = getFilteredPrompts();
  const categoryCounts = getCategoryCounts();
  const categories = [
    { id: 'all', name: 'All Categories', count: Object.values(promptLibrary).flat().length },
    { id: 'business', name: 'Business', count: categoryCounts.business },
    { id: 'social', name: 'Social Media', count: categoryCounts.social },
    { id: 'news', name: 'News & Media', count: categoryCounts.news },
    { id: 'academic', name: 'Academic', count: categoryCounts.academic },
    { id: 'healthcare', name: 'Healthcare', count: categoryCounts.healthcare }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header and Search */}
      <Card title="Prompt Library" subtitle="Professional prompt templates for different industries and use cases">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Search Bar */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search prompts by name, description, tags, or use case..."
              style={{
                flex: 1,
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
              onClick={exportPrompts}
              size="sm"
            >
              📥 Export All
            </Button>
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 500,
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: selectedCategory === category.id ? '#2563eb' : 'white',
                  color: selectedCategory === category.id ? 'white' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''} found
            {searchTerm && ` for "${searchTerm}"`}
          </div>
        </div>
      </Card>

      {/* Prompt Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {filteredPrompts.map(prompt => (
          <Card
            key={prompt.id}
            title={prompt.name}
            subtitle={prompt.description}
            style={{
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: selectedPrompt?.id === prompt.id ? '2px solid #2563eb' : '1px solid #e5e7eb'
            }}
            onClick={() => setSelectedPrompt(selectedPrompt?.id === prompt.id ? null : prompt)}
            onMouseOver={(e) => {
              if (selectedPrompt?.id !== prompt.id) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseOut={(e) => {
              if (selectedPrompt?.id !== prompt.id) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Category Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  padding: '2px 8px',
                  fontSize: '11px',
                  fontWeight: 500,
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  borderRadius: '12px',
                  textTransform: 'uppercase'
                }}>
                  {prompt.category}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(prompt.prompt);
                  }}
                  style={{
                    padding: '4px 8px',
                    fontSize: '11px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                  title="Copy prompt"
                >
                  📋 Copy
                </button>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {prompt.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '2px 6px',
                      fontSize: '10px',
                      backgroundColor: '#dbeafe',
                      color: '#1d4ed8',
                      borderRadius: '3px'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Use Case */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                  Use Case:
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280', lineHeight: 1.4 }}>
                  {prompt.useCase}
                </div>
              </div>

              {/* Expand/Collapse Indicator */}
              <div style={{ 
                textAlign: 'center', 
                fontSize: '12px', 
                color: '#9ca3af',
                borderTop: '1px solid #f3f4f6',
                paddingTop: '8px'
              }}>
                {selectedPrompt?.id === prompt.id ? '▲ Click to collapse' : '▼ Click to view prompt'}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredPrompts.length === 0 && (
        <Card title="No Prompts Found" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>
              No prompts match your search criteria
            </div>
            <div style={{ fontSize: '14px' }}>
              Try adjusting your search terms or category filter
            </div>
          </div>
        </Card>
      )}

      {/* Selected Prompt Detail */}
      {selectedPrompt && (
        <Card 
          title={`${selectedPrompt.name} - Full Prompt`}
          subtitle="Copy and customize this prompt for your needs"
          style={{ backgroundColor: '#f0f9ff', border: '2px solid #2563eb' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Prompt Content */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                  Prompt Content:
                </label>
              </div>
              <textarea
                value={selectedPrompt.prompt}
                readOnly
                style={{
                  width: '100%',
                  minHeight: '150px',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  backgroundColor: '#f8fafc',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                variant="primary"
                onClick={() => copyToClipboard(selectedPrompt.prompt)}
              >
                📋 Copy Full Prompt
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  const mailtoLink = `mailto:?subject=Sentiment Analysis Prompt: ${selectedPrompt.name}&body=${encodeURIComponent(selectedPrompt.prompt)}`;
                  window.open(mailtoLink);
                }}
              >
                📧 Share via Email
              </Button>
              <Button
                variant="secondary"
                onClick={() => setSelectedPrompt(null)}
              >
                ✕ Close
              </Button>
            </div>

            {/* Additional Info */}
            <div style={{
              padding: '12px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #10b981',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#047857'
            }}>
              <strong>💡 Pro Tip:</strong> You can copy this prompt and modify it in the Prompt Tuner 
              to create custom variations for your specific needs. Test different versions to find 
              what works best for your use case.
            </div>
          </div>
        </Card>
      )}

      {/* Usage Instructions */}
      <Card title="📚 How to Use the Prompt Library" style={{ backgroundColor: '#fefce8', border: '1px solid #f59e0b' }}>
        <div style={{ color: '#92400e', fontSize: '14px', lineHeight: 1.6 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#92400e' }}>
                🎯 Finding the Right Prompt:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '16px' }}>
                <li>Browse by category for your industry</li>
                <li>Use search to find specific features</li>
                <li>Check tags for relevant keywords</li>
                <li>Review use cases for applicability</li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#92400e' }}>
                🔧 Customizing Prompts:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '16px' }}>
                <li>Copy prompts to Prompt Tuner</li>
                <li>Modify for your specific needs</li>
                <li>Test with sample data</li>
                <li>Save successful variations</li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#92400e' }}>
                💾 Managing Prompts:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '16px' }}>
                <li>Export library for backup</li>
                <li>Share prompts with team</li>
                <li>Version control important prompts</li>
                <li>Document custom modifications</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PromptLibrary;