import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../ui/Card';

const EmotionRadar = ({ emotionData = null, showComparison = false, comparisonData = null }) => {
  
  // Emotion label mapping
  const emotionLabels = {
    joy: { label: 'Joy', color: '#10b981', icon: '😊' },
    anger: { label: 'Anger', color: '#ef4444', icon: '😠' },
    sadness: { label: 'Sadness', color: '#6366f1', icon: '😢' },
    fear: { label: 'Fear', color: '#f59e0b', icon: '😨' }
  };

  // Prepare radar chart data
  const prepareRadarData = (emotions) => {
    if (!emotions) return [];
    
    return Object.entries(emotions).map(([emotion, value]) => ({
      emotion: emotionLabels[emotion]?.label || emotion,
      value: Math.round(value * 100), // Convert to percentage
      fullMark: 100,
      icon: emotionLabels[emotion]?.icon || '😐'
    }));
  };

  const radarData = prepareRadarData(emotionData);
  const comparisonRadarData = prepareRadarData(comparisonData);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '8px 12px',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
            {payload[0].payload.icon} {label}
          </div>
          {payload.map((entry, index) => (
            <div key={index} style={{ fontSize: '12px', color: entry.color }}>
              {entry.name}: {entry.value}%
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // No data state
  if (!emotionData) {
    return (
      <Card title="Emotion Radar Chart" subtitle="Multi-dimensional emotion intensity analysis">
        <div style={{
          height: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6b7280'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
          <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>
            No Emotion Data
          </div>
          <div style={{ fontSize: '14px', textAlign: 'center' }}>
            Select an analysis result to view emotion radar chart
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      title="Emotion Radar Chart" 
      subtitle={showComparison ? "Emotion Comparison Analysis" : "Multi-dimensional emotion intensity analysis"}
    >
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis 
              dataKey="emotion" 
              tick={{ fontSize: 12, fill: '#374151' }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fontSize: 10, fill: '#6b7280' }}
            />
            <Radar
              name="Current Analysis"
              dataKey="value"
              stroke="#2563eb"
              fill="#2563eb"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            {showComparison && comparisonData && (
              <Radar
                name="Comparison Analysis"
                dataKey="value"
                stroke="#059669"
                fill="#059669"
                fillOpacity={0.2}
                strokeWidth={2}
                data={comparisonRadarData}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Emotion Value Details */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
          gap: '12px' 
        }}>
          {radarData.map((item, index) => {
            const emotionKey = Object.keys(emotionData)[index];
            const color = emotionLabels[emotionKey]?.color || '#6b7280';
            
            return (
              <div
                key={index}
                style={{
                  padding: '8px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  textAlign: 'center',
                  border: '1px solid #e5e7eb'
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                  {item.icon}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '2px' }}>
                  {item.emotion}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color }}>
                  {item.value}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        backgroundColor: '#f0f9ff', 
        borderRadius: '6px',
        fontSize: '12px',
        color: '#0369a1'
      }}>
        <div style={{ fontWeight: 600, marginBottom: '4px' }}>
          🎯 <strong>Radar Chart Explanation:</strong>
        </div>
        <div>
          Each axis represents a basic emotion, with values ranging from 0-100%. 
          The larger the shape area, the higher the emotion intensity, 
          providing an intuitive view of the relative strength of various emotions in the text.
        </div>
      </div>

      {/* Comparison explanation */}
      {showComparison && comparisonData && (
        <div style={{ 
          marginTop: '8px', 
          padding: '8px 12px', 
          backgroundColor: '#ecfdf5', 
          borderRadius: '6px',
          fontSize: '12px',
          color: '#047857'
        }}>
          <strong>Comparison Mode:</strong> 
          Blue area represents current analysis, green area represents comparison analysis, 
          overlapping areas show emotion similarity.
        </div>
      )}
    </Card>
  );
};

export default EmotionRadar;