const axios = require('axios');

/**
 * Fetches publication metadata from PubMed based on search query.
 */
const fetchPubMed = async (query, maxResults = 25) => {
  try {
    // 1. Search for IDs
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi`;
    const searchRes = await axios.get(searchUrl, {
      params: {
        db: 'pubmed',
        term: query,
        retmode: 'json',
        retmax: maxResults
      }
    });

    const ids = searchRes.data.esearchresult?.idlist || [];
    if (ids.length === 0) return [];

    // 2. Fetch summary for these IDs
    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi`;
    const summaryRes = await axios.get(summaryUrl, {
      params: {
        db: 'pubmed',
        id: ids.join(','),
        retmode: 'json'
      }
    });

    const result = summaryRes.data.result;
    if (!result) return [];

    const publications = [];
    ids.forEach((id) => {
      const pub = result[id];
      if (pub) {
        publications.push({
          title: pub.title || 'No title',
          abstract: '', // eSummary does not always return full abstract; we could use eFetch but skipping for simple API limits. Let's do best effort.
          authors: pub.authors ? pub.authors.map(a => a.name) : [],
          year: pub.pubdate ? parseInt(pub.pubdate.substring(0, 4)) : null,
          url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
          source: 'PubMed'
        });
      }
    });

    return publications;
  } catch (error) {
    console.error('PubMed fetch error:', error.message);
    return [];
  }
};

module.exports = {
  fetchPubMed
};
