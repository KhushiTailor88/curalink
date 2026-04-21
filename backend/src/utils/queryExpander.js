/**
 * Expands generic human-readable queries into comprehensive clinical search terms
 * to maximize external DB coverage.
 */
function expandQuery(query) {
  if (!query) return query;
  
  const q = query.toLowerCase();
  
  const mappings = {
    "cold": "common cold OR viral infection OR upper respiratory infection",
    "flu": "influenza OR systemic viral infection",
    "pain": "pain OR analgesia OR chronic pain OR acute pain",
    "fever": "fever OR pyrexia OR hyperthermia",
    "headache": "headache OR migraine OR cephalalgia",
    "not well": "malaise OR fatigue OR acute illness",
    "tired": "fatigue OR lethargy OR exhaustion",
    "high blood pressure": "hypertension OR high blood pressure",
    "heart attack": "myocardial infarction OR heart attack",
    "stroke": "stroke OR cerebrovascular accident OR CVA",
    "cancer": "cancer OR malignant neoplasm OR tumor OR oncology",
    "diabetes": "diabetes mellitus OR type 1 diabetes OR type 2 diabetes OR hyperglycemia"
  };

  // Replace recognized terms with their expanded clinical equivalents
  let expanded = q;
  for (const [key, value] of Object.entries(mappings)) {
    if (expanded.includes(key)) {
        // Simple expansion concatenation (we can replace or append, appending is safest)
        return value;
    }
  }
  
  return query; // return original if no mapping matched
}

module.exports = { expandQuery };
