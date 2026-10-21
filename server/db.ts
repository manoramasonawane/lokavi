import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface UserProfile {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  fullName: string;
  institution?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  status: 'Active' | 'Archived' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export interface Paper {
  id: string;
  userId: string;
  projectId?: string | null;
  title: string;
  authors: string[];
  venue?: string;
  year: number;
  doi?: string;
  abstract: string;
  methodology: string;
  sampleSize: string;
  findings: string;
  limitations: string;
  extractedText?: string;
  filePath: string;
  fileSizeBytes: number;
  mimeType: string;
  isPublic: boolean;
  createdAt: string;
  tags?: string[];
  citationsCount?: number;
}

export interface SynthesisMatrixItem {
  id: string;
  userId: string;
  paperId: string;
  customNotes?: string;
  relevanceScore: number;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  paperId: string;
  title: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  sender: 'user' | 'ai';
  message: string;
  createdAt: string;
}

export interface DatabaseSchema {
  profiles: UserProfile[];
  projects: Project[];
  papers: Paper[];
  synthesisMatrix: SynthesisMatrixItem[];
  chatSessions: ChatSession[];
  chatMessages: ChatMessage[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'researchmate-db.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache synced with disk
let db: DatabaseSchema = {
  profiles: [],
  projects: [],
  papers: [],
  synthesisMatrix: [],
  chatSessions: [],
  chatMessages: [],
};

function saveDb() {
  try {
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('[DB] Failed to persist database to disk:', err);
  }
}

function loadDb() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(content);
      return;
    } catch (e) {
      console.error('[DB] Corrupted database file, initializing fresh store:', e);
    }
  }

  // Seed default demonstration data
  seedDefaultData();
  saveDb();
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

function seedDefaultData() {
  const demoSalt = crypto.randomBytes(16).toString('hex');
  const demoHash = hashPassword('Research123!', demoSalt);

  const demoUserId = 'usr-demo-001';
  db.profiles = [
    {
      id: demoUserId,
      email: 'demo@researchmate.ai',
      passwordHash: demoHash,
      salt: demoSalt,
      fullName: 'Dr. Elizabeth Thorne',
      institution: 'Oxford Cognitive Computing Lab',
      createdAt: new Date().toISOString(),
    },
  ];

  const proj1Id = 'proj-seed-01';
  const proj2Id = 'proj-seed-02';
  db.projects = [
    {
      id: proj1Id,
      userId: demoUserId,
      name: 'Autonomous Scientific Discovery Systems',
      description: 'Systematic literature review on agentic LLM reasoning and falsification in biochemistry and physics.',
      status: 'Active',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: proj2Id,
      userId: demoUserId,
      name: 'Epigenetic Gene Silencing Protocols',
      description: 'CRISPR-dCas9 repressor stability studies in human cortical neuron cultures.',
      status: 'Active',
      createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ];

  const p1Id = 'paper-seed-01';
  const p2Id = 'paper-seed-02';
  const p3Id = 'paper-seed-03';

  db.papers = [
    {
      id: p1Id,
      userId: demoUserId,
      projectId: proj1Id,
      title: 'Self-Reflective Reasoning in Large Language Models for Scientific Discovery',
      authors: ['Dr. Elena Rostova', 'Marcus Vance', 'K. Takahashi'],
      venue: 'Nature Machine Intelligence',
      year: 2024,
      doi: '10.1038/s42256-024-00812-x',
      abstract: 'Autonomous scientific exploration requires artificial reasoning systems to actively formulate hypotheses, generate predictive tests, and iteratively falsify conjectures against empirical benchmarks without constant human steering. We present Meta-Reflect, an architecture incorporating iterative critic validation loops against open science benchmarks.',
      methodology: 'Dual-model agentic loop with symbolic consistency checks and automated counterfactual verification evaluated across 4,200 open chemistry and molecular biology challenge sets.',
      sampleSize: '4,200 benchmark tasks across 6 scientific domains',
      findings: 'Achieves a 38.4% improvement in multi-step hypothesis generation accuracy over baseline zero-shot reasoning. Eliminates 71% of non-convergent synthetic pathways.',
      limitations: 'Inference token consumption increases ~4.2x due to recursive verification branches. Internal critic occasionally converges onto plausible-sounding circular proofs in adversarial physics proofs.',
      extractedText: 'Full benchmark text available in system archive. Evaluated with temperature=0.2 and top_p=0.95 across distributed clusters.',
      filePath: 'seed/paper-1.pdf',
      fileSizeBytes: 245812,
      mimeType: 'application/pdf',
      isPublic: true,
      tags: ['LLM', 'Scientific Discovery', 'Agentic Reasoning'],
      citationsCount: 142,
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      id: p2Id,
      userId: demoUserId,
      projectId: proj2Id,
      title: 'Targeted Epigenetic Editing using Engineered CRISPR-dCas9 Repressors in Primary Neurons',
      authors: ['Aisha Chen', "Liam O'Connor", 'Dr. David Wu'],
      venue: 'Cell Genomics',
      year: 2023,
      doi: '10.1016/j.cellgen.2023.100412',
      abstract: 'Precise gene silencing without double-strand DNA breaks is imperative for therapeutics targeting neurodegenerative conditions. Here we detail a compact dCas9-KRAB-MeCP2 transcriptional repressor delivered via AAV9 that achieves durable repression across neuronal cell lines.',
      methodology: 'AAV-mediated delivery to human iPSC-derived cortical neurons; single-cell RNA-seq and targeted bisulfite sequencing arrays at days 7, 21, and 60 post-transduction.',
      sampleSize: 'n = 18 biological replicates per lineage across 3 distinct human iPSC lines',
      findings: '92% locus-specific silencing sustained over 60 days in vitro with zero detectable off-target chromosomal translocations or cytotoxic gene signatures.',
      limitations: 'Vector packaging size constraints (AAV <4.7kb limit) restrict multi-guide multiplexing in vivo; delivery efficiency drops significantly in mature deep cortical layers.',
      extractedText: 'Experimental protocols conducted under biosafety level 2 compliance. Primary cortical tissues sourced under institutional ethical board approval #2022-819.',
      filePath: 'seed/paper-2.pdf',
      fileSizeBytes: 412900,
      mimeType: 'application/pdf',
      isPublic: false, // Private to demo user!
      tags: ['CRISPR', 'Epigenetics', 'Neuroscience'],
      citationsCount: 388,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: p3Id,
      userId: demoUserId,
      projectId: proj1Id,
      title: 'Linear-Time Sequence Modeling with Selective State Spaces (Mamba-2 Architecture)',
      authors: ['Albert Gu', 'Tri Dao', 'S. Ermon'],
      venue: 'ICLR 2024 (Oral)',
      year: 2024,
      doi: '10.48550/arXiv.2312.00752',
      abstract: 'Structured State Space Models (SSMs) provide sub-quadratic scaling for sequential tasks. We demonstrate that selective SSMs match or exceed Transformers across long-context benchmarks while maintaining linear compute and memory complexity.',
      methodology: 'Hardware-aware associative scan algorithms optimized for SRAM utilization on modern GPU tensor cores, scaling from 130M to 2.8B parameter models.',
      sampleSize: 'Models scaled up to 2.8B parameters trained over 300B tokens',
      findings: 'Achieves 5x inference throughput acceleration while sustaining linear memory scaling across 32k context windows without degradation on language modeling perplexity.',
      limitations: 'Subtle performance degradation on high-density associative retrieval and multi-needle search tasks compared to full attention.',
      extractedText: 'Evaluation code and checkpoints released under Apache 2.0 license.',
      filePath: 'seed/paper-3.pdf',
      fileSizeBytes: 389100,
      mimeType: 'application/pdf',
      isPublic: true,
      tags: ['State Space Models', 'Efficiency', 'Deep Learning'],
      citationsCount: 820,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ];

  db.synthesisMatrix = [
    {
      id: 'mat-01',
      userId: demoUserId,
      paperId: p1Id,
      customNotes: 'Key inspiration for our automated hypothesis critic model.',
      relevanceScore: 0.98,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'mat-02',
      userId: demoUserId,
      paperId: p2Id,
      customNotes: 'Check AAV packaging limits against our delivery vectors.',
      relevanceScore: 0.92,
      createdAt: new Date().toISOString(),
    },
  ];

  const sessId = 'sess-seed-01';
  db.chatSessions = [
    {
      id: sessId,
      userId: demoUserId,
      paperId: p1Id,
      title: 'Self-Reflective Reasoning Discussion',
      createdAt: new Date().toISOString(),
    },
  ];

  db.chatMessages = [
    {
      id: 'msg-seed-01',
      sessionId: sessId,
      userId: demoUserId,
      sender: 'ai',
      message: 'Hello Dr. Thorne. I have indexed "Self-Reflective Reasoning in Large Language Models for Scientific Discovery". I can extract methodology specifics, flag empirical limitations, or compare its benchmark results against your active projects.',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ];
}

// Initialize on module load
loadDb();

export const getDb = () => db;
export const persistDb = () => saveDb();
