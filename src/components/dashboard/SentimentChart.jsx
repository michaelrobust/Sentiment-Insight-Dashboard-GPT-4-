import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Card from '../ui/Card';

const SentimentChart = ({ 
  trendData = [], 
  distributionData = [], 
  chartType = 'line' // 'line', 'bar', 'pie'
}) => {
  
  // Get sentiment color
  const getSentimentColor = (sentiment) => {
    const colors = {
      positive: '#10b981',
      negative: '#ef4444',
      neutral: '#6b7280'
    };
    return colors[sentiment] || '#6b7280';
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 4px 0' }}>
            Analysis #{label}
          </p>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px 0' }}>
            {data.text}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '12px' }}>
              <span style={{ color: getSentimentColor(data.sentiment) }}>
                Sentiment: {data.sentiment === 'positive' ? 'Positive' : 
                           data.sentiment === 'negative' ? 'Negative' : 'Neutral'}
              </span>
            </div>
            <div style={{ fontSize: '12px' }}>
              Score: <span style={{ fontWeight: 600 }}>{data.score}</span>
            </div>
            <div style={{ fontSize: '12px' }}>
              Confidence: <span style={{ fontWeight: 600 }}>{Math.round(data.confidence * 100)}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Pie Chart Tooltip
  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '8px 12px',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: data.payload.color }}>
            {data.name}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Count: {data.value} ({data.payload.percentage}%)
          </div>
        </div>
      );
    }
    return null;
  };

  // Line Chart
  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis 
          dataKey="index" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#6b7280' }}
        />
        <YAxis 
          domain={[-1, 1]}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#6b7280' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="score" 
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  // Bar Chart
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis 
          dataKey="index" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#6b7280' }}
        />
        <YAxis 
          domain={[-1, 1]}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#6b7280' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="score" 
          fill="#2563eb"
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  // Pie Chart
  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={distributionData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percentage }) => `${name} ${percentage}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {distributionData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<PieTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );

  // Chart titles and descriptions
  const getChartInfo = () => {
    const info = {
      line: {
        title: 'Sentiment Trend Line Chart',
        description: 'Shows sentiment score changes over time'
      },
      bar: {
        title: 'Sentiment Score Bar Chart',
        description: 'Displays sentiment scores in bar format for each analysis'
      },
      pie: {
        title: 'Sentiment Distribution Pie Chart',
        description: 'Shows the proportion of positive, negative, and neutral sentiments'
      }
    };
    return info[chartType] || info.line;
  };

  const chartInfo = getChartInfo();

  // No data state
  if ((chartType === 'pie' && distributionData.length === 0) || 
      (chartType !== 'pie' && trendData.length === 0)) {
    return (
      <Card title={chartInfo.title} subtitle={chartInfo.description}>
        <div style={{
          height: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6b7280'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>
            No Data Available
          </div>
          <div style={{ fontSize: '14px', textAlign: 'center' }}>
            Start analyzing text to see charts
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card title={chartInfo.title} subtitle={chartInfo.description}>
      <div style={{ width: '100%', height: '300px' }}>
        {chartType === 'line' && renderLineChart()}
        {chartType === 'bar' && renderBarChart()}
        {chartType === 'pie' && renderPieChart()}
      </div>
      
      {/* Chart Legend */}
      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        backgroundColor: '#f8fafc', 
        borderRadius: '6px',
        fontSize: '12px',
        color: '#6b7280'
      }}>
        {chartType === 'line' && (
          <div>
            📈 <strong>Trend Analysis:</strong> Score ranges from -1 (extremely negative) to +1 (extremely positive), 0 is neutral
          </div>
        )}
        {chartType === 'bar' && (
          <div>
            📊 <strong>Score Distribution:</strong> Each bar represents one analysis result, height corresponds to sentiment score
          </div>
        )}
        {chartType === 'pie' && (
          <div>
            🥧 <strong>Sentiment Ratio:</strong> Shows the proportion of different sentiment types across all analyses
          </div>
        )}
      </div>
    </Card>
  );
};

export default SentimentChart;