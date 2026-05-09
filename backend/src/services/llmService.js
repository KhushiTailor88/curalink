const axios = require('axios');

/**
 * Generate structured answers via LLM based on user query and external db contexts.
 */
const generateResponse = async (query, disease, contextPublications = [], contextTrials = []) => {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  
  const pubText = contextPublications.slice(0, 3).map(p => `- ${p.title} (${p.year}). ${p.abstract}`).join('\\n');
  const trialText = contextTrials.slice(0, 3).map(t => `- ${t.title} (${t.year}). ${t.abstract}`).join('\\n');

  const prompt = `
System: You are Curalink, a medical AI assistant. Extract and summarize information clearly using the provided context. Follow this structure:
### Condition Overview
### Research Insights
### Clinical Trials Summary

User Query: ${query} (Disease: ${disease})

Context (Publications):
${pubText || 'No major publication context provided.'}

Context (Trials):
${trialText || 'No clinical trials context provided.'}

Answer (Strictly formatted):
`;

  if (!apiKey || apiKey === '""' || apiKey.length < 5) {
    return {
      conditionOverview: "HuggingFace API Key is missing or invalid.",
      researchInsights: "Please set HUGGINGFACE_API_KEY in your .env file.",
      clinicalTrialsSummary: "AI Summarization unavailable.",
      sources: contextPublications.map(p => p.url).filter(Boolean),
      rawMarkdown: "### AI Synthesis Error\nYour HuggingFace API key is missing. Please add it to your `.env` file to enable research summaries."
    };
  }

  try {
    const url = 'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta';
    
    const response = await axios.post(
      url,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 800,
          temperature: 0.1,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000 // 20s timeout for complex synthesis
      }
    );

    let generatedText = '';
    
    // HuggingFace returns an array or simple object depending on model/config
    if (Array.isArray(response.data)) {
      generatedText = response.data[0]?.generated_text || response.data[0]?.summary_text || '';
    } else {
      generatedText = response.data?.generated_text || '';
    }
    
    if (!generatedText) {
       throw new Error('Empty response from HuggingFace');
    }

    return {
      conditionOverview: "Synthesized via HuggingFace AI Engine.",
      researchInsights: "Generated from current clinical context.",
      clinicalTrialsSummary: "Synthesized from identified trials.",
      sources: [...contextPublications.map(p => p.url), ...contextTrials.map(t => t.url)].filter(Boolean),
      rawMarkdown: generatedText
    };

  } catch (error) {
    console.error('LLM generation error:', error?.response?.data || error?.message);
    
    const fallbackMarkdown = `### AI Synthesis Fallback (API Latency/Error)\n*The research engine encountered an error while synthesizing a summary. Below is the raw extracted data from your clinical query:*

### Identified Research Context
${pubText || '*No specific publication abstracts found to summarize.*'}

### Clinical Trial Progressions
${trialText || '*No clinical trials found to summarize.*'}`;

    return {
      conditionOverview: "Local Data Synthesis (Fallback).",
      researchInsights: "Raw data extraction.",
      clinicalTrialsSummary: "Raw data extraction.",
      sources: [...contextPublications.map(p => p.url), ...contextTrials.map(t => t.url)].filter(Boolean),
      rawMarkdown: fallbackMarkdown
    };
  }
};

module.exports = {
  generateResponse
};
