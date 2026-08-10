import { useCallback, useEffect, useRef, useState } from 'react'
import { loadFromServer, syncCollection, pullFromServer, deleteItems, isBackendConfigured } from '../lib/api'

/**
 * Hook di sincronizzazione per una collezione (expenses | checklist).
 *
 * - All'avvio: carica dal server (fonte di verità), fallback su cache locale.
 * - Ogni POLL_INTERVAL: PUSH delle modifiche locali + PULL delle novità
 *   dal server (elementi aggiunti da altri telefoni arrivano qui; elementi
 *   eliminati da altri spariscono grazie ai tombstone).
 * - `removeItems(ids)`: elimina esplicitamente (registra tombstone sul server).
 * - Espone `online`: true se il backend è configurato e raggiungibile.
 */
export default function useServerSync(kind, fallbackItems) {
  const [items, setItems] = useState(() => fallbackItems)
  const [online, setOnline] = useState(isBackendConfigured())
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState(null)
  const itemsRef = useRef(items)
  const syncTimer = useRef(null)

  // Keep ref in sync for use inside interval callback
  useEffect(() => { itemsRef.current = items }, [items])

  const applyRemoval = useCallback((ids) => {
    const idSet = new Set(ids.map(String))
    setItems(prev => {
      const next = prev.filter(i => !idSet.has(String(i.id)))
      itemsRef.current = next
      return next
    })
  }, [])

  const doSync = useCallback(async () => {
    if (!isBackendConfigured()) {
      setOnline(false)
      return
    }
    setSyncing(true)
    // 1. PUSH: invia le modifiche locali al server
    const result = await syncCollection(kind, itemsRef.current)
    if (result.pruned && result.pruned.length > 0) {
      applyRemoval(result.pruned)
    }
    // 2. PULL: ricevi le novità dagli altri dispositivi
    const pull = await pullFromServer(kind, itemsRef.current)
    if (pull.changed) {
      const merged = pull.items
      itemsRef.current = merged
      setItems(merged)
      if (pull.pruned && pull.pruned.length > 0) {
        applyRemoval(pull.pruned)
      }
    }
    setSyncing(false)
    if (result.ok && pull.changed !== undefined) {
      setOnline(true)
      setLastSync(new Date())
    } else {
      setOnline(false)
    }
    return result
  }, [kind, applyRemoval])

  // Initial load: server wins
  useEffect(() => {
    let cancelled = false
    loadFromServer(kind, fallbackItems).then(({ items: serverItems, fromServer }) => {
      if (cancelled) return
      if (fromServer) {
        setItems(serverItems)
      }
      setOnline(isBackendConfigured())
    })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind])

  // Polling periodico
  useEffect(() => {
    if (!isBackendConfigured()) return
    syncTimer.current = setInterval(() => { doSync() }, 8000)
    return () => { if (syncTimer.current) clearInterval(syncTimer.current) }
  }, [doSync])

  const setItemsAndSync = useCallback((updater) => {
    setItems(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      itemsRef.current = next
      // Sincronizza subito (fire-and-forget, il polling copre i fallimenti)
      if (isBackendConfigured()) {
        syncCollection(kind, next)
      }
      return next
    })
  }, [kind])

  // Eliminazione esplicita: aggiorna il locale E registra il tombstone sul server
  const removeItems = useCallback(async (ids) => {
    const idList = Array.isArray(ids) ? ids : [ids]
    applyRemoval(idList)
    if (isBackendConfigured()) {
      await deleteItems(kind, idList)
    }
  }, [kind, applyRemoval])

  return {
    items,
    setItems: setItemsAndSync,
    removeItems,
    online,
    syncing,
    lastSync,
    forceSync: doSync,
  }
}
