/**
 * Normalizes, merges, filters and ranks research papers.
 * Strategy: Keyword relevance matching, then sort by year descending.
 */

const rankPublications = (pubmed, openalex, limit = 8, query = "", disease = "") => {
  // Combine both arrays
  let combined = [...pubmed, ...openalex];

  // Extract core keywords (minimum length 3) to enforce relevance
  const combinedKeywords = `${query} ${disease}`
    .toLowerCase()
    .replace(/[^\\w\\s]/g, '')
    .split(/\\s+/)
    .filter(word => word.length >= 3);

  // Remove exact title duplicates and strictly filter for keyword relevance
  const uniqueTitles = new Set();
  const relevantPubs = [];
  
  for (const pub of combined) {
    const lTitle = pub.title ? pub.title.toLowerCase() : "";
    const lAbstract = pub.abstract ? pub.abstract.toLowerCase() : "";
    
    // Core relevance match (must contain at least one query keyword)
    const hasMatch = combinedKeywords.length === 0 || combinedKeywords.some(kw => lTitle.includes(kw) || lAbstract.includes(kw));

    if (hasMatch && !uniqueTitles.has(lTitle)) {
      uniqueTitles.add(lTitle);
      relevantPubs.push({ ...pub, relevance: true });
    }
  }

  // Sort descending by recency
  relevantPubs.sort((a, b) => {
    const yrA = a.year || 0;
    const yrB = b.year || 0;
    return yrB - yrA;
  });

  return relevantPubs.slice(0, limit);
};

module.exports = {
  rankPublications
};
