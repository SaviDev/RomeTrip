/**
 * Client API per il backend Toscana 2026.
 *
 * Configurazione tramite variabili Vite (file .env nella root del progetto):
 *   VITE_API_URL   = "https://toscana.tuomeccanico.it"  (o http://localhost:4000 in dev)
 *   VITE_API_TOKEN = "toscana2026-maremma"
 *
 * Strategia: il server è la fonte di verità. localStorage resta come cache
 * offline per il primo render e per quando il server non è raggiungibile.
 */

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
const API_TOKEN = import.meta.env.VITE_API_TOKEN || 'toscana2026-maremma'

const CACHE_KEYS = {
  expenses: 'toscana_spese_v1',
  checklist: 'toscana_checklist_v2',
}

export const isBackendConfigured = () => API_URL !== ''

function headers() {
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + API_TOKEN,
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: headers(),
  })
  if (!res.ok) {
    throw new Error(`API ${path} → HTTP ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

// ---------- Cache locale (offline fallback + primo render) ----------
export function readCache(kind) {
  try {
    const raw = localStorage.getItem(CACHE_KEYS[kind])
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function writeCache(kind, data) {
  try {
    localStorage.setItem(CACHE_KEYS[kind], JSON.stringify(data))
  } catch { /* quota piena: ignora */ }
}

// ---------- Spese ----------
export async function fetchExpenses() {
  return request('/api/expenses')
}

export async function addExpense(expense) {
  return request('/api/expenses', { method: 'POST', body: JSON.stringify(expense) })
}

export async function updateExpense(id, expense) {
  return request(`/api/expenses/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(expense) })
}

export async function deleteExpense(id) {
  return request(`/api/expenses/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

// ---------- Checklist ----------
export async function fetchChecklist() {
  return request('/api/checklist')
}

export async function addChecklistItem(item) {
  return request('/api/checklist', { method: 'POST', body: JSON.stringify(item) })
}

export async function updateChecklistItem(id, item) {
  return request(`/api/checklist/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(item) })
}

export async function deleteChecklistItem(id) {
  return request(`/api/checklist/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

/**
 * Persiste la lista completa sul server senza conflitti:
 * per ogni elemento fa un'operazione granulare, così due telefoni
 * che modificano in parallelo non si sovrascrivono a vicenda.
 *
 * Returns: { ok, errors } — errors = array di errori per le opzioni fallite.
 */
export async function syncCollection(kind, localItems) {
  if (!isBackendConfigured()) {
    // Niente backend: localStorage è l'unico storage
    writeCache(kind, localItems)
    return { ok: true, errors: [] }
  }

  const errors = []
  try {
    const serverItems = await (kind === 'expenses' ? fetchExpenses() : fetchChecklist())

    const serverIds = new Set(serverItems.map(i => String(i.id)))
    const localIds = new Set(localItems.map(i => String(i.id)))
    const keyFor = kind === 'expenses' ? 'id' : 'id'

    // 1. Elementi presenti solo in locale → creali sul server
    for (const item of localItems) {
      if (!serverIds.has(String(item.id))) {
        try {
          const created = await (kind === 'expenses' ? addExpense(item) : addChecklistItem(item))
          serverIds.add(String(created.id))
        } catch (e) {
          errors.push(`create ${item.id}: ${e.message}`)
        }
      }
    }

    // 2. Elementi presenti su entrambi → aggiorna (il locale vince: è l'ultima modifica)
    const serverById = new Map(serverItems.map(i => [String(i.id), i]))
    for (const item of localItems) {
      const srv = serverById.get(String(item.id))
      if (srv && JSON.stringify(srv) !== JSON.stringify(item)) {
        try {
          await (kind === 'expenses' ? updateExpense(item.id, item) : updateChecklistItem(item.id, item))
        } catch (e) {
          errors.push(`update ${item.id}: ${e.message}`)
        }
      }
    }

    // 3. Elementi sul server ma non in locale → rimuovili (qualcun altro li ha cancellati)
    for (const item of serverItems) {
      if (!localIds.has(String(item.id))) {
        try {
          await (kind === 'expenses' ? deleteExpense(item.id) : deleteChecklistItem(item.id))
        } catch (e) {
          errors.push(`delete ${item.id}: ${e.message}`)
        }
      }
    }

    writeCache(kind, localItems)
    return { ok: errors.length === 0, errors }
  } catch (e) {
    // Server irraggiungibile: resta su cache locale, nessun danno
    writeCache(kind, localItems)
    return { ok: false, errors: [`server: ${e.message}`] }
  }
}

/**
 * Carica i dati dal server (fonte di verità), con fallback su cache locale.
 * Ritorna { items, fromServer }.
 */
export async function loadFromServer(kind, fallbackItems) {
  if (!isBackendConfigured()) {
    const cached = readCache(kind)
    return { items: cached || fallbackItems, fromServer: false }
  }
  try {
    const items = await (kind === 'expenses' ? fetchExpenses() : fetchChecklist())
    if (items && items.length > 0) {
      writeCache(kind, items)
      return { items, fromServer: true }
    }
    // Server vuoto → se c'è cache locale, caricala e sincronizza dopo
    const cached = readCache(kind)
    return { items: cached || fallbackItems, fromServer: false }
  } catch {
    const cached = readCache(kind)
    return { items: cached || fallbackItems, fromServer: false }
  }
}
