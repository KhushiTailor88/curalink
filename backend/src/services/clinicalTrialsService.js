const axios = require('axios');

/**
 * Fetches clinical trials from ClinicalTrials.gov API (v2).
 */
const fetchClinicalTrials = async (disease, queryStr, location) => {
  try {
    // ClinicalTrials Gov API v2 endpoint
    const url = 'https://clinicaltrials.gov/api/v2/studies';
    
    // Construct query parameters
    const params = {
      format: 'json',
      pageSize: 15
    };

    let conds = disease;
    let terms = queryStr;
    
    if (conds) params['query.cond'] = conds;
    if (terms) params['query.term'] = terms;
    if (location) params['query.locn'] = location;

    const response = await axios.get(url, { params });
    const studies = response.data.studies || [];

    const trials = studies.map(study => {
      const protocol = study.protocolSection;
      const identificationString = protocol?.identificationModule?.briefTitle || 'No title';
      const briefSummary = protocol?.descriptionModule?.briefSummary || '';
      
      const contactsLocation = protocol?.contactsLocationsModule || {};
      const overallOfficials = contactsLocation.overallOfficials || [];
      const authors = overallOfficials.map(o => o.name).filter(Boolean);
      
      const startDate = protocol?.statusModule?.startDateStruct?.date || '';
      const year = startDate ? parseInt(startDate.substring(0, 4)) : null;

      const nctId = protocol?.identificationModule?.nctId;
      const trialUrl = nctId ? `https://clinicaltrials.gov/study/${nctId}` : '';

      return {
        title: identificationString,
        abstract: briefSummary,
        authors: authors.length > 0 ? authors : ['ClinicalTrials.gov'],
        year: year,
        url: trialUrl,
        source: 'ClinicalTrials'
      };
    });

    return trials;
  } catch (error) {
    console.error('ClinicalTrials fetch error:', error.message);
    return [];
  }
};

module.exports = {
  fetchClinicalTrials
};
