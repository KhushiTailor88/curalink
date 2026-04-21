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
      conditionOverview: "API key is missing.",
      researchInsights: "Mock research insight.",
      clinicalTrialsSummary: "Mock clinical trials summary.",
      sources: contextPublications.map(p => p.url).filter(Boolean),
      rawMarkdown: "### Condition Overview\\nAPI Key missing or invalid...\\n### Research\\nMocked.\\n"
    };
  }

  try {
    const url = 'http://127.0.0.1:11434/api/generate';
    const response = await axios.post(
      url,
      {
        model: "llama3", // Assuming user has standard defaults on Ollama
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.3,
          num_predict: 600
        }
      }
    );

    const generatedText = response.data?.response;
    
    return {
      conditionOverview: "Parsed from Local Ollama successfully.",
      researchInsights: "Generated via Ollama.",
      clinicalTrialsSummary: "Generated via Ollama.",
      sources: [...contextPublications.map(p => p.url), ...contextTrials.map(t => t.url)].filter(Boolean),
      rawMarkdown: generatedText || "Model returned empty valid connection."
    };

  } catch (error) {
    console.error('LLM generation error:', error?.response?.data || error?.message);
    
    // Check specifically for connection refused which means Ollama isn't running
    if (error.code === 'ECONNREFUSED') {
       return {
         conditionOverview: "Ollama Error",
         researchInsights: "Error",
         clinicalTrialsSummary: "Error",
         sources: [],
         rawMarkdown: `### Local LLM Connection Failed\\nCuralink could not connect to your local Ollama instance on port 11434. Please ensure Ollama is installed and running in the background.`
       };
    }

    const fallbackMarkdown = `### AI Synthesis Fallback (API Unavailable)\\n*Ollama encountered a processing error. Curalink has automatically engaged the Local Synthesis Engine for your query:*\\n\\n### Key Research Insights\\n${pubText || '*No publication abstracts available to synthesize.*'}\\n\\n### Related Clinical Trials\\n${trialText || '*No clinical trials available to synthesize.*'}`;

    return {
      conditionOverview: "Synthesized via Local Fallback Engine.",
      researchInsights: "Generated.",
      clinicalTrialsSummary: "Generated.",
      sources: [...contextPublications.map(p => p.url), ...contextTrials.map(t => t.url)].filter(Boolean),
      rawMarkdown: fallbackMarkdown
    };
  }
};

module.exports = {
  generateResponse
};
