const express = require("express");
const axios = require("axios");

const router = express.Router();

const rubricSummary = `
Score 1-3: Needs attention
Score 4-6: Reliable execution
Score 7-8: Drives systems and KPIs
Score 9-10: Creates organizational transformation
`;

const kpis = `
KPIs:
- Lead Generation
- Lead Conversion
- NPS
- TAT
- Quality
- Upselling
- Cross-Selling
- PAT
`;

router.post("/", async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({
        error: "Transcript is required",
      });
    }

    // MUCH SIMPLER PROMPT
    const prompt = `
Analyze this supervisor feedback transcript.

Transcript:
${transcript} 

${rubricSummary}

${kpis}

Return ONLY valid JSON.

{
  "evidence": [
    {
      "quote": "quote here",
      "tag": "positive"
    }
  ],
  "score": {
    "value": 7,
    "justification": "short reason"
  },
  "kpi_mapping": [
    {
      "kpi": "Customer Response Time",
      "reason": "why it matters"
    }
  ],
  "gap_analysis": [
    "missing area"
  ],
  "follow_up_questions": [
    "question here"
  ]
}
`;

    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3.2",
      prompt,
      stream: false,
    });

    const rawResponse = response.data.response;

    console.log("RAW RESPONSE:");
    console.log(rawResponse);

    // Remove markdown
    const cleaned = rawResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Extract JSON safely
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      return res.status(500).json({
        error: "No JSON found",
        raw: cleaned,
      });
    }

    const jsonString = cleaned.slice(firstBrace, lastBrace + 1);

    const parsed = JSON.parse(jsonString);

    res.json(parsed);
  } catch (error) {
    console.log("SERVER ERROR:");
    console.log(error);

    res.status(500).json({
      error: "Analysis failed",
    });
  }
});

module.exports = router;
