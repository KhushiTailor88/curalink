const { fetchPubMed } = require('../services/pubmedService');
const { fetchOpenAlex } = require('../services/openAlexService');
const { fetchClinicalTrials } = require('../services/clinicalTrialsService');
const { rankPublications } = require('../services/rankingService');
const { generateResponse } = require('../services/llmService');
const Chat = require('../models/Chat');

const { expandQuery } = require('../utils/queryExpander');

const processQuery = async (req, res) => {
  const { query, disease, location } = req.body;

  if (!query || !disease) {
    return res.status(400).json({ error: 'Query and disease are required fields.' });
  }

  const expandedDisease = expandQuery(disease);
  const expandedQuery = expandQuery(query);
  
  // Use robust search combination explicitly as requested by user
  const combinedSearch = `(${expandedDisease}) AND (${expandedQuery})`;

  try {
    // 1. Fetch concurrently
    const [pubmedRet, openAlexRet, trialsRet] = await Promise.all([
      fetchPubMed(combinedSearch, 30),
      fetchOpenAlex(combinedSearch, 40),
      fetchClinicalTrials(expandedDisease, expandedQuery, location)
    ]);

    // 2. Normalize and rank
    const rankedPublications = rankPublications(pubmedRet, openAlexRet, 8, query, disease);
    const rankedTrials = trialsRet.slice(0, 5); // top 5 trials

    // 3. Generate LLM summaries (Pass top 3 to keep context window safe)
    const llmSummaryResponse = await generateResponse(query, disease, rankedPublications, rankedTrials);

    // 4. Save to MongoDB associated with User
    const chatEntry = await Chat.create({
      user: req.user.id,
      disease,
      query,
      location,
      combinedQuery: combinedSearch,
      publications: rankedPublications,
      trials: rankedTrials,
      aiSummary: llmSummaryResponse
    });

    // 5. Send back response to UI
    res.json({
      success: true,
      data: chatEntry
    });

  } catch (error) {
    console.error('API Controller error:', error);
    res.status(500).json({ error: 'Internal server error while processing query.' });
  }
};

const getHistory = async (req, res) => {
  try {
    const history = await Chat.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving history.' });
  }
};

module.exports = {
  processQuery,
  getHistory
};
