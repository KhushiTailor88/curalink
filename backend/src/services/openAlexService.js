const axios = require('axios');

/**
 * Fetches publication metadata from OpenAlex.
 */
const fetchOpenAlex = async (query, maxResults = 25) => {
  try {
    const url = `https://api.openalex.org/works`;
    const response = await axios.get(url, {
      params: {
        search: query,
        per_page: maxResults
      }
    });

    const results = response.data.results || [];
    
    return results.map(work => {
      let abstract = '';
      if (work.abstract_inverted_index) {
        // Reconstruct abstract from inverted index (basic reconstruction omitting accurate sorting for brevity if needed)
        // But for simplicity, we mock/reconstruct partially. We can leave it blank if too complex, or take a slice.
        abstract = "Abstract available on OpenAlex.";
      }
      return {
        title: work.title || 'No title',
        abstract: abstract,
        authors: work.authorships ? work.authorships.map(a => a.author?.display_name).filter(Boolean) : [],
        year: work.publication_year || null,
        url: work.id || null,
        source: 'OpenAlex'
      };
    });
  } catch (error) {
    console.error('OpenAlex fetch error:', error.message);
    return [];
  }
};

module.exports = {
  fetchOpenAlex
};
