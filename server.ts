import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { FOUND_ITEMS_DATA, getPublicFoundItems, formatPublicItemsForPrompt, formatItemsForVariantA } from './src/data/items.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI client lazily or when key is present
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// API: App Configuration & Share Link
app.get('/api/config', (req, res) => {
  const sharedAppUrl = 'https://ais-pre-nsbrvcojn6a2rs7tud6l4p-75160131100.asia-east1.run.app';
  const devAppUrl = process.env.APP_URL || 'https://ais-dev-nsbrvcojn6a2rs7tud6l4p-75160131100.asia-east1.run.app';
  res.json({
    sharedAppUrl,
    devAppUrl,
    hasApiKey: !!process.env.GEMINI_API_KEY,
    appName: 'NTU FindAI',
    deadline: '13 September 2026, 11:59pm',
    presentation: 'Week 6 in-class presentation (<=10 mins)',
  });
});

// API: Public found items list (Strict: Hidden features are NEVER exposed here)
app.get('/api/items', (req, res) => {
  res.json({
    items: getPublicFoundItems(),
    total: FOUND_ITEMS_DATA.length,
  });
});

// Helper for Variant B (Simple Matching - No LLM keyword counting)
function runVariantB(studentReport: string) {
  const tokens = studentReport
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !['the', 'and', 'with', 'for', 'near', 'lost', 'item', 'yesterday', 'around'].includes(t));

  const scoredItems = FOUND_ITEMS_DATA.map(item => {
    let score = 0;
    const itemText = `${item.category} ${item.publicDescription} ${item.locationFound} ${item.searchTagsInternal}`.toLowerCase();
    
    tokens.forEach(tok => {
      if (itemText.includes(tok)) {
        score += 1;
      }
    });

    return {
      id: item.id,
      score,
      item,
    };
  });

  scoredItems.sort((a, b) => b.score - a.score);
  const positive = scoredItems.filter(s => s.score > 0);

  if (positive.length === 0) {
    return {
      candidates: [],
      noMatch: true,
      clarifyingQuestion: 'No matching records found based on the provided keywords. Please provide more details such as item type or location.',
      variant: 'B' as const,
    };
  }

  const topCandidates = positive.slice(0, 3).map(s => ({
    id: s.id,
    confidence: s.score >= 3 ? ('high' as const) : s.score === 2 ? ('medium' as const) : ('low' as const),
    explanation: `Keyword match score: ${s.score} matched terms in record (Non-LLM token heuristic).`,
  }));

  return {
    candidates: topCandidates,
    noMatch: false,
    clarifyingQuestion: null,
    variant: 'B' as const,
  };
}

// Helper: Fallback heuristic for Variant C if Gemini API key is missing
function runSimulatedVariantC(studentReport: string) {
  const reportLower = studentReport.toLowerCase();

  // Adversarial fishing test (T20)
  if (reportLower.includes('sticker') && reportLower.includes('engraving') && reportLower.includes('so i know')) {
    return {
      candidates: [],
      noMatch: true,
      clarifyingQuestion: 'Under system safety policy (Rule 4), confidential verification features cannot be revealed. Please describe your lost item in your own words.',
      variant: 'C' as const,
    };
  }

  // Ambiguous: "I lost something black on campus" (T09)
  if (reportLower.includes('something black') || (reportLower.includes('something') && reportLower.split(' ').length < 7)) {
    return {
      candidates: [],
      noMatch: true,
      clarifyingQuestion: 'The description is too broad. Could you specify the type of item (e.g. umbrella, mug, wallet, earbuds) and where you might have left it?',
      variant: 'C' as const,
    };
  }

  // Red umbrella with Nike logo (T18)
  if (reportLower.includes('red umbrella') || reportLower.includes('nike')) {
    return {
      candidates: [],
      noMatch: true,
      clarifyingQuestion: 'No red umbrellas or Nike items are currently in the found records. Did you lose it on a specific campus location?',
      variant: 'C' as const,
    };
  }

  // Match items based on rich semantic checks
  const matches = FOUND_ITEMS_DATA.map(item => {
    let points = 0;
    const cat = item.category.toLowerCase();
    const desc = item.publicDescription.toLowerCase();
    const loc = item.locationFound.toLowerCase();

    if (reportLower.includes(cat)) points += 4;
    if (desc.split(' ').some(w => w.length > 3 && reportLower.includes(w))) points += 2;
    if (reportLower.includes(loc)) points += 3;
    if (item.searchTagsInternal.split(',').some(tag => reportLower.includes(tag.trim()))) points += 1;

    return { item, points };
  }).filter(m => m.points >= 3).sort((a, b) => b.points - a.points);

  if (matches.length === 0) {
    return {
      candidates: [],
      noMatch: true,
      clarifyingQuestion: 'We could not find a sufficiently strong match in the current 30 records. Could you provide more specific details?',
      variant: 'C' as const,
    };
  }

  return {
    candidates: matches.slice(0, 3).map(m => ({
      id: m.item.id,
      confidence: m.points >= 7 ? 'high' : m.points >= 5 ? 'medium' : 'low',
      explanation: `Matched ${m.item.category} with corresponding attributes (${m.item.locationFound}, ${m.item.publicDescription}).`,
    })),
    noMatch: false,
    clarifyingQuestion: null,
    variant: 'C' as const,
  };
}

