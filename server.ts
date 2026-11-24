import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import {
  computeLocalDiagnostics,
  normalizeAnalysisResult,
  validateInputs,
} from './src/utils/atsAnalyzer.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT ?? 3000);
const isProduction = process.env.NODE_ENV === 'production';

class MissingApiKeyError extends Error {
  constructor() {
    super(
      'GEMINI_API_KEY is not configured on the server. Add GEMINI_API_KEY in Settings > Secrets (or your local .env file) to enable AI analysis.'
    );
    this.name = 'MissingApiKeyError';
  }
}

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new MissingApiKeyError();
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const ANALYSIS_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    targetIndustry: {
      type: Type.STRING,
      description: 'The target industry or profession being evaluated (e.g., Digital Marketing, Healthcare, Software Engineering).',
    },
    roleTitle: {
      type: Type.STRING,
      description: 'Concise job title inferred from the job description (e.g., Senior Digital Marketing Manager).',
    },
    atsScore: {
      type: Type.INTEGER,
      description: 'Realistic overall ATS match score from 0 to 100 based on keyword alignment, seniority fit, quantified impact, and structure.',
    },
    executiveSummary: {
      type: Type.STRING,
      description: 'Two crisp, recruiter-grade sentences summarizing candidate fit for the target industry and the highest-leverage improvement.',
    },
    breakdown: {
      type: Type.OBJECT,
      properties: {
        keywordAlignment: { type: Type.INTEGER, description: '0-100 score for hard and soft skill keyword coverage.' },
        experienceRelevance: { type: Type.INTEGER, description: '0-100 score for role scope, domain fit, and seniority alignment.' },
        impactMetrics: { type: Type.INTEGER, description: '0-100 score for measurable outcomes and quantified bullets.' },
        atsFormatting: { type: Type.INTEGER, description: '0-100 score for clean ATS-parsable structure and section clarity.' },
      },
      required: ['keywordAlignment', 'experienceRelevance', 'impactMetrics', 'atsFormatting'],
    },
    missingKeywords: {
      type: Type.ARRAY,
      description: '6 to 9 specific hard skills, tools, certifications, methodologies, and critical soft skills explicitly present in the JD that are missing or under-represented in the resume. Include at least 2 Soft Skills and 4 Hard Skills when relevant.',
      items: {
        type: Type.OBJECT,
        properties: {
          keyword: { type: Type.STRING, description: 'Exact concise keyword or skill name (1-4 words).' },
          importance: { type: Type.STRING, description: 'Either Critical or Recommended.' },
          skillType: { type: Type.STRING, description: 'Either Hard Skill or Soft Skill.' },
          context: { type: Type.STRING, description: 'One concise sentence explaining why this industry/JD values it and where to weave it into the resume.' },
        },
        required: ['keyword', 'importance', 'skillType', 'context'],
      },
    },
    matchedKeywords: {
      type: Type.ARRAY,
      description: '6 to 12 strong role-specific skills and keywords already present in both the JD and resume.',
      items: { type: Type.STRING },
    },
    improvements: {
      type: Type.ARRAY,
      description: '4 to 5 high-impact, actionable suggestions tailored to industry hiring standards to improve ATS ranking, credibility, and formatting.',
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'Clear 4-7 word action headline.' },
          category: {
            type: Type.STRING,
            description: 'One of: Impact & Metrics, ATS Formatting, Domain Expertise, Keyword Integration.',
          },
          priority: { type: Type.STRING, description: 'Either High or Medium.' },
          suggestion: { type: Type.STRING, description: 'Specific, direct advice grounded in industry standards and referencing actual details from the resume and JD.' },
          exampleRewrite: { type: Type.STRING, description: 'A concrete improved resume bullet showing how to apply this suggestion.' },
        },
        required: ['title', 'category', 'priority', 'suggestion', 'exampleRewrite'],
      },
    },
    interviewQuestions: {
      type: Type.ARRAY,
      description: 'Exactly 3 high-impact interview questions tailored specifically to this profession, the target JD requirements, and candidate resume gaps.',
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: 'A sharp, realistic interview question specific to the profession, candidate background, and target role.' },
          focusArea: { type: Type.STRING, description: 'Short 2-4 word topic label relevant to the industry.' },
          category: {
            type: Type.STRING,
            description: 'One of: Role Expertise, Strategy & Scenario, Behavioral.',
          },
          whyAsked: { type: Type.STRING, description: 'One sentence explaining what signal the hiring manager is evaluating.' },
          strongAnswerTips: {
            type: Type.ARRAY,
            description: '3 concise talking points grounded in the candidate resume and industry best practices.',
            items: { type: Type.STRING },
          },
        },
        required: ['question', 'focusArea', 'category', 'whyAsked', 'strongAnswerTips'],
      },
    },
  },
  required: [
    'targetIndustry',
    'roleTitle',
    'atsScore',
    'executiveSummary',
    'breakdown',
    'missingKeywords',
    'matchedKeywords',
    'improvements',
    'interviewQuestions',
  ],
};

