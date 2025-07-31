import { useState, useCallback, useRef, useEffect } from 'react';
import openaiService from '../services/openaiService';

export const useSentimentAnalysis = () => {
  const [results, setResults] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [statistics, setStatistics] = useState({
    totalAnalyses: 0,
    averageProcessingTime: 0,
    sentimentDistribution: {
      positive: 0,
      negative: 0,
      neutral: 0
    }
  });

  const abortControllerRef = useRef(null);

  // Check service status on initialization
  useEffect(() => {
    const checkServiceStatus = async () => {
      try {
        const status = await openaiService.checkStatus();
        console.log('🔍 Service Status:', status);
      } catch (error) {
        console.error('❌ Service check failed:', error);
      }
    };
    
    checkServiceStatus();
  }, []);

  // Analyze single text
  const analyzeText = useCallback(async (text, customPrompt = null) => {
    if (!text || !text.trim()) {
      throw new Error('Please enter text to analyze');
    }

    setIsAnalyzing(true);
    setCurrentAnalysis(null);

    try {
      console.log('🔄 Starting analysis:', text.substring(0, 50) + '...');
      
      // Create new AbortController (for future cancellation feature)
      abortControllerRef.current = new AbortController();

      const result = await openaiService.analyzeSentiment(text.trim(), customPrompt);
      
      // Check if aborted
      if (abortControllerRef.current?.signal.aborted) {
        console.log('⏸️ Analysis aborted');
        return null;
      }

      const analysisRecord = {
        id: Date.now() + Math.random(), // Ensure uniqueness
        text: text.trim(),
        result,
        timestamp: new Date().toISOString(),
        customPrompt
      };

      console.log('✅ Analysis completed:', result);
      
      setCurrentAnalysis(analysisRecord);
      setResults(prev => [analysisRecord, ...prev].slice(0, 100)); // Keep last 100 records

      // Update statistics
      setStatistics(prev => {
        const newTotal = prev.totalAnalyses + 1;
        const newAvgTime = (prev.averageProcessingTime * prev.totalAnalyses + result.processingTime) / newTotal;
        
        const distribution = { ...prev.sentimentDistribution };
        distribution[result.sentiment]++;

        return {
          totalAnalyses: newTotal,
          averageProcessingTime: Math.round(newAvgTime),
          sentimentDistribution: distribution
        };
      });

      return analysisRecord;
    } catch (error) {
      console.error('❌ Analysis error:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
      abortControllerRef.current = null;
    }
  }, []);

  // Batch analysis
  const batchAnalyze = useCallback(async (texts, onProgress = null) => {
    if (!texts || texts.length === 0) {
      throw new Error('Please provide a list of texts to analyze');
    }

    setIsAnalyzing(true);
    const batchResults = [];

    try {
      console.log(`🔄 Starting batch analysis of ${texts.length} texts`);
      
      for (let i = 0; i < texts.length; i++) {
        const text = texts[i];
        
        if (text && text.trim()) {
          const result = await analyzeText(text.trim());
          
          if (result) {
            batchResults.push(result);
            onProgress && onProgress(i + 1, texts.length, result);
          }
        }

        // Add delay to avoid excessive frequency
        if (i < texts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      console.log(`✅ Batch analysis completed, processed ${batchResults.length} texts`);
      return batchResults;
    } catch (error) {
      console.error('❌ Batch analysis error:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, [analyzeText]);

  // Abort current analysis
  const abortAnalysis = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsAnalyzing(false);
      console.log('⏸️ Analysis aborted');
    }
  }, []);

  // Clear all results
  const clearResults = useCallback(() => {
    setResults([]);
    setCurrentAnalysis(null);
    setStatistics({
      totalAnalyses: 0,
      averageProcessingTime: 0,
      sentimentDistribution: {
        positive: 0,
        negative: 0,
        neutral: 0
      }
    });
    console.log('🗑️ All analysis results cleared');
  }, []);

  // Delete specific result
  const deleteResult = useCallback((id) => {
    setResults(prev => prev.filter(result => result.id !== id));
    
    // If deleted item is current analysis, clear it
    if (currentAnalysis?.id === id) {
      setCurrentAnalysis(null);
    }
    
    console.log(`🗑️ Analysis record deleted: ${id}`);
  }, [currentAnalysis]);

  // Get trend data for charts
  const getTrendData = useCallback(() => {
    return results
      .slice(0, 20) // Last 20 records
      .reverse()
      .map((record, index) => ({
        index: index + 1,
        sentiment: record.result.sentiment,
        score: record.result.score,
        confidence: record.result.confidence,
        timestamp: record.timestamp,
        text: record.text.substring(0, 30) + (record.text.length > 30 ? '...' : ''),
        id: record.id
      }));
  }, [results]);

  // Get sentiment distribution data for pie chart
  const getSentimentDistribution = useCallback(() => {
    const total = statistics.sentimentDistribution.positive + 
                  statistics.sentimentDistribution.negative + 
                  statistics.sentimentDistribution.neutral;
    
    if (total === 0) return [];

    return [
      {
        name: 'Positive',
        value: statistics.sentimentDistribution.positive,
        percentage: Math.round((statistics.sentimentDistribution.positive / total) * 100),
        color: '#10b981'
      },
      {
        name: 'Negative', 
        value: statistics.sentimentDistribution.negative,
        percentage: Math.round((statistics.sentimentDistribution.negative / total) * 100),
        color: '#ef4444'
      },
      {
        name: 'Neutral',
        value: statistics.sentimentDistribution.neutral,
        percentage: Math.round((statistics.sentimentDistribution.neutral / total) * 100),
        color: '#6b7280'
      }
    ].filter(item => item.value > 0); // Only show items with data
  }, [statistics]);

  // Get recent sentiment analysis summary
  const getRecentSummary = useCallback(() => {
    if (results.length === 0) return null;

    const recent = results.slice(0, 5);
    const avgConfidence = recent.reduce((sum, r) => sum + r.result.confidence, 0) / recent.length;
    const avgScore = recent.reduce((sum, r) => sum + r.result.score, 0) / recent.length;
    
    return {
      recentCount: recent.length,
      averageConfidence: Number(avgConfidence.toFixed(2)),
      averageScore: Number(avgScore.toFixed(2)),
      mostCommonSentiment: getMostCommonSentiment(recent),
      processingTime: statistics.averageProcessingTime
    };
  }, [results, statistics]);

  // Helper function: get most common sentiment
  const getMostCommonSentiment = (records) => {
    const counts = { positive: 0, negative: 0, neutral: 0 };
    records.forEach(r => counts[r.result.sentiment]++);
    
    return Object.entries(counts).reduce((a, b) => counts[a[0]] > counts[b[0]] ? a : b)[0];
  };

  return {
    // State
    results,
    isAnalyzing,
    currentAnalysis,
    statistics,

    // Action methods
    analyzeText,
    batchAnalyze,
    abortAnalysis,
    clearResults,
    deleteResult,

    // Data processing methods
    getTrendData,
    getSentimentDistribution,
    getRecentSummary
  };
};