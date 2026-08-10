/**
 * Toscana 2026 — Backend di sincronizzazione
 * Express + file JSON locale (data/db.json), CRUD granulare, token auth.
 *
 * Avvio:
 *   TOSCANA_TOKEN=il-tuo-token node server.js
 *   (senza token, usa la costante di default sotto — cambiarla in produzione)
 */
import express from 'express'
import cors from 'cors'
import http from 'http'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, 'data')
const DB_FILE = path.join(DATA_DIR, 'db.json')

const PORT = process.env.PORT || 4000
const AUTH_TOKEN = process.env.TOSCANA_TOKEN || 'toscana2026-maremma'

// ---------- Storage su file JSON ----------
const DEFAULT_DB = { expenses: [], checklist: [] }

async function loadDb() {
  try {
    const raw = await fs.readFile(DB_FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    return {
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
      checklist: Array.isArray(parsed.checklist) ? parsed.checklist : [],
    }
  } catch {
    return { ...DEFAULT_DB, expenses: [], checklist: [] }
  }
}

async function saveDb(db) {
  await fs.mkdir(DATA_DIR, { recursive: true })
  const tmp = DB_FILE + '.tmp'
  await fs.writeFile(tmp, JSON.stringify(db, null, 2))
  await fs.rename(tmp, DB_FILE)
}

// ---------- App ----------
const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

// Auth middleware: Authorization: Bearer <token>  oppure  ?token=<token>
function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const bearer = header.startsWith('Bearer ') ? header.slice(7) : ''
  const queryToken = req.query.token || ''
  if (bearer === AUTH_TOKEN || queryToken === AUTH_TOKEN) {
    return next()
  }
  return res.status(401).json({ error: 'Unauthorized' })
}
app.use('/api', requireAuth)

// ---------- Helpers CRUD generici ----------
function validateExpense(body) {
  const { title, amount, payer, category, involved, date } = body || {}
  if (!title || typeof title !== 'string' || !title.trim()) return null
  const num = Number(amount)
  if (!Number.isFinite(num) || num <= 0) return null
  if (!payer || typeof payer !== 'string') return null
  return {
    id: body.id && typeof body.id === 'string' ? body.id : 'exp-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    title: title.trim(),
    amount: Math.round(num * 100) / 100,
    payer,
    category: category || '🛒 Spesa / Cibo',
    involved: Array.isArray(involved) ? involved : [],
    date: date || new Date().toISOString().split('T')[0],
  }
}

function validateChecklistItem(body) {
  const { item, assignedTo, checkedBy, category } = body || {}
  if (!item || typeof item !== 'string' || !item.trim()) return null
  return {
    id: body.id !== undefined && body.id !== null ? body.id : Date.now() + Math.floor(Math.random() * 1000),
    item: item.trim(),
    assignedTo: Array.isArray(assignedTo) ? assignedTo : [],
    checkedBy: Array.isArray(checkedBy) ? checkedBy : [],
    category: category || 'Casa / Cucina',
  }
}

// ---------- SPESE ----------
// GET /api/expenses — elenco completo
app.get('/api/expenses', async (_req, res) => {
  const db = await loadDb()
  res.json(db.expenses)
})

// POST /api/expenses — aggiunge UNA spesa (niente overwrite dell'array!)
app.post('/api/expenses', async (req, res) => {
  const expense = validateExpense(req.body)
  if (!expense) return res.status(400).json({ error: 'Dati spesa non validi' })
  const db = await loadDb()
  db.expenses = [expense, ...db.expenses]
  await saveDb(db)
  res.status(201).json(expense)
})

// PUT /api/expenses/:id — aggiorna UNA spesa
app.put('/api/expenses/:id', async (req, res) => {
  const db = await loadDb()
  const idx = db.expenses.findIndex(e => e.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Spesa non trovata' })
  const updated = validateExpense({ ...req.body, id: req.params.id })
  if (!updated) return res.status(400).json({ error: 'Dati spesa non validi' })
  db.expenses[idx] = updated
  await saveDb(db)
  res.json(updated)
})

// DELETE /api/expenses/:id — elimina UNA spesa
app.delete('/api/expenses/:id', async (req, res) => {
  const db = await loadDb()
  const before = db.expenses.length
  db.expenses = db.expenses.filter(e => e.id !== req.params.id)
  if (db.expenses.length === before) return res.status(404).json({ error: 'Spesa non trovata' })
  await saveDb(db)
  res.json({ status: 'ok' })
})

// ---------- CHECKLIST ----------
// GET /api/checklist — elenco completo
app.get('/api/checklist', async (_req, res) => {
  const db = await loadDb()
  res.json(db.checklist)
})

// POST /api/checklist — aggiunge UN oggetto
app.post('/api/checklist', async (req, res) => {
  const item = validateChecklistItem(req.body)
  if (!item) return res.status(400).json({ error: 'Dati oggetto non validi' })
  const db = await loadDb()
  db.checklist = [...db.checklist, item]
  await saveDb(db)
  res.status(201).json(item)
})

// PUT /api/checklist/:id — aggiorna UN oggetto (id può essere numerico o stringa)
app.put('/api/checklist/:id', async (req, res) => {
  const db = await loadDb()
  const id = req.params.id
  const idx = db.checklist.findIndex(c => String(c.id) === String(id))
  if (idx === -1) return res.status(404).json({ error: 'Oggetto non trovato' })
  const updated = validateChecklistItem({ ...req.body, id: db.checklist[idx].id })
  if (!updated) return res.status(400).json({ error: 'Dati oggetto non validi' })
  db.checklist[idx] = updated
  await saveDb(db)
  res.json(updated)
})

// DELETE /api/checklist/:id — elimina UN oggetto
app.delete('/api/checklist/:id', async (req, res) => {
  const db = await loadDb()
  const id = req.params.id
  const before = db.checklist.length
  db.checklist = db.checklist.filter(c => String(c.id) !== String(id))
  if (db.checklist.length === before) return res.status(404).json({ error: 'Oggetto non trovato' })
  await saveDb(db)
  res.json({ status: 'ok' })
})

// ---------- Health check ----------
app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

// ---------- Avvio ----------
const server = http.createServer(app)
server.listen(PORT, () => {
  console.log(`🚀 Toscana Backend in esecuzione su http://localhost:${PORT}`)
  console.log(`📦 Database: ${DB_FILE}`)
  console.log(`🔑 Auth: Bearer ${AUTH_TOKEN === 'toscana2026-maremma' ? '(DEFAULT — cambiarlo con TOSCANA_TOKEN!)' : '(configurato)'}`)
})

// Graceful shutdown
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    console.log(`\nRicevuto ${sig}, chiusura...`)
    server.close(() => process.exit(0))
  })
}
