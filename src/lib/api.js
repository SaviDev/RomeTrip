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

export async function fetchDeletedExpenses() {
  return request('/api/expenses/deleted')
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

export async function fetchDeletedChecklist() {
  return request('/api/checklist/deleted')
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

// Normalizza id per il confronto (numerico o stringa)
const key = i => String(i.id)

/**
 * PUSH: persiste le modifiche locali sul server (create + update),
 * applica i tombstone (elementi eliminati da altri spariscono dal locale).
 * NON elimina mai dal server elementi "mancanti in locale" — quelli
 * potrebbero essere stati aggiunti da un altro dispositivo (il pull li
 * porterà qui). Le eliminazioni si propagano solo via tombstone espliciti.
 *
 * Returns: { ok, errors, pruned } — pruned = id rimossi dal locale perché
 * eliminati da un altro dispositivo (il chiamante deve aggiornare lo stato).
 */
export async function syncCollection(kind, localItems) {
  if (!isBackendConfigured()) {
    writeCache(kind, localItems)
    return { ok: true, errors: [], pruned: [] }
  }

  const errors = []
  const pruned = []
  try {
    const [serverItems, serverDeleted] = await Promise.all([
      kind === 'expenses' ? fetchExpenses() : fetchChecklist(),
      kind === 'expenses' ? fetchDeletedExpenses() : fetchDeletedChecklist(),
    ])

    const serverIds = new Set(serverItems.map(key))
    const deletedSet = new Set(serverDeleted.map(String))

    // 0. PRUNE: elementi locali che risultano eliminati sul server (tombstone)
    //    → qualcun altro li ha cancellati: rimuovili anche qui.
    //    Questo impedisce il loop "delete/recreate" tra due telefoni.
    const kept = localItems.filter(i => !deletedSet.has(String(i.id)))
    if (kept.length !== localItems.length) {
      const removedIds = localItems.filter(i => deletedSet.has(String(i.id))).map(key)
      pruned.push(...removedIds)
      localItems = kept
      writeCache(kind, localItems)
    }

    // 1. Elementi presenti solo in locale e NON tombstoned → creali sul server
    for (const item of localItems) {
      if (!serverIds.has(key(item)) && !deletedSet.has(String(item.id))) {
        try {
          const created = await (kind === 'expenses' ? addExpense(item) : addChecklistItem(item))
          serverIds.add(key(created))
        } catch (e) {
          errors.push(`create ${item.id}: ${e.message}`)
        }
      }
    }

    // 2. Elementi presenti su entrambi → aggiorna (il locale vince: è l'ultima modifica)
    const serverById = new Map(serverItems.map(i => [key(i), i]))
    for (const item of localItems) {
      const srv = serverById.get(key(item))
      if (srv && JSON.stringify(srv) !== JSON.stringify(item)) {
        try {
          await (kind === 'expenses' ? updateExpense(item.id, item) : updateChecklistItem(item.id, item))
        } catch (e) {
          errors.push(`update ${item.id}: ${e.message}`)
        }
      }
    }

    writeCache(kind, localItems)
    return { ok: errors.length === 0, errors, pruned }
  } catch (e) {
    // Server irraggiungibile: resta su cache locale, nessun danno
    writeCache(kind, localItems)
    return { ok: false, errors: [`server: ${e.message}`], pruned }
  }
}

/**
 * PULL: scarica gli elementi dal server e li fonde con quelli locali.
 * - elementi SOLO sul server (aggiunti da altri dispositivi) → aggiunti qui
 * - elementi su entrambi → vince il LOCALE (potrebbe avere modifiche non
 *   ancora pushatte; il prossimo push le invierà)
 * - elementi solo locali → restano (il push li creerà)
 * - elementi tombstoned → rimossi
 */
export async function pullFromServer(kind, localItems) {
  if (!isBackendConfigured()) return { items: localItems, changed: false }
  try {
    const [serverItems, serverDeleted] = await Promise.all([
      kind === 'expenses' ? fetchExpenses() : fetchChecklist(),
      kind === 'expenses' ? fetchDeletedExpenses() : fetchDeletedChecklist(),
    ])
    const deletedSet = new Set(serverDeleted.map(String))
    const localIds = new Set(localItems.map(key))

    const localKept = localItems.filter(i => !deletedSet.has(String(i.id)))
    const newFromServer = serverItems.filter(s => !localIds.has(key(s)) && !deletedSet.has(String(s.id)))

    const changed =
      localKept.length !== localItems.length ||
      newFromServer.length > 0

    const merged = [...newFromServer, ...localKept]
    if (changed) writeCache(kind, merged)
    return { items: merged, changed, pruned: localItems.filter(i => deletedSet.has(String(i.id))).map(key) }
  } catch {
    return { items: localItems, changed: false, pruned: [] }
  }
}

/**
 * Elimina esplicitamente gli elementi (chiama il DELETE che registra il
 * tombstone sul server). Usato quando l'UTENTE elimina — non dal sync.
 */
export async function deleteItems(kind, ids) {
  if (!isBackendConfigured() || ids.length === 0) return { ok: true, errors: [] }
  const errors = []
  for (const id of ids) {
    try {
      await (kind === 'expenses' ? deleteExpense(id) : deleteChecklistItem(id))
    } catch (e) {
      errors.push(`delete ${id}: ${e.message}`)
    }
  }
  return { ok: errors.length === 0, errors }
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
    const [items, deleted] = await Promise.all([
      kind === 'expenses' ? fetchExpenses() : fetchChecklist(),
      kind === 'expenses' ? fetchDeletedExpenses() : fetchDeletedChecklist(),
    ])
    const deletedSet = new Set(deleted.map(String))
    // Applica i tombstone anche alla cache locale (elementi eliminati da altri)
    let cached = readCache(kind) || []
    cached = cached.filter(i => !deletedSet.has(String(i.id)))
    const merged = [...items, ...cached.filter(i => !items.some(s => key(s) === key(i)))]
    if (merged.length > 0 || items.length >= 0) {
      writeCache(kind, merged)
      return { items: merged, fromServer: true }
    }
    return { items: fallbackItems, fromServer: false }
  } catch {
    const cached = readCache(kind)
    return { items: cached || fallbackItems, fromServer: false }
  }
}
