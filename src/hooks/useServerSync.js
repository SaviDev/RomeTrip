import { useCallback, useEffect, useRef, useState } from 'react'
import { loadFromServer, syncCollection, isBackendConfigured } from '../lib/api'

/**
 * Hook di sincronizzazione per una collezione (expenses | checklist).
 *
 * - All'avvio: carica dal server (fonte di verità), fallback su cache locale.
 * - Ogni POLL_INTERVAL: sincronizza lo stato locale col server (CRUD granulare,
 *   niente overwrite ciechi → due telefoni possono modificare in parallelo).
 * - Espone `online`: true se il backend è configurato e raggiungibile.
 * - Espone `forceSync()` per sincronizzare subito dopo una modifica.
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

  const doSync = useCallback(async () => {
    if (!isBackendConfigured()) {
      setOnline(false)
      return
    }
    setSyncing(true)
    const result = await syncCollection(kind, itemsRef.current)
    setSyncing(false)
    if (result.ok) {
      setOnline(true)
      setLastSync(new Date())
    } else {
      // errors presenti: server irraggiungibile o alcune op fallite
      setOnline(false)
    }
    return result
  }, [kind])

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
    syncTimer.current = setInterval(() => { doSync() }, 10000)
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

  return {
    items,
    setItems: setItemsAndSync,
    online,
    syncing,
    lastSync,
    forceSync: doSync,
  }
}
