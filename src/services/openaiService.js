// OpenAI Sentiment Analysis Service
class OpenAIService {
  constructor() {
    // Check if API Key exists
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    this.model = process.env.REACT_APP_OPENAI_MODEL || 'gpt-4';
    this.maxTokens = parseInt(process.env.REACT_APP_MAX_TOKENS) || 1000;
    
    if (this.apiKey && this.apiKey !== 'your_openai_api_key_here') {
      console.log('🔑 OpenAI API Key configured (real mode)');
      // TODO: Future integration with real OpenAI API
      this.openai = null;
    } else {
      console.log('🎭 Using mock mode (no API Key configured)');
      this.openai = null;
    }
  }

  // Basic prompt template for sentiment analysis
  getBasePrompt() {
    return `You are a professional sentiment analysis expert. Please analyze the sentiment of the following text and provide detailed analysis results.

Please respond in JSON format with the following fields:
{
  "sentiment": "positive/negative/neutral",
  "confidence": 0.95,
  "score": 0.8,
  "keywords": ["keyword1", "keyword2"],
  "reasoning": "analysis reasoning",
  "emotions": {
    "joy": 0.8,
    "anger": 0.1,
    "sadness": 0.05,
    "fear": 0.05
  }
}

Text: `;
  }

  // Smart mock response (based on keyword analysis)
  getMockResponse(text) {
    // Sentiment keyword dictionary
    const positiveWords = [
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'love', 'happy', 'awesome', 'fantastic', 'perfect',
      'success', 'beautiful', 'satisfied', 'excited', 'delighted', 'brilliant', 'outstanding', 'superb', 'terrific',
      '好', '棒', '讚', '優秀', '完美', '喜歡', '愛', '開心', '快樂', '滿意', '成功', '美好'
    ];
    
    const negativeWords = [
      'bad', 'terrible', 'horrible', 'hate', 'sad', 'angry', 'awful', 'disgusting', 'disappointed', 'failed',
      'worst', 'stupid', 'useless', 'annoying', 'frustrating', 'pathetic', 'disaster', 'nightmare', 'boring',
      '壞', '糟', '討厭', '失望', '難過', '生氣', '憤怒', '糟糕', '可怕', '失敗', '痛苦'
    ];

    const neutralWords = [
      'okay', 'normal', 'fine', 'average', 'usual', 'regular', 'standard', 'typical', 'common', 'ordinary',
      '還好', '普通', '一般', '可以', '平常', '正常'
    ];

    // Analyze text
    const lowerText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;
    
    const foundKeywords = [];

    // Count occurrences of each sentiment word type
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) {
        positiveCount++;
        foundKeywords.push(word);
      }
    });

    negativeWords.forEach(word => {
      if (lowerText.includes(word)) {
        negativeCount++;
        foundKeywords.push(word);
      }
    });

    neutralWords.forEach(word => {
      if (lowerText.includes(word)) {
        neutralCount++;
        foundKeywords.push(word);
      }
    });

    // Determine main sentiment
    let sentiment = 'neutral';
    let score = 0;
    let confidence = 0.7;

    if (positiveCount > negativeCount && positiveCount > neutralCount) {
      sentiment = 'positive';
      score = Math.min(0.9, 0.3 + (positiveCount * 0.2));
      confidence = Math.min(0.95, 0.7 + (positiveCount * 0.1));
    } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
      sentiment = 'negative';
      score = -Math.min(0.9, 0.3 + (negativeCount * 0.2));
      confidence = Math.min(0.95, 0.7 + (negativeCount * 0.1));
    } else {
      // Neutral or mixed sentiment
      score = (positiveCount - negativeCount) * 0.1;
      confidence = 0.6 + Math.random() * 0.2;
    }

    // Generate emotion distribution
    const emotions = {
      joy: sentiment === 'positive' ? 0.4 + Math.random() * 0.4 : Math.random() * 0.3,
      anger: sentiment === 'negative' ? 0.3 + Math.random() * 0.4 : Math.random() * 0.2,
      sadness: sentiment === 'negative' ? 0.2 + Math.random() * 0.3 : Math.random() * 0.2,
      fear: Math.random() * 0.3
    };

    // Generate analysis reasoning
    const reasoningMap = {
      positive: `The text contains positive vocabulary with an optimistic tone. Detected ${positiveCount} positive keywords.`,
      negative: `The text contains negative vocabulary with a pessimistic tone. Detected ${negativeCount} negative keywords.`,
      neutral: `The text has a relatively neutral tone with no obvious emotional tendency, or contains mixed emotional expressions.`
    };

    return {
      sentiment,
      confidence: Number(confidence.toFixed(2)),
      score: Number(score.toFixed(2)),
      keywords: foundKeywords.slice(0, 5), // Show up to 5 keywords
      reasoning: reasoningMap[sentiment],
      emotions: {
        joy: Number(emotions.joy.toFixed(2)),
        anger: Number(emotions.anger.toFixed(2)),
        sadness: Number(emotions.sadness.toFixed(2)),
        fear: Number(emotions.fear.toFixed(2))
      },
      processingTime: Math.random() * 1000 + 500, // 500-1500ms
      timestamp: new Date().toISOString(),
      mode: 'mock'
    };
  }

  // Main sentiment analysis method
  async analyzeSentiment(text, customPrompt = null) {
    try {
      if (!text || !text.trim()) {
        throw new Error('Please enter text to analyze');
      }

      // Simulate API processing time
      const startTime = Date.now();
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const processingTime = Date.now() - startTime;
          const result = this.getMockResponse(text.trim());
          
          resolve({
            ...result,
            processingTime,
            inputText: text.trim(),
            promptUsed: customPrompt || 'default'
          });
        }, Math.random() * 1500 + 800); // 800-2300ms simulating real API delay
      });

    } catch (error) {
      console.error('❌ Sentiment analysis error:', error);
      
      return {
        sentiment: 'neutral',
        confidence: 0,
        score: 0,
        keywords: [],
        reasoning: `Analysis failed: ${error.message}`,
        emotions: { joy: 0, anger: 0, sadness: 0, fear: 0 },
        processingTime: 0,
        timestamp: new Date().toISOString(),
        error: true,
        errorMessage: error.message,
        mode: 'error'
      };
    }
  }

  // Batch analysis
  async batchAnalyze(texts) {
    const results = [];
    
    for (const text of texts) {
      const result = await this.analyzeSentiment(text);
      results.push({ text, result });
      
      // Add delay to avoid excessive frequency
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    return results;
  }

  // Check service status
  async checkStatus() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: this.openai ? 'connected' : 'mock',
          message: this.openai ? 'API connection normal' : 'Using intelligent mock mode',
          model: this.model,
          mode: this.openai ? 'real' : 'mock'
        });
      }, 300);
    });
  }

  // Get supported emotion types
  getSupportedEmotions() {
    return [
      { name: 'joy', label: 'Joy', color: '#10b981' },
      { name: 'anger', label: 'Anger', color: '#ef4444' },
      { name: 'sadness', label: 'Sadness', color: '#6366f1' },
      { name: 'fear', label: 'Fear', color: '#f59e0b' }
    ];
  }
}

// Singleton instance
const openaiService = new OpenAIService();
export default openaiService;