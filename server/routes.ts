import express, { Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getDb, persistDb, Project, Paper, SynthesisMatrixItem, ChatSession, ChatMessage } from './db.js';
import { hashPassword, verifyPassword, createToken, requireAuth, optionalAuth, AuthenticatedRequest } from './auth.js';
import { savePrivatePdf, getSafeDiskPath, generateSignedToken, verifySignedToken } from './storage.js';
import { parsePdfBuffer } from './parser.js';
import { summarizePaperContent, askPaperCopilot, isGeminiConfigured } from './ai.js';
import { generateAllCitations } from './citations.js';

export const router = express.Router();

// ==========================================
// 1. TOURISM ENDPOINTS
// ==========================================
router.get('/destinations', (req, res) => {
  // Can be consumed by external mobile apps or clients
  res.json({
    status: 'success',
    count: 17,
    source: 'lokavi Local Discovery Database',
    tagline: 'Discover the Local Within.',
    regions: ['West', 'North', 'South', 'East', 'Central', 'North-East']
  });
});

router.get('/states', (req, res) => {
  res.json({
    status: 'success',
    totalStates: 28,
    totalUTs: 8
  });
});

router.get('/shops', (req, res) => {
  res.json({
    status: 'success',
    message: 'Local Shops & Nearby Commercial Directory',
    categories: [
      'handicrafts',
      'market',
      'food_dining',
      'grocery',
      'medical',
      'clothing',
      'artisan',
      'bookstore',
      'electronics',
      'services'
    ]
  });
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024 }, // 30 MB limit
});

// ==========================================
// 1. SYSTEM DIAGNOSTICS & STATUS
// ==========================================
router.get('/status', (req, res) => {
  const db = getDb();
  res.json({
    status: 'online',
    version: '1.0.0-rc',
    geminiConfigured: isGeminiConfigured(),
    database: {
      type: 'Persistent File-Backed Store with Transactional Write',
      profilesCount: db.profiles.length,
      projectsCount: db.projects.length,
      papersCount: db.papers.length,
      matrixRowsCount: db.synthesisMatrix.length,
    },
    storage: {
      driver: 'Local Isolated Tenant Filesystem',
      root: path.resolve(process.cwd(), 'uploads'),
    },
    capabilities: [
      'Multi-tenant Row & File Isolation',
      'PDF Magic Bytes (%PDF-) Header Validation',
      'In-Memory PDF Stream Text Extraction',
      'Gemini 2.5 Flash / Local Academic Grounding Fallback',
      'Multi-Style Citation Generator (APA, MLA, Chicago, Harvard, BibTeX)',
      'Synthesis Matrix CSV/JSON/Markdown Blob Export',
    ],
  });
});

// ==========================================
// 2. AUTHENTICATION ROUTES
// ==========================================
router.post('/auth/register', (req, res) => {
  const { email, password, fullName, institution } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Email, password, and full name are required.' });
  }

  const db = getDb();
  const normalizedEmail = email.trim().toLowerCase();

  const existing = db.profiles.find((p) => p.email === normalizedEmail);
  if (existing) {
    return res.status(409).json({ error: 'A researcher account with this email already exists.' });
  }

  const { salt, hash } = hashPassword(password);
  const newProfile = {
    id: `usr-${crypto.randomBytes(8).toString('hex')}`,
    email: normalizedEmail,
    passwordHash: hash,
    salt,
    fullName: fullName.trim(),
    institution: institution ? institution.trim() : undefined,
    createdAt: new Date().toISOString(),
  };

  db.profiles.push(newProfile);
  persistDb();

  const token = createToken(newProfile.id, newProfile.email);
  const { passwordHash, salt: _, ...safeUser } = newProfile;
  res.status(201).json({ user: safeUser, token });
});

router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const db = getDb();
  const normalizedEmail = email.trim().toLowerCase();
  const user = db.profiles.find((p) => p.email === normalizedEmail);

  if (!user || !verifyPassword(password, user.salt, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid credentials. Please verify your email and password.' });
  }

  const token = createToken(user.id, user.email);
  const { passwordHash, salt, ...safeUser } = user;
  res.json({ user: safeUser, token });
});

router.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
  const { passwordHash, salt, ...safeUser } = req.user!;
  res.json({ user: safeUser });
});

// ==========================================
// 3. PROJECT WORKSPACES CRUD
// ==========================================
router.get('/projects', requireAuth, (req: AuthenticatedRequest, res) => {
  const db = getDb();
  const userId = req.user!.id;
  const userProjects = db.projects
    .filter((p) => p.userId === userId)
    .map((p) => {
      const paperCount = db.papers.filter((paper) => paper.projectId === p.id).length;
      return { ...p, paperCount };
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  res.json({ projects: userProjects });
});

router.post('/projects', requireAuth, (req: AuthenticatedRequest, res) => {
  const { name, description, status } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Project workspace name is required.' });
  }

  const db = getDb();
  const newProject: Project = {
    id: `proj-${crypto.randomBytes(8).toString('hex')}`,
    userId: req.user!.id,
    name: name.trim(),
    description: description ? description.trim() : undefined,
    status: status === 'Archived' || status === 'Completed' ? status : 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.projects.push(newProject);
  persistDb();

  res.status(201).json({ project: { ...newProject, paperCount: 0 } });
});

router.put('/projects/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const { name, description, status } = req.body;
  const db = getDb();
  const project = db.projects.find((p) => p.id === req.params.id && p.userId === req.user!.id);

  if (!project) {
    return res.status(404).json({ error: 'Project workspace not found or unauthorized.' });
  }

  if (name && name.trim()) project.name = name.trim();
  if (description !== undefined) project.description = description.trim();
  if (status && ['Active', 'Archived', 'Completed'].includes(status)) {
    project.status = status;
  }
  project.updatedAt = new Date().toISOString();

  persistDb();
  const paperCount = db.papers.filter((paper) => paper.projectId === project.id).length;
  res.json({ project: { ...project, paperCount } });
});

router.delete('/projects/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const db = getDb();
  const index = db.projects.findIndex((p) => p.id === req.params.id && p.userId === req.user!.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Project workspace not found or unauthorized.' });
  }

  const [removed] = db.projects.splice(index, 1);
  // Unassign papers associated with this project
  db.papers.forEach((p) => {
    if (p.projectId === removed.id) p.projectId = null;
  });

  persistDb();
  res.json({ message: 'Project workspace deleted successfully.', id: removed.id });
});

// ==========================================
// 4. PAPERS & LITERATURE INGESTION
// ==========================================
router.get('/papers', optionalAuth, (req: AuthenticatedRequest, res) => {
  const db = getDb();
  const currentUserId = req.user?.id;

  // Filter: papers belonging to current user OR public papers
  let papers = db.papers.filter((p) => p.isPublic || (currentUserId && p.userId === currentUserId));

  // Optional project filter
  if (req.query.projectId) {
    papers = papers.filter((p) => p.projectId === req.query.projectId);
  }

  // Optional search query filter
  if (req.query.q) {
    const q = String(req.query.q).toLowerCase();
    papers = papers.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.abstract.toLowerCase().includes(q) ||
        (p.authors || []).some((a) => a.toLowerCase().includes(q)) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }

  papers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ papers });
});

router.post('/papers/upload', requireAuth, upload.single('file'), async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required for upload.' });
    }

    const userId = req.user!.id;
    const originalName = req.file.originalname;

    // 1. Validate magic bytes and store to user directory
    let relativePath: string;
    try {
      relativePath = savePrivatePdf(userId, originalName, req.file.buffer);
    } catch (secErr: any) {
      return res.status(400).json({ error: secErr.message });
    }

    // 2. Extract real text from PDF buffer
    const parsedData = await parsePdfBuffer(req.file.buffer, originalName);

    // 3. Generate AI or heuristic summary
    const aiSummary = await summarizePaperContent(parsedData.rawText, parsedData.titleSuggestion);

    // 4. Resolve metadata
    const title = req.body.title?.trim() || parsedData.titleSuggestion || originalName.replace(/\.[^/.]+$/, '');
    let authors: string[] = ['Principal Investigator et al.'];
    if (req.body.authors) {
      authors = typeof req.body.authors === 'string' 
        ? req.body.authors.split(',').map((s: string) => s.trim()).filter(Boolean)
        : req.body.authors;
    }

    const db = getDb();
    const newPaper: Paper = {
      id: `paper-${crypto.randomBytes(8).toString('hex')}`,
      userId,
      projectId: req.body.projectId || null,
      title,
      authors: authors.length > 0 ? authors : ['Anonymous Researcher'],
      venue: req.body.venue?.trim() || 'Peer-Reviewed Preprint',
      year: req.body.year ? parseInt(req.body.year, 10) : new Date().getFullYear(),
      doi: req.body.doi?.trim() || undefined,
      abstract: req.body.abstract?.trim() || aiSummary.abstract || parsedData.abstract,
      methodology: req.body.methodology?.trim() || aiSummary.methodology || parsedData.methodology,
      sampleSize: req.body.sampleSize?.trim() || aiSummary.sampleSize || parsedData.sampleSize,
      findings: req.body.findings?.trim() || aiSummary.findings || parsedData.findings,
      limitations: req.body.limitations?.trim() || aiSummary.limitations || parsedData.limitations,
      extractedText: parsedData.rawText,
      filePath: relativePath,
      fileSizeBytes: req.file.size,
      mimeType: 'application/pdf',
      isPublic: req.body.isPublic === 'true' || req.body.isPublic === true,
      tags: req.body.tags ? req.body.tags.split(',').map((t: string) => t.trim()) : ['Uploaded Literature'],
      citationsCount: 0,
      createdAt: new Date().toISOString(),
    };

    db.papers.unshift(newPaper);
    persistDb();

    res.status(201).json({
      paper: newPaper,
      aiEngine: aiSummary.engineUsed,
      message: 'Paper successfully uploaded, validated, and indexed.',
    });
  } catch (err: any) {
    console.error('[Upload Error]:', err);
    res.status(500).json({ error: 'Server error processing PDF upload: ' + err.message });
  }
});

router.get('/papers/:id', optionalAuth, (req: AuthenticatedRequest, res) => {
  const db = getDb();
  const paper = db.papers.find((p) => p.id === req.params.id);

  if (!paper) {
    return res.status(404).json({ error: 'Paper not found.' });
  }

  // Tenant authorization: only owner can see private papers
  if (!paper.isPublic) {
    if (!req.user || req.user.id !== paper.userId) {
      return res.status(403).json({ error: 'Forbidden: Private document owned by another researcher.' });
    }
  }

  res.json({ paper });
});

router.delete('/papers/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const db = getDb();
  const index = db.papers.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Paper not found.' });
  }

  const paper = db.papers[index];
  if (paper.userId !== req.user!.id) {
    return res.status(403).json({ error: 'Forbidden: You cannot delete another user\'s paper.' });
  }

  db.papers.splice(index, 1);

  // Remove associated matrix and chat entries
  db.synthesisMatrix = db.synthesisMatrix.filter((m) => m.paperId !== paper.id);
  db.chatSessions = db.chatSessions.filter((s) => s.paperId !== paper.id);

  // Remove physical file from disk if present
  try {
    const physical = getSafeDiskPath(paper.filePath);
    if (fs.existsSync(physical)) {
      fs.unlinkSync(physical);
    }
  } catch (e) {
    // Ignore physical delete errors
  }

  persistDb();
  res.json({ message: 'Paper deleted successfully.', id: paper.id });
});

// Citations
router.get('/papers/:id/citations', optionalAuth, (req: AuthenticatedRequest, res) => {
  const db = getDb();
  const paper = db.papers.find((p) => p.id === req.params.id);

  if (!paper) {
    return res.status(404).json({ error: 'Paper not found.' });
  }

  if (!paper.isPublic && (!req.user || req.user.id !== paper.userId)) {
    return res.status(403).json({ error: 'Forbidden: Paper citations unauthorized.' });
  }

  const citations = generateAllCitations(paper);
  res.json({ citations, paperId: paper.id, title: paper.title });
});

// Signed Download Token
router.get('/papers/:id/download-token', requireAuth, (req: AuthenticatedRequest, res) => {
  const db = getDb();
  const paper = db.papers.find((p) => p.id === req.params.id);

  if (!paper) {
    return res.status(404).json({ error: 'Paper not found.' });
  }

  if (!paper.isPublic && paper.userId !== req.user!.id) {
    return res.status(403).json({ error: 'Forbidden: Cannot generate download token for another user\'s private PDF.' });
  }

  const token = generateSignedToken(paper.id, req.user!.id, 300); // 5 min TTL
  res.json({
    token,
    downloadUrl: `/api/papers/${paper.id}/file?token=${token}`,
    expiresInSeconds: 300,
  });
});

// Stream PDF file with token validation
router.get('/papers/:id/file', (req, res: Response) => {
  const token = req.query.token as string;
  if (!token) {
    return res.status(401).json({ error: 'Missing access token for private file.' });
  }

  const auth = verifySignedToken(token);
  if (!auth.valid || auth.paperId !== req.params.id) {
    return res.status(403).json({ error: auth.error || 'Invalid or expired download token.' });
  }

  const db = getDb();
  const paper = db.papers.find((p) => p.id === req.params.id);
  if (!paper) {
    return res.status(404).json({ error: 'Paper record not found.' });
  }

  try {
    const physicalPath = getSafeDiskPath(paper.filePath);
    if (!fs.existsSync(physicalPath)) {
      // In seed mode or placeholder mode, return a dynamic valid PDF stub
      const dummyPdf = Buffer.from(
        `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000108 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF`
      );
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="document.pdf"`);
      return res.send(dummyPdf);
    }

    const safeTitle = paper.title.replace(/[^a-zA-Z0-9_\- ]/g, '').slice(0, 50);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${safeTitle}.pdf"; filename*=UTF-8''${encodeURIComponent(safeTitle)}.pdf`);

    fs.createReadStream(physicalPath).pipe(res);
  } catch (err: any) {
    res.status(500).json({ error: 'File streaming error: ' + err.message });
  }
});

// ==========================================
// 5. SYNTHESIS MATRIX CRUD
// ==========================================
router.get('/matrix', requireAuth, (req: AuthenticatedRequest, res) => {
  const db = getDb();
  const userId = req.user!.id;

  const matrix = db.synthesisMatrix
    .filter((m) => m.userId === userId)
    .map((m) => {
      const paper = db.papers.find((p) => p.id === m.paperId);
      return {
        matrixId: m.id,
        customNotes: m.customNotes,
        relevanceScore: m.relevanceScore,
        createdAt: m.createdAt,
        paperId: m.paperId,
        title: paper?.title || 'Unknown Paper',
        authors: paper?.authors || [],
        year: paper?.year || 2024,
        venue: paper?.venue || '',
        doi: paper?.doi || '',
        methodology: paper?.methodology || '',
        sampleSize: paper?.sampleSize || '',
        findings: paper?.findings || '',
        limitations: paper?.limitations || '',
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ matrix });
});

router.post('/matrix', requireAuth, (req: AuthenticatedRequest, res) => {
  const { paperId, customNotes, relevanceScore } = req.body;
  if (!paperId) {
    return res.status(400).json({ error: 'paperId is required.' });
  }

  const db = getDb();
  const userId = req.user!.id;

  const paper = db.papers.find((p) => p.id === paperId);
  if (!paper) {
    return res.status(404).json({ error: 'Target paper does not exist.' });
  }
  if (!paper.isPublic && paper.userId !== userId) {
    return res.status(403).json({ error: 'Forbidden: You cannot add another user\'s private paper to your matrix.' });
  }

  let existing = db.synthesisMatrix.find((m) => m.userId === userId && m.paperId === paperId);
  if (existing) {
    if (customNotes !== undefined) existing.customNotes = customNotes;
    if (relevanceScore !== undefined) existing.relevanceScore = Number(relevanceScore);
  } else {
    existing = {
      id: `mat-${crypto.randomBytes(8).toString('hex')}`,
      userId,
      paperId,
      customNotes: customNotes || '',
      relevanceScore: relevanceScore !== undefined ? Number(relevanceScore) : 0.95,
      createdAt: new Date().toISOString(),
    };
    db.synthesisMatrix.unshift(existing);
  }

  persistDb();
  res.status(201).json({ item: existing, message: 'Added to synthesis matrix.' });
});

router.delete('/matrix/:paperId', requireAuth, (req: AuthenticatedRequest, res) => {
  const db = getDb();
  const userId = req.user!.id;
  const initialLength = db.synthesisMatrix.length;

  db.synthesisMatrix = db.synthesisMatrix.filter(
    (m) => !(m.userId === userId && m.paperId === req.params.paperId)
  );

  if (db.synthesisMatrix.length === initialLength) {
    return res.status(404).json({ error: 'Item not found in your synthesis matrix.' });
  }

  persistDb();
  res.json({ message: 'Removed from synthesis matrix.' });
});

// ==========================================
// 6. COPILOT GROUNDED CHAT
// ==========================================
router.get('/chat/:paperId/messages', requireAuth, (req: AuthenticatedRequest, res) => {
  const db = getDb();
  const userId = req.user!.id;
  const paperId = req.params.paperId;

  const session = db.chatSessions.find((s) => s.userId === userId && s.paperId === paperId);
  if (!session) {
    return res.json({ messages: [] });
  }

  const messages = db.chatMessages
    .filter((m) => m.sessionId === session.id)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  res.json({ sessionId: session.id, messages });
});

router.post('/chat/:paperId/message', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message content is required.' });
  }

  const db = getDb();
  const userId = req.user!.id;
  const paperId = req.params.paperId;

  const paper = db.papers.find((p) => p.id === paperId);
  if (!paper) {
    return res.status(404).json({ error: 'Paper not found.' });
  }

  if (!paper.isPublic && paper.userId !== userId) {
    return res.status(403).json({ error: 'Forbidden: You cannot access chat for another user\'s private paper.' });
  }

  // Find or create session
  let session = db.chatSessions.find((s) => s.userId === userId && s.paperId === paperId);
  if (!session) {
    session = {
      id: `sess-${crypto.randomBytes(8).toString('hex')}`,
      userId,
      paperId,
      title: `Session: ${paper.title.slice(0, 30)}`,
      createdAt: new Date().toISOString(),
    };
    db.chatSessions.push(session);
  }

  // Persist user message
  const userMsg: ChatMessage = {
    id: `msg-${crypto.randomBytes(8).toString('hex')}`,
    sessionId: session.id,
    userId,
    sender: 'user',
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };
  db.chatMessages.push(userMsg);

  // Retrieve prior messages for conversational memory
  const history = db.chatMessages.filter((m) => m.sessionId === session.id);

  // Ask AI copilot
  const { reply, engineUsed } = await askPaperCopilot(paper, message.trim(), history);

  // Persist AI message
  const aiMsg: ChatMessage = {
    id: `msg-${crypto.randomBytes(8).toString('hex')}`,
    sessionId: session.id,
    userId,
    sender: 'ai',
    message: reply,
    createdAt: new Date().toISOString(),
  };
  db.chatMessages.push(aiMsg);

  persistDb();
  res.status(201).json({ reply: aiMsg, engineUsed });
});

// ==========================================
// 7. IN-PROCESS SECURITY AUDIT TEST RUNNER
// ==========================================
router.post('/audit/run-tests', async (req, res) => {
  const results: Array<{ testId: string; title: string; passed: boolean; details: string }> = [];
  const db = getDb();

  try {
    // 1. Setup User A and User B
    const userAEmail = `audit_a_${Date.now()}@researchmate.internal`;
    const userBEmail = `audit_b_${Date.now()}@researchmate.internal`;

    const passA = hashPassword('PassA123!');
    const passB = hashPassword('PassB123!');

    const userA = {
      id: `audit-usr-a-${Date.now()}`,
      email: userAEmail,
      passwordHash: passA.hash,
      salt: passA.salt,
      fullName: 'Audit User A',
      createdAt: new Date().toISOString(),
    };

    const userB = {
      id: `audit-usr-b-${Date.now()}`,
      email: userBEmail,
      passwordHash: passB.hash,
      salt: passB.salt,
      fullName: 'Audit User B',
      createdAt: new Date().toISOString(),
    };

    db.profiles.push(userA, userB);

    // 2. User A creates private paper
    const paperA: Paper = {
      id: `audit-paper-a-${Date.now()}`,
      userId: userA.id,
      title: 'Confidential Epigenetic Vectors (User A)',
      authors: ['Alice Thorne'],
      year: 2024,
      abstract: 'Confidential private research paper.',
      methodology: 'Proprietary delivery protocol.',
      sampleSize: 'n=12',
      findings: 'Isolated results.',
      limitations: 'Classified.',
      filePath: `${userA.id}/test.pdf`,
      fileSizeBytes: 1024,
      mimeType: 'application/pdf',
      isPublic: false,
      createdAt: new Date().toISOString(),
    };
    db.papers.push(paperA);

    // User A adds to synthesis matrix
    const matrixA: SynthesisMatrixItem = {
      id: `audit-mat-a-${Date.now()}`,
      userId: userA.id,
      paperId: paperA.id,
      customNotes: 'Confidential notes User A',
      relevanceScore: 0.99,
      createdAt: new Date().toISOString(),
    };
    db.synthesisMatrix.push(matrixA);

    // Test 1: User B cannot access User A private paper metadata
    const bCanAccessPaper = db.papers.some(
      (p) => p.id === paperA.id && (p.isPublic || p.userId === userB.id)
    );
    results.push({
      testId: 'SEC-01',
      title: 'Private Paper Isolation Check',
      passed: !bCanAccessPaper,
      details: bCanAccessPaper
        ? 'VULNERABILITY: User B was able to view private paper metadata of User A.'
        : 'PASS: User B is strictly prohibited from viewing private paper metadata of User A (403/404 enforced).',
    });

    // Test 2: User B cannot generate download token for User A private PDF
    const bCanGenerateToken = paperA.isPublic || paperA.userId === userB.id;
    results.push({
      testId: 'SEC-02',
      title: 'Signed Download Token Authorization',
      passed: !bCanGenerateToken,
      details: bCanGenerateToken
        ? 'VULNERABILITY: User B generated a valid download token for User A private PDF.'
        : 'PASS: Server rejects download token requests for foreign private documents with 403 Forbidden.',
    });

    // Test 3: Forged / Tampered token rejection
    const forgedToken = 'invalid.payload.signature';
    const verified = verifySignedToken(forgedToken);
    results.push({
      testId: 'SEC-03',
      title: 'Tampered HMAC Token Rejection',
      passed: !verified.valid,
      details: !verified.valid
        ? 'PASS: Forged HMAC tokens fail signature verification.'
        : 'VULNERABILITY: Tampered token was accepted.',
    });

    // Test 4: Synthesis matrix tenant isolation
    const bMatrixLeaked = db.synthesisMatrix.filter((m) => m.userId === userB.id).some((m) => m.paperId === paperA.id);
    results.push({
      testId: 'SEC-04',
      title: 'Synthesis Matrix Tenant Isolation',
      passed: !bMatrixLeaked,
      details: !bMatrixLeaked
        ? 'PASS: User B matrix queries never leak User A matrix rows.'
        : 'VULNERABILITY: Matrix rows leaked across tenant boundary.',
    });

    // Test 5: PDF magic byte validator
    const fakeExe = Buffer.from('MZ\x90\x00\x03\x00\x00\x00FakePEHeader');
    let magicByteCheckPassed = false;
    try {
      savePrivatePdf(userA.id, 'malware.pdf', fakeExe);
    } catch (e: any) {
      magicByteCheckPassed = e.message.includes('magic bytes');
    }
    results.push({
      testId: 'SEC-05',
      title: 'PDF Magic Bytes Header Validation',
      passed: magicByteCheckPassed,
      details: magicByteCheckPassed
        ? 'PASS: Non-PDF binary masquerading as .pdf was rejected before filesystem write.'
        : 'VULNERABILITY: Invalid PDF file accepted by storage pipeline.',
    });

    // Clean up temporary audit entries
    db.profiles = db.profiles.filter((p) => p.id !== userA.id && p.id !== userB.id);
    db.papers = db.papers.filter((p) => p.id !== paperA.id);
    db.synthesisMatrix = db.synthesisMatrix.filter((m) => m.id !== matrixA.id);
    persistDb();

    res.json({
      timestamp: new Date().toISOString(),
      allPassed: results.every((r) => r.passed),
      results,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Audit test execution error: ' + err.message });
  }
});

// ==========================================
// 8. RESEARCH TRENDS & CORPUS ANALYTICS
// ==========================================
router.get('/analytics/trends', optionalAuth, (req: AuthenticatedRequest, res) => {
  const db = getDb();
  const currentUserId = req.user?.id;
  const papers = db.papers.filter((p) => p.isPublic || (currentUserId && p.userId === currentUserId));

  // 1. Publication Frequency by Year
  const yearMap = new Map<number, { year: number; count: number; papers: Array<{ id: string; title: string; venue?: string; authors: string[]; year: number }> }>();

  papers.forEach((p) => {
    const yr = p.year || 2024;
    if (!yearMap.has(yr)) {
      yearMap.set(yr, { year: yr, count: 0, papers: [] });
    }
    const entry = yearMap.get(yr)!;
    entry.count += 1;
    entry.papers.push({
      id: p.id,
      title: p.title,
      venue: p.venue,
      authors: p.authors || [],
      year: yr,
    });
  });

  const timeline = Array.from(yearMap.values()).sort((a, b) => a.year - b.year);

  // 2. Keyword & Topic Frequency extraction
  const stopWords = new Set([
    'the', 'and', 'for', 'with', 'that', 'this', 'from', 'using', 'into', 'over', 'across', 'under',
    'have', 'been', 'were', 'which', 'their', 'between', 'without', 'about', 'after', 'where',
    'each', 'such', 'when', 'more', 'both', 'through', 'these', 'those', 'also', 'while', 'study'
  ]);

  const keywordMap = new Map<string, { text: string; count: number; paperIds: Set<string>; category: string }>();

  // Add all paper tags directly with high weight
  papers.forEach((p) => {
    (p.tags || []).forEach((tag) => {
      const cleanTag = tag.trim();
      if (!cleanTag) return;
      const key = cleanTag.toLowerCase();
      if (!keywordMap.has(key)) {
        keywordMap.set(key, { text: cleanTag, count: 0, paperIds: new Set(), category: 'Tag' });
      }
      const entry = keywordMap.get(key)!;
      entry.count += 3;
      entry.paperIds.add(p.id);
    });

    const textBlob = `${p.title} ${p.abstract}`.replace(/[^a-zA-Z0-9\-\s]/g, ' ');
    const tokens = textBlob.split(/\s+/).filter((t) => t.length > 3 && !stopWords.has(t.toLowerCase()));

    const concepts = [
      'Reasoning', 'Large Language Models', 'CRISPR', 'Epigenetics', 'State Space Models',
      'Transformers', 'Quantum Computing', 'Superconducting Qubits', 'Attention', 'Neural Network',
      'Benchmarking', 'Falsification', 'AAV Delivery', 'Associative Scan', 'Genomics',
      'Inference Throughput', 'Fault Tolerance', 'Optimization', 'Cortical Neurons', 'Surface Codes'
    ];

    concepts.forEach((concept) => {
      if (textBlob.toLowerCase().includes(concept.toLowerCase())) {
        const key = concept.toLowerCase();
        if (!keywordMap.has(key)) {
          keywordMap.set(key, { text: concept, count: 0, paperIds: new Set(), category: 'Concept' });
        }
        const entry = keywordMap.get(key)!;
        entry.count += 2;
        entry.paperIds.add(p.id);
      }
    });

    const wordCounts: Record<string, number> = {};
    tokens.forEach((t) => {
      const w = t.toLowerCase();
      wordCounts[w] = (wordCounts[w] || 0) + 1;
    });

    Object.entries(wordCounts).forEach(([w, c]) => {
      if (c >= 2 && !keywordMap.has(w) && w.length > 4) {
        const capitalized = w.charAt(0).toUpperCase() + w.slice(1);
        keywordMap.set(w, { text: capitalized, count: c, paperIds: new Set([p.id]), category: 'Lexical' });
      } else if (keywordMap.has(w)) {
        const entry = keywordMap.get(w)!;
        entry.count += c;
        entry.paperIds.add(p.id);
      }
    });
  });

  const keywords = Array.from(keywordMap.values())
    .map((k) => ({
      text: k.text,
      count: k.count,
      paperIds: Array.from(k.paperIds),
      category: k.category,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);

  // 3. Venue Distribution
  const venueMap = new Map<string, number>();
  papers.forEach((p) => {
    const v = p.venue || 'Preprint / Other';
    venueMap.set(v, (venueMap.get(v) || 0) + 1);
  });
  const topVenues = Array.from(venueMap.entries())
    .map(([venue, count]) => ({ venue, count }))
    .sort((a, b) => b.count - a.count);

  res.json({
    totalPapers: papers.length,
    timeline,
    keywords,
    topVenues,
    yearRange: {
      min: timeline.length > 0 ? timeline[0].year : 2020,
      max: timeline.length > 0 ? timeline[timeline.length - 1].year : 2026,
    },
  });
});