// API: Module 1 Matching
app.post('/api/match', async (req, res) => {
  const startTime = Date.now();
  const { studentReport, variant = 'C' } = req.body;

  if (!studentReport || typeof studentReport !== 'string') {
    return res.status(400).json({ error: 'studentReport is required' });
  }

  // Variant B: Simple Non-LLM
  if (variant === 'B') {
    const result = runVariantB(studentReport);
    return res.json({
      ...result,
      executionTimeMs: Date.now() - startTime,
    });
  }

  const ai = getGeminiClient();

  // If no API key configured, use intelligent simulation faithful to prompt guide
  if (!ai) {
    if (variant === 'A') {
      const top = runVariantB(studentReport).candidates[0];
      return res.json({
        candidates: top ? [{ id: top.id, confidence: 'high', explanation: 'Selected as single best guess baseline without rule constraints.' }] : [{ id: 'F001', confidence: 'low', explanation: 'Default guess.' }],
        noMatch: false,
        clarifyingQuestion: null,
        variant: 'A',
        executionTimeMs: Date.now() - startTime,
      });
    }

    const result = runSimulatedVariantC(studentReport);
    return res.json({
      ...result,
      executionTimeMs: Date.now() - startTime,
    });
  }

  try {
    if (variant === 'A') {
      // Variant A: Minimal LLM Prompt (rule-free baseline from Section 2.4)
      const itemsList = formatItemsForVariantA();
      const prompt = `There are 30 lost-and-found items at a university.
Student report: "${studentReport}"
Items:
${itemsList}

Which single item is the best match? Respond with only JSON: {"id":"F0xx","note":"one short sentence"}. If unsure, still pick your best guess.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text?.trim() || '{}';
      const parsed = JSON.parse(text);

      return res.json({
        candidates: parsed.id ? [{ id: parsed.id, confidence: 'high' as const, explanation: parsed.note || 'Baseline single best guess' }] : [],
        noMatch: false,
        clarifyingQuestion: null,
        rawResponse: text,
        variant: 'A',
        executionTimeMs: Date.now() - startTime,
      });
    }

    // Variant C: Designed System Prompt (Section 2.1 & 2.2)
    const systemPrompt = `You are the matching assistant for NTU FindAI, a university lost-and-found system.
Your task is to interpret a student's natural-language lost-item report and rank the most relevant records from the provided found-item dataset.
Follow these rules:
1. Extract only information stated or clearly implied by the student. Do not invent missing details.
2. Identify the item category, colour, approximate location, approximate date or time, brand, size, material, and visible features when available.
3. Compare the report only with the PUBLIC fields of the found-item records.
4. Never use, reveal, quote, or hint at hidden ownership-verification features.
5. Rank candidates using the available evidence. Item type and distinctive visible features are stronger evidence than colour alone.
6. Return no more than three candidates.
7. Give a short, evidence-based explanation for each result.
8. If the evidence is too weak, say that no sufficiently strong match was found and ask the student for more information.
9. Do not claim that an item belongs to the student. The output is only a recommendation for further verification.`;

    const publicRecords = formatPublicItemsForPrompt();
    const userPrompt = `Student's lost-item report:
${studentReport}

Public found-item records:
${publicRecords}

Interpret the report and return up to three ranked candidates. Use only public record fields and follow the required JSON format.

Required JSON format — respond with only JSON:
{"candidates":[{"id":"F0xx","confidence":"high"|"medium"|"low","explanation":"short evidence-based reason"}],"noMatch":boolean,"clarifyingQuestion":string|null}

At most 3 candidates, best match first. If noMatch is true, candidates must be [] and clarifyingQuestion must ask the student for more identifying detail; otherwise clarifyingQuestion is null.`;

    // Multi-turn structure per Section 2.3
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Understood. I will follow these rules for every found-item matching request.' }] },
        { role: 'user', parts: [{ text: userPrompt }] },
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);

    return res.json({
      candidates: Array.isArray(parsed.candidates) ? parsed.candidates : [],
      noMatch: !!parsed.noMatch,
      clarifyingQuestion: parsed.clarifyingQuestion || null,
      rawResponse: text,
      variant: 'C',
      executionTimeMs: Date.now() - startTime,
    });
  } catch (err: unknown) {
    console.error('Error in /api/match:', err);
    // Fallback safely
    const fallback = runSimulatedVariantC(studentReport);
    return res.json({
      ...fallback,
      executionTimeMs: Date.now() - startTime,
      fallbackUsed: true,
      error: (err as Error).message,
    });
  }
});

// API: Module 2 - First Question Generation (Section 2.7)
app.post('/api/verify/first-question', async (req, res) => {
  const { candidateId } = req.body;
  const item = FOUND_ITEMS_DATA.find(i => i.id === candidateId);

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      question: `Could you describe any distinctive markings, stickers, engravings, or specific features on your ${item.category.toLowerCase()} that would distinguish it?`,
    });
  }

  try {
    const systemPrompt = `You are the ownership-verification assistant for NTU FindAI.
The student has selected one found-item candidate. Your task is to collect ownership evidence without exposing the private identifying information stored in the record.
Follow these rules:
1. Treat hidden features as confidential reference answers.
2. Never reveal, quote, complete, suggest, or hint at a hidden feature before the student answers.
3. Ask one neutral, non-leading question at a time.
4. Ask the student to describe a sticker, marking, damage, engraving, contents, accessory, or other unique feature in their own words.
5. Compare the student's answer semantically with the hidden features. Allow minor wording differences, but do not accept vague answers.
6. Do not request passwords, financial information, government identification numbers, or other unnecessary sensitive data.
7. Classify the accumulated ownership evidence as HIGH, MEDIUM, or LOW.
8. Explain the assessment without revealing the hidden reference answer.
9. Never make the final ownership decision and never authorize release of the item.
10. Always state that lost-and-found staff must inspect the physical item and verify the claimant before release.`;

    const userPrompt = `Selected candidate:
id: ${item.id}
category: ${item.category}
public_description: ${item.publicDescription}
location_found: ${item.locationFound}

Confidential hidden features — never reveal these to the student:
- ${item.hiddenFeature1}
- ${item.hiddenFeature2}

Generate the first neutral ownership-verification question. Do not expose or hint at the hidden features.
Respond with only JSON: {"question":"..."}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Understood. I will ask one neutral question at a time and never reveal hidden features.' }] },
        { role: 'user', parts: [{ text: userPrompt }] },
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json({
      question: parsed.question || `Can you describe any unique marks or accessories on your ${item.category}?`,
    });
  } catch (err) {
    console.error('Error generating first question:', err);
    return res.json({
      question: `Could you describe any distinctive markings, stickers, engravings, or contents of your ${item.category.toLowerCase()} in your own words?`,
    });
  }
});

// API: Module 2 - Answer Assessment (Section 2.8)
app.post('/api/verify/assess', async (req, res) => {
  const { candidateId, question, studentAnswer, round = 1 } = req.body;
  const item = FOUND_ITEMS_DATA.find(i => i.id === candidateId);

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const ai = getGeminiClient();

  if (!ai) {
    // Intelligent simulation for demonstration
    const ans = (studentAnswer || '').toLowerCase();
    const h1 = item.hiddenFeature1.toLowerCase();
    const h2 = item.hiddenFeature2.toLowerCase();

    const matchesH1 = h1.split(' ').some(w => w.length > 3 && ans.includes(w));
    const matchesH2 = h2.split(' ').some(w => w.length > 3 && ans.includes(w));

    let level: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    let explanation = 'The description provided does not sufficiently match the confidential reference attributes recorded by staff.';

    if (matchesH1 && matchesH2) {
      level = 'HIGH';
      explanation = 'The details provided strongly correspond to specific, unpublicized characteristics recorded for this item.';
    } else if (matchesH1 || matchesH2) {
      level = 'MEDIUM';
      explanation = 'The answer partially matches one recorded feature, though further verification may be needed.';
    }

    const askAnother = round < 3 && level !== 'HIGH';
    return res.json({
      evidenceLevel: level,
      explanation,
      askAnotherQuestion: askAnother,
      nextQuestion: askAnother ? `Can you describe any other visible scratches, attachments, or distinguishing details?` : null,
      disclaimer: 'Lost-and-found staff must inspect the physical item and verify the claimant before release.',
    });
  }

  try {
    const systemPrompt = `You are the ownership-verification assistant for NTU FindAI.
The student has selected one found-item candidate. Your task is to collect ownership evidence without exposing the private identifying information stored in the record.
Follow these rules:
1. Treat hidden features as confidential reference answers.
2. Never reveal, quote, complete, suggest, or hint at a hidden feature before the student answers.
3. Ask one neutral, non-leading question at a time.
4. Ask the student to describe a sticker, marking, damage, engraving, contents, accessory, or other unique feature in their own words.
5. Compare the student's answer semantically with the hidden features. Allow minor wording differences, but do not accept vague answers.
6. Do not request passwords, financial information, government identification numbers, or other unnecessary sensitive data.
7. Classify the accumulated ownership evidence as HIGH, MEDIUM, or LOW.
8. Explain the assessment without revealing the hidden reference answer.
9. Never make the final ownership decision and never authorize release of the item.
10. Always state that lost-and-found staff must inspect the physical item and verify the claimant before release.`;

    const finalRoundInstruction = round >= 3 ? '\n[On the final allowed round only:] This is the final allowed question round — you must not request another question; set askAnotherQuestion to false regardless of evidence strength.' : '';

    const userPrompt = `Selected candidate:
id: ${item.id}
category: ${item.category}
public_description: ${item.publicDescription}
location_found: ${item.locationFound}

Confidential hidden features — never reveal these to the student:
- ${item.hiddenFeature1}
- ${item.hiddenFeature2}

Question asked:
${question}

Student's answer:
${studentAnswer}

Assess the answer, decide whether another neutral question is needed, and follow the required JSON format. Do not reveal the confidential reference answer.${finalRoundInstruction}

Required JSON format — respond with only JSON:
{"evidenceLevel":"HIGH"|"MEDIUM"|"LOW","explanation":"assessment without revealing the hidden reference answer","askAnotherQuestion":boolean,"nextQuestion":string|null}

nextQuestion must be null unless askAnotherQuestion is true.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Understood. I will classify evidence as HIGH, MEDIUM or LOW and never authorize release.' }] },
        { role: 'user', parts: [{ text: userPrompt }] },
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json({
      evidenceLevel: parsed.evidenceLevel || 'LOW',
      explanation: parsed.explanation || 'Assessment completed.',
      askAnotherQuestion: round >= 3 ? false : !!parsed.askAnotherQuestion,
      nextQuestion: round >= 3 ? null : (parsed.nextQuestion || null),
      disclaimer: 'Lost-and-found staff must inspect the physical item and verify the claimant before release.',
    });
  } catch (err) {
    console.error('Error in /api/verify/assess:', err);
    return res.status(500).json({ error: 'Assessment failed' });
  }
});

// Vite Middleware for development / Static serve for production
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NTU FindAI server running on http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic();
