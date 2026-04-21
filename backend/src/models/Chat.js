const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    disease: {
      type: String,
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: '',
    },
    combinedQuery: {
      type: String,
    },
    publications: [
      {
        title: String,
        abstract: String,
        authors: [String],
        year: Number,
        url: String,
        source: String // PubMed or OpenAlex
      }
    ],
    trials: [
      {
        title: String,
        abstract: String,
        authors: [String],
        url: String,
        source: String // ClinicalTrials
      }
    ],
    aiSummary: {
      conditionOverview: String,
      researchInsights: String,
      clinicalTrialsSummary: String,
      sources: [String],
      rawMarkdown: String // The generated string from open source LLM
    }
  },
  { timestamps: true }
);

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