function extractReadableError(err: unknown): { status: number; message: string } {
  const rawMessage =
    err instanceof Error ? err.message : 'Failed to analyze resume with Gemini AI.';
  let status =
    err && typeof err === 'object' && 'status' in err
      ? Number((err as { status?: unknown }).status)
      : 500;

  if (rawMessage.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(rawMessage) as {
        error?: { code?: number; message?: string; status?: string };
      };
      if (parsed.error?.code) {
        status = Number(parsed.error.code);
      }
      if (parsed.error?.message) {
        return { status, message: parsed.error.message };
      }
    } catch {
      // Keep raw message if not valid JSON
    }
  }

  return { status: Number.isFinite(status) ? status : 500, message: rawMessage };
}

async function generateStructuredAnalysis(
  ai: GoogleGenAI,
  model: string,
  prompt: string,
  targetIndustry: string,
  timeoutMs: number
): Promise<string> {
  const apiPromise = ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction:
        `You are an Executive Recruiter, Hiring Manager, and Applicant Tracking System (ATS) Specialist specializing in ${targetIndustry}. ` +
        'Analyze the candidate resume strictly against the provided job description using authentic hiring standards, KPIs, and terminology for this exact profession. ' +
        'Be honest, rigorous, and concrete: never invent credentials or experience the candidate does not have when suggesting rewrites (frame missing skills as transferable parallels or upskilling where needed), ' +
        'identify both critical Hard Skills and critical Soft Skills missing from the resume, provide crisp actionable improvements, and craft exactly 3 high-impact role-specific interview questions. ' +
        'Keep every string concise and high-signal. Return strictly valid JSON adhering to the schema.',
      responseMimeType: 'application/json',
      responseSchema: ANALYSIS_RESPONSE_SCHEMA,
      thinkingConfig: {
        thinkingLevel:
          model === 'gemini-3.1-flash-lite'
            ? ThinkingLevel.MINIMAL
            : ThinkingLevel.LOW,
      },
    },
  });

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`Model ${model} timed out after ${Math.round(timeoutMs / 1000)}s.`));
    }, timeoutMs);
  });

  try {
    const response = await Promise.race([apiPromise, timeoutPromise]);
    const text = response.text?.trim();
    if (!text) {
      throw new Error('Gemini returned an empty response.');
    }
    return text;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function callGeminiWithRetry(
  ai: GoogleGenAI,
  prompt: string,
  targetIndustry: string
): Promise<string> {
  const attempts: Array<{ model: string; timeoutMs: number }> = [
    { model: 'gemini-4-hydrogen', timeoutMs: 18000 },
    { model: 'gemini-3.1-flash-lite', timeoutMs: 20000 },
    { model: 'gemini-3.1-flash-lite', timeoutMs: 25000 },
  ];
  let lastError: unknown;

  for (let i = 0; i < attempts.length; i++) {
    const { model, timeoutMs } = attempts[i];
    try {
      return await generateStructuredAnalysis(ai, model, prompt, targetIndustry, timeoutMs);
    } catch (err: unknown) {
      lastError = err;
      const { status, message } = extractReadableError(err);
      const isTransient =
        status === 429 ||
        status >= 500 ||
        /UNAVAILABLE|high demand|overloaded|temporarily|timed out/i.test(message);

      if (!isTransient) {
        throw err;
      }
      if (i < attempts.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }
  }
  throw lastError;
}

async function createApp() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/analyze', async (req, res) => {
    // Ensure candidate resumes and job descriptions are never cached by intermediaries
    res.setHeader('Cache-Control', 'no-store');
    try {
      const targetIndustry =
        typeof req.body?.targetIndustry === 'string' && req.body.targetIndustry.trim()
          ? req.body.targetIndustry.trim().slice(0, 100)
          : 'General Profession';
      const jobDescription =
        typeof req.body?.jobDescription === 'string' ? req.body.jobDescription : '';
      const resumeText =
        typeof req.body?.resumeText === 'string' ? req.body.resumeText : '';

      const validationErrors = validateInputs(jobDescription, resumeText);
      if (validationErrors.jobDescription || validationErrors.resumeText) {
        res.status(400).json({
          code: 'VALIDATION_ERROR',
          error:
            validationErrors.jobDescription ??
            validationErrors.resumeText ??
            'Invalid input provided.',
          validationErrors,
        });
        return;
      }

      const diagnostics = computeLocalDiagnostics(jobDescription, resumeText);
      const ai = getGeminiClient();

      const prompt = [
        `Evaluate the following Candidate Resume against the Target Job Description for the "${targetIndustry}" industry/role.`,
        '',
        '--- LOCAL PRE-SCAN METADATA ---',
        `Target Industry / Profession: ${targetIndustry}`,
        `Resume Word Count: ${diagnostics.resumeWordCount}`,
        `Detected Sections: ${diagnostics.detectedSections.join(', ') || 'None clearly labeled'}`,
        `Quantified Metrics Detected: ${diagnostics.quantifiedMetricsCount}`,
        '',
        '--- TARGET JOB DESCRIPTION ---',
        jobDescription.trim(),
        '',
        '--- CANDIDATE RESUME / CV ---',
        resumeText.trim(),
      ].join('\n');

      const rawText = await callGeminiWithRetry(ai, prompt, targetIndustry);
      const parsed = JSON.parse(rawText);
      const normalized = normalizeAnalysisResult(parsed, targetIndustry);

      res.json({
        analysis: normalized,
        diagnostics,
      });
    } catch (err: unknown) {
      if (err instanceof MissingApiKeyError) {
        res.status(503).json({
          code: 'MISSING_API_KEY',
          error: err.message,
        });
        return;
      }

      const { status, message } = extractReadableError(err);

      if (status === 400 || status === 401 || status === 403 || /API_KEY_INVALID|PERMISSION_DENIED/i.test(message)) {
        res.status(status === 403 ? 403 : 401).json({
          code: 'AUTH_ERROR',
          error:
            'Gemini API authentication failed. Please verify your GEMINI_API_KEY in Settings > Secrets (or your local .env file).',
        });
        return;
      }

      if (status === 429 || /RESOURCE_EXHAUSTED/i.test(message)) {
        res.setHeader('Retry-After', '15');
        res.status(429).json({
          code: 'RATE_LIMIT',
          retryAfterSeconds: 15,
          error:
            'Gemini API rate limit reached (HTTP 429). Please wait briefly before running another analysis.',
        });
        return;
      }

      if (status === 503 || /UNAVAILABLE|high demand|timed out/i.test(message)) {
        res.status(503).json({
          code: 'SERVICE_UNAVAILABLE',
          error:
            'The AI service is momentarily experiencing high demand. Please click Retry Analysis in a few seconds.',
        });
        return;
      }

      res.status(500).json({
        code: 'UNKNOWN_ERROR',
        error: message,
      });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distPath, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Resume & ATS Optimizer Pro server listening on http://0.0.0.0:${PORT}`);
  });
}

createApp();
