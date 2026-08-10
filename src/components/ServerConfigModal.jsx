import React, { useState } from 'react'
import { getApiUrl, getApiToken, setCustomBackendConfig, clearCustomBackendConfig, isBackendConfigured } from '../lib/api'

export default function ServerConfigModal({ isOpen, onClose, onConfigSaved }) {
  const [url, setUrl] = useState(() => getApiUrl())
  const [token, setToken] = useState(() => getApiToken())
  const [testing, setTesting] = useState(false)
  const [statusMsg, setStatusMsg] = useState(null)

  if (!isOpen) return null

  const handleTestAndSave = async (e) => {
    e.preventDefault()
    setTesting(true)
    setStatusMsg({ type: 'info', text: 'Connessione al server in corso...' })

    const cleanUrl = url.trim().replace(/\/+$/, '')
    const cleanToken = token.trim()

    if (!cleanUrl) {
      clearCustomBackendConfig()
      setStatusMsg({ type: 'warning', text: 'Configurazione rimossa. Modalità locale (offline).' })
      setTesting(false)
      if (onConfigSaved) onConfigSaved()
      setTimeout(() => onClose(), 1200)
      return
    }

    try {
      const res = await fetch(`${cleanUrl}/api/expenses`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + cleanToken
        }
      })

      if (res.ok) {
        setCustomBackendConfig(cleanUrl, cleanToken)
        setStatusMsg({ type: 'success', text: '✅ Connessione riuscita! Sincronizzazione Cloud attiva.' })
        if (onConfigSaved) onConfigSaved()
        setTimeout(() => onClose(), 1200)
      } else {
        setStatusMsg({ type: 'error', text: `⚠️ Risposta server Errore HTTP ${res.status}. Verifica il token o l'URL.` })
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: `❌ Impossibile raggiungere il server (${err.message}). Verifica che il tunnel o il PC sia acceso.` })
    } finally {
      setTesting(false)
    }
  }

  const handleReset = () => {
    clearCustomBackendConfig()
    setUrl('')
    setToken('toscana2026-maremma')
    setStatusMsg({ type: 'info', text: 'Ripristinata configurazione predefinita.' })
    if (onConfigSaved) onConfigSaved()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-stone-200 relative overflow-hidden space-y-4">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🖥️</span>
            <h3 className="font-black text-base text-[#1E2923]">Configurazione Server Dedicated PC</h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 text-xs font-bold p-1"
          >
            ✖
          </button>
        </div>

        {/* Current status pill */}
        <div className="flex items-center justify-between text-xs font-bold p-3 rounded-2xl bg-stone-50 border border-stone-200">
          <span className="text-stone-500 uppercase tracking-widest text-[10px]">Stato attuale:</span>
          {isBackendConfigured() ? (
            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              🟢 Sincronizzazione Server Attiva
            </span>
          ) : (
            <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300 font-mono">
              🔴 Modalità Locale (Offline)
            </span>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleTestAndSave} className="space-y-4">
          <div>
            <label className="text-xs font-black uppercase text-stone-600 block mb-1">
              URL Backend / Tunnel Cloudflare *
            </label>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="es. https://toscana-backend.trycloudflare.com"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
            />
            <span className="text-[10px] text-stone-400 mt-1 block">
              Incolla qui l'URL fornito da <code>cloudflared</code> o <code>ngrok</code> avviato sul tuo PC.
            </span>
          </div>

          <div>
            <label className="text-xs font-black uppercase text-stone-600 block mb-1">
              Token di Autenticazione
            </label>
            <input
              type="text"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="toscana2026-maremma"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
            />
          </div>

          {/* Status Message Alert */}
          {statusMsg && (
            <div className={`p-3 rounded-xl text-xs font-bold border ${
              statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
              statusMsg.type === 'error' ? 'bg-red-50 text-red-900 border-red-300' :
              'bg-amber-50 text-amber-900 border-amber-300'
            }`}>
              {statusMsg.text}
            </div>
          )}

          <div className="flex justify-between items-center pt-2 gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 text-stone-400 hover:text-stone-700 text-xs font-bold underline"
            >
              Reset
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl"
              >
                Chiudi
              </button>
              <button
                type="submit"
                disabled={testing}
                className="px-5 py-2 bg-[#C85A32] hover:bg-[#a64724] text-white text-xs font-black rounded-xl shadow transition-all active:scale-95 disabled:opacity-50"
              >
                {testing ? 'Test in corso...' : '🔌 Connetti & Salva'}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  )
}
