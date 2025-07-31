import React, { useState } from 'react';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import RealTimeAnalyzer from './components/dashboard/RealTimeAnalyzer';
import BatchAnalyzer from './components/dashboard/BatchAnalyzer';
import FileUploader from './components/dashboard/FileUploader';
import PromptTuner from './components/dashboard/PromptTuner';
import PromptLibrary from './components/dashboard/PromptLibrary';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, analyzer, batch, upload, tuner, library

  const tabConfig = [
    { id: 'dashboard', label: '🏠 Dashboard', component: null },
    { id: 'analyzer', label: '🔍 Real-time', component: RealTimeAnalyzer },
    { id: 'batch', label: '📝 Batch', component: BatchAnalyzer },
    { id: 'upload', label: '📁 Upload', component: FileUploader },
    { id: 'tuner', label: '⚙️ Tuner', component: PromptTuner },
    { id: 'library', label: '📚 Library', component: PromptLibrary }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      margin: 0,
      padding: 0
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 700, 
              color: '#111827',
              margin: 0
            }}>
              Sentiment Insight Dashboard
            </h1>
            <span style={{
              marginLeft: '8px',
              padding: '4px 8px',
              fontSize: '12px',
              backgroundColor: '#dbeafe',
              color: '#1d4ed8',
              borderRadius: '9999px'
            }}>
              GPT-4 Pro
            </span>
          </div>
          
          {/* Navigation Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '2px' }}>
              {tabConfig.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '6px 10px',
                    fontSize: '12px',
                    fontWeight: 500,
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    backgroundColor: activeTab === tab.id ? '#2563eb' : 'transparent',
                    color: activeTab === tab.id ? 'white' : '#374151',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>August 2024</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}></div>
                <span style={{ fontSize: '12px', color: '#4b5563' }}>Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '32px 16px' 
      }}>
        
        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              
              {/* Welcome Card */}
              <Card 
                title="Advanced Sentiment Analysis Suite" 
                subtitle="GPT-4 powered comprehensive sentiment insights with professional prompt engineering"
                style={{ gridColumn: 'span 2' }}
              >
                <div>
                  <p style={{ color: '#4b5563', marginBottom: '16px' }}>
                    Complete sentiment analysis platform featuring real-time analysis, batch processing, 
                    file upload capabilities, advanced prompt tuning, and a comprehensive prompt library 
                    with industry-specific templates.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <Button 
                      variant="primary"
                      onClick={() => setActiveTab('analyzer')}
                    >
                      🚀 Real-time Analysis
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={() => setActiveTab('batch')}
                    >
                      📝 Batch Processing
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={() => setActiveTab('tuner')}
                    >
                      ⚙️ Prompt Tuning
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={() => setActiveTab('library')}
                    >
                      📚 Prompt Library
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Enhanced Status Card */}
              <Card title="System Status">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#4b5563' }}>Service Status</span>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#059669' }}>🟢 Online</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#4b5563' }}>Analysis Engine</span>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>🎭 Smart Mock</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#4b5563' }}>Avg Response</span>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>⚡ ~1.2s</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#4b5563' }}>File Support</span>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>📄 TXT/CSV/JSON</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#4b5563' }}>Prompt Library</span>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>📚 15+ Templates</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Enhanced Features Preview */}
            <div style={{
              marginTop: '32px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {[
                { 
                  title: 'Real-time Analysis', 
                  desc: 'Instant sentiment analysis with interactive charts and emotion radar', 
                  color: '#dbeafe', 
                  emoji: '⚡',
                  onClick: () => setActiveTab('analyzer'),
                  features: ['Live results', 'Interactive charts', 'Emotion breakdown']
                },
                { 
                  title: 'Batch Processing', 
                  desc: 'Analyze up to 50 texts simultaneously with progress tracking', 
                  color: '#dcfce7', 
                  emoji: '📝',
                  onClick: () => setActiveTab('batch'),
                  features: ['50 texts max', 'Progress tracking', 'Summary stats']
                },
                { 
                  title: 'File Upload', 
                  desc: 'Process large datasets from TXT, CSV, and JSON files', 
                  color: '#fef3c7', 
                  emoji: '📁',
                  onClick: () => setActiveTab('upload'),
                  features: ['Multiple formats', '100+ texts', 'Export results']
                },
                { 
                  title: 'Prompt Tuning', 
                  desc: 'Create and test custom analysis prompts with A/B comparison', 
                  color: '#f3e8ff', 
                  emoji: '⚙️',
                  onClick: () => setActiveTab('tuner'),
                  features: ['Custom prompts', 'A/B testing', 'Save variations']
                },
                { 
                  title: 'Prompt Library', 
                  desc: 'Professional templates for business, social, news, and academic use', 
                  color: '#ecfdf5', 
                  emoji: '📚',
                  onClick: () => setActiveTab('library'),
                  features: ['15+ templates', 'Industry-specific', 'Copy & customize']
                },
                { 
                  title: 'Advanced Charts', 
                  desc: 'Visualize results with line charts, radar plots, and statistics', 
                  color: '#fef2f2', 
                  emoji: '📊',
                  onClick: () => setActiveTab('analyzer'),
                  features: ['Multiple chart types', 'Interactive elements', 'Export data']
                }
              ].map((feature, index) => (
                <Card 
                  key={index} 
                  title={feature.title} 
                  style={{ 
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={feature.onClick}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px 0 rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={{
                    width: '56px',
                    height: '56px',
                    backgroundColor: feature.color,
                    borderRadius: '12px',
                    margin: '0 auto 16px auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px'
                  }}>
                    {feature.emoji}
                  </div>
                  <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '12px', lineHeight: 1.4 }}>
                    {feature.desc}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {feature.features.map((feat, i) => (
                      <div key={i} style={{ fontSize: '11px', color: '#6b7280' }}>
                        ✓ {feat}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {/* Enhanced Quick Start */}
            <Card 
              title="🚀 Professional Features" 
              style={{ 
                marginTop: '32px',
                backgroundColor: '#f0f9ff',
                border: '1px solid #0ea5e9'
              }}
            >
              <div style={{ color: '#0369a1' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#0369a1' }}>
                  Choose your analysis workflow:
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  
                  <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 600, marginBottom: '8px', color: '#111827' }}>
                      🔍 Real-time Analysis
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                      Perfect for testing individual texts with detailed insights
                    </div>
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                      • Interactive charts • Emotion radar • Keyword analysis
                    </div>
                  </div>
                  
                  <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 600, marginBottom: '8px', color: '#111827' }}>
                      📝 Batch + Upload
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                      Ideal for processing multiple texts and large datasets
                    </div>
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                      • Up to 100 texts • File support • Export results
                    </div>
                  </div>
                  
                  <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 600, marginBottom: '8px', color: '#111827' }}>
                      ⚙️ Prompt Engineering
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                      Advanced users: customize analysis with professional prompts
                    </div>
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                      • Custom prompts • A/B testing • Industry templates
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}

        {/* Dynamic Content Based on Active Tab */}
        {activeTab !== 'dashboard' && (() => {
          const currentTab = tabConfig.find(tab => tab.id === activeTab);
          const ComponentToRender = currentTab?.component;
          
          if (!ComponentToRender) return null;

          const titles = {
            analyzer: { title: '🔍 Real-time Sentiment Analyzer', desc: 'Enter any text to get detailed sentiment analysis results instantly' },
            batch: { title: '📝 Batch Sentiment Analyzer', desc: 'Analyze multiple texts simultaneously for efficient processing' },
            upload: { title: '📁 File Upload Analyzer', desc: 'Upload text files (TXT, CSV, JSON) for large-scale sentiment analysis' },
            tuner: { title: '⚙️ Prompt Tuner', desc: 'Create, test, and optimize custom analysis prompts with A/B comparison' },
            library: { title: '📚 Professional Prompt Library', desc: 'Industry-specific prompt templates for business, social media, news, and academic use' }
          };

          const currentTitle = titles[activeTab];

          return (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 600, color: '#111827', margin: '0 0 8px 0' }}>
                  {currentTitle.title}
                </h2>
                <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
                  {currentTitle.desc}
                </p>
              </div>
              <ComponentToRender />
            </div>
          );
        })()}
      </main>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
}

export default App;