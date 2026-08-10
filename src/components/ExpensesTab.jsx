import React, { useState, useEffect } from 'react'

const DEFAULT_MEMBERS = [
  "Io (Luca)",
  "Bass",
  "Cla",
  "Maddi",
  "Meryland",
  "Dave",
  "Chiara",
  "Onga"
]

const CATEGORIES = [
  "🛒 Spesa / Cibo",
  "🚗 Benzina / Autostrada",
  "🍽️ Ristorante / Bar",
  "🏠 Alloggio / Struttura",
  "🎟️ Attività / Ticket",
  "💸 Rimborso / Pareggio",
  "📦 Altro"
]

const INITIAL_EXPENSES = [
  {
    id: 'exp-1',
    title: 'Caparra Poderi Di Montemerano',
    amount: 300,
    payer: 'Dave',
    involved: ["Io (Luca)", "Bass", "Cla", "Maddi", "Meryland", "Dave", "Chiara", "Onga"],
    category: '🏠 Alloggio / Struttura',
    date: '2026-08-01'
  },
  {
    id: 'exp-2',
    title: 'Prima Spesa Conad Albinia (Cibo & Bevande)',
    amount: 120,
    payer: 'Bass',
    involved: ["Io (Luca)", "Bass", "Cla", "Maddi", "Meryland", "Dave", "Chiara", "Onga"],
    category: '🛒 Spesa / Cibo',
    date: '2026-08-11'
  }
]

export default function ExpensesTab({ groupMembers = DEFAULT_MEMBERS }) {
  // Filter members to actual participants (exclude helper tags if passed from app)
  const participants = groupMembers.filter(m => m !== "Da comprare" && m !== "Chiedere alla struttura")

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('toscana_spese_v1')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length >= 0) {
          return parsed.map(exp => ({
            ...exp,
            payer: exp.payer === 'Io' ? 'Io (Luca)' : exp.payer,
            involved: (exp.involved || []).map(p => p === 'Io' ? 'Io (Luca)' : p)
          }))
        }
      } catch (e) {
        console.error("Errore caricamento spese:", e)
      }
    }
    return INITIAL_EXPENSES
  })

  // State for Add / Edit Form
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [payer, setPayer] = useState(participants[0] || 'Io (Luca)')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [involved, setInvolved] = useState(participants)
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])

  // Sub-view filter inside Spese tab ('tutti', or specific person, 'saldi', 'pareggio')
  const [activeSubTab, setActiveSubTab] = useState('spese') // 'spese', 'saldi', 'pareggio'
  const [selectedPerson, setSelectedPerson] = useState('tutti')
  const [categoryFilter, setCategoryFilter] = useState('tutti')
  const [copiedNotification, setCopiedNotification] = useState(false)

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('toscana_spese_v1', JSON.stringify(expenses))
  }, [expenses])

  // Open edit modal / form with existing data
  const handleStartEdit = (exp) => {
    setEditingId(exp.id)
    setTitle(exp.title)
    setAmount(exp.amount.toString())
    setPayer(exp.payer)
    setCategory(exp.category)
    setInvolved(exp.involved)
    setDate(exp.date || new Date().toISOString().split('T')[0])
    setShowForm(true)
  }

  // Reset form
  const resetForm = () => {
    setEditingId(null)
    setTitle('')
    setAmount('')
    setPayer(participants[0] || 'Io (Luca)')
    setCategory(CATEGORIES[0])
    setInvolved(participants)
    setDate(new Date().toISOString().split('T')[0])
    setShowForm(false)
  }

  // Submit Add/Edit Expense
  const handleSubmit = (e) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)
    if (!title.trim() || isNaN(numAmount) || numAmount <= 0) {
      alert("Inserisci un titolo valido e un importo maggiore di 0.")
      return
    }
    if (involved.length === 0) {
      alert("Seleziona almeno una persona coinvolta nella spesa.")
      return
    }

    if (editingId) {
      // Update existing
      setExpenses(prev => prev.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            title: title.trim(),
            amount: numAmount,
            payer,
            category,
            involved,
            date
          }
        }
        return item
      }))
    } else {
      // Add new
      const newExp = {
        id: 'exp-' + Date.now(),
        title: title.trim(),
        amount: numAmount,
        payer,
        category,
        involved,
        date
      }
      setExpenses(prev => [newExp, ...prev])
    }

    resetForm()
  }

  // Delete expense
  const handleDelete = (id, expTitle) => {
    if (window.confirm(`Sei sicuro di voler eliminare la spesa "${expTitle}"?`)) {
      setExpenses(prev => prev.filter(e => e.id !== id))
    }
  }

  // Restore default sample expenses
  const handleRestoreDefaults = () => {
    if (window.confirm("Vuoi ripristinare le spese di esempio iniziali?")) {
      setExpenses(INITIAL_EXPENSES)
    }
  }

  // Handle settling a debt transfer between two participants
  const handleSettleTransfer = (from, to, amt) => {
    if (window.confirm(`Vuoi registrare il rimborso di € ${amt.toFixed(2)} da ${from} a ${to} come completato e consolidato?`)) {
      const settlementExpense = {
        id: 'exp-' + Date.now(),
        title: `Rimborso effettuato: ${from} ➔ ${to}`,
        amount: amt,
        payer: from,
        involved: [to],
        category: '💸 Rimborso / Pareggio',
        date: new Date().toISOString().split('T')[0]
      }
      setExpenses(prev => [settlementExpense, ...prev])
    }
  }

  // Toggle person in involved list
  const toggleInvolved = (person) => {
    if (involved.includes(person)) {
      setInvolved(prev => prev.filter(p => p !== person))
    } else {
      setInvolved(prev => [...prev, person])
    }
  }

  const selectAllInvolved = () => setInvolved(participants)
  const deselectAllInvolved = () => setInvolved([])

  // --- TRICOUNT CALCULATIONS ---
  const totalGroupExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0)

  // Calculate per person metrics: totalPaid, totalOwed, balance
  const personStats = {}
  participants.forEach(p => {
    personStats[p] = { paid: 0, owed: 0, balance: 0 }
  })

  expenses.forEach(exp => {
    const cost = exp.amount
    // Add to payer's total paid
    if (personStats[exp.payer]) {
      personStats[exp.payer].paid += cost
    }

    // Distribute cost among involved people
    if (exp.involved && exp.involved.length > 0) {
      const share = cost / exp.involved.length
      exp.involved.forEach(p => {
        if (personStats[p]) {
          personStats[p].owed += share
        }
      })
    }
  })

  // Compute balance = paid - owed
  participants.forEach(p => {
    personStats[p].balance = personStats[p].paid - personStats[p].owed
  })

  // --- TRICOUNT OPTIMAL DEBT SETTLEMENT ALGORITHM ---
  // Calculates minimal transfer transactions to settle all debts
  const calculateSettlements = () => {
    const debtors = []
    const creditors = []

    participants.forEach(p => {
      const bal = Math.round(personStats[p].balance * 100) / 100
      if (bal < -0.01) {
        debtors.push({ person: p, amount: Math.abs(bal) })
      } else if (bal > 0.01) {
        creditors.push({ person: p, amount: bal })
      }
    })

    // Sort debtors descending by amount owed, creditors descending by amount to receive
    debtors.sort((a, b) => b.amount - a.amount)
    creditors.sort((a, b) => b.amount - a.amount)

    const transactions = []
    let i = 0
    let j = 0

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i]
      const creditor = creditors[j]
      const payment = Math.min(debtor.amount, creditor.amount)

      if (payment > 0.01) {
        transactions.push({
          from: debtor.person,
          to: creditor.person,
          amount: Math.round(payment * 100) / 100
        })
      }

      debtor.amount -= payment
      creditor.amount -= payment

      if (debtor.amount <= 0.01) i++
      if (creditor.amount <= 0.01) j++
    }

    return transactions
  }

  const settlements = calculateSettlements()

  // Filtered expenses list
  const filteredExpenses = expenses.filter(exp => {
    const matchesPerson = selectedPerson === 'tutti' || exp.payer === selectedPerson || (exp.involved && exp.involved.includes(selectedPerson))
    const matchesCategory = categoryFilter === 'tutti' || exp.category === categoryFilter
    return matchesPerson && matchesCategory
  })

  // Copy WhatsApp Summary
  const copyWhatsAppSummary = () => {
    let text = `🍷 *TOSCANA 2026 - RIEPILOGO SPESE TRICOUNT* 📊\n`
    text += `💰 Totale Spese Gruppo: *€ ${totalGroupExpenses.toFixed(2)}*\n\n`
    text += `💸 *COME PAREGGIARE I CONTI:*\n`
    if (settlements.length === 0) {
      text += `✅ Tutti i conti sono in pari! Nessun rimborso dovuto.\n`
    } else {
      settlements.forEach(s => {
        text += `• *${s.from}* deve dare *€ ${s.amount.toFixed(2)}* a *${s.to}*\n`
      })
    }
    text += `\n📱 Generato da Toscana 2026 App`

    navigator.clipboard.writeText(text).then(() => {
      setCopiedNotification(true)
      setTimeout(() => setCopiedNotification(false), 3000)
    })
  }

  return (
    <div className="animate-fadeIn space-y-6">

      {/* Top Banner Header for Spese */}
      <div className="bg-gradient-to-r from-[#1E2923] via-[#27342D] to-[#1E2923] text-white p-5 sm:p-6 rounded-3xl shadow-xl border border-amber-500/20 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-7xl opacity-15 pointer-events-none select-none">
          💶
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💶</span>
              <h2 className="text-xl sm:text-2xl font-black text-[#E5A93C] uppercase tracking-tight">
                Gestione Spese (Tricount)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 font-medium">
              Aggiungi le spese fatte, dividi i costi con chi partecipa e pareggia i conti senza stress!
            </p>
          </div>

          <button
            onClick={() => {
              if (showForm) resetForm()
              else setShowForm(true)
            }}
            className="w-full sm:w-auto px-5 py-3 bg-[#C85A32] hover:bg-[#a64724] text-white text-xs font-black rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 border border-amber-400/30"
          >
            <span className="text-base">{showForm ? '✖' : '➕'}</span>
            <span>{showForm ? 'Chiudi Modulo' : 'Nuova Spesa'}</span>
          </button>
        </div>

        {/* Global Summary Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/10 text-center">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
            <span className="text-[10px] text-amber-200 uppercase font-black tracking-widest block">Totale Spese</span>
            <span className="text-lg sm:text-xl font-black text-white">€ {totalGroupExpenses.toFixed(2)}</span>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
            <span className="text-[10px] text-amber-200 uppercase font-black tracking-widest block">Quota Media</span>
            <span className="text-lg sm:text-xl font-black text-amber-300">
              € {participants.length > 0 ? (totalGroupExpenses / participants.length).toFixed(2) : '0.00'}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-sm flex flex-col justify-center">
            <span className="text-[10px] text-amber-200 uppercase font-black tracking-widest block">Numero Spese</span>
            <span className="text-lg sm:text-xl font-black text-emerald-300">{expenses.length} registrate</span>
          </div>
        </div>
      </div>

      {/* Add / Edit Expense Form Modal */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-6 rounded-3xl shadow-xl border-2 border-[#C85A32]/40 animate-fadeIn space-y-4">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <h3 className="font-black text-base text-[#1E2923] flex items-center gap-2">
              <span>{editingId ? '✏️ Modifica Spesa' : '➕ Registra Nuova Spesa'}</span>
            </h3>
            <button type="button" onClick={resetForm} className="text-stone-400 hover:text-stone-700 text-xs font-bold">
              Annulla ✖
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="text-xs font-black uppercase text-stone-600 block mb-1">
                Descrizione / Titolo Spesa *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="es. Spesa supermercato, Cena grigliata, Benzina..."
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="text-xs font-black uppercase text-stone-600 block mb-1">
                Importo totale (€) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-stone-500 font-bold text-sm">€</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
                  required
                />
              </div>
            </div>

            {/* Payer */}
            <div>
              <label className="text-xs font-black uppercase text-stone-600 block mb-1">
                Chi ha pagato? *
              </label>
              <select
                value={payer}
                onChange={e => setPayer(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
              >
                {participants.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-black uppercase text-stone-600 block mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Involved People Selection */}
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-2">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <label className="text-xs font-black uppercase text-amber-900 block">
                👥 Chi è coinvolto in questa spesa? ({involved.length} di {participants.length})
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAllInvolved}
                  className="text-[10px] font-bold text-amber-800 bg-amber-200/60 hover:bg-amber-200 px-2 py-1 rounded-lg"
                >
                  Seleziona Tutti
                </button>
                <button
                  type="button"
                  onClick={deselectAllInvolved}
                  className="text-[10px] font-bold text-stone-600 bg-white hover:bg-stone-100 px-2 py-1 rounded-lg border border-stone-200"
                >
                  Deseleziona
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {participants.map(p => {
                const isSelected = involved.includes(p)
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggleInvolved(p)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-[#5B7043] text-white shadow-sm ring-1 ring-[#5B7043]'
                        : 'bg-white text-stone-600 border border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{p}
                  </button>
                )
              })}
            </div>

            {/* Split Preview */}
            {amount && parseFloat(amount) > 0 && involved.length > 0 && (
              <div className="text-right text-[11px] font-bold text-amber-900 pt-1">
                Quota individuale: <span className="text-sm font-black text-[#C85A32]">€ {(parseFloat(amount) / involved.length).toFixed(2)}</span> a testa
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#C85A32] hover:bg-[#a64724] text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-95"
            >
              {editingId ? 'Salva Modifiche' : '➕ Aggiungi Spesa'}
            </button>
          </div>
        </form>
      )}

      {/* Sub-Navigation Tabs: Spese / Saldi / Pareggio */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-stone-200 flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab('spese')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              activeSubTab === 'spese'
                ? 'bg-[#1E2923] text-white shadow-md'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>📋</span> Elenco Spese
          </button>

          <button
            onClick={() => setActiveSubTab('saldi')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              activeSubTab === 'saldi'
                ? 'bg-[#1E2923] text-white shadow-md'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>📊</span> Tabella Saldi
          </button>

          <button
            onClick={() => setActiveSubTab('pareggio')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              activeSubTab === 'pareggio'
                ? 'bg-[#C85A32] text-white shadow-md'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>💸</span> Pareggio Conti
          </button>
        </div>

        {activeSubTab === 'pareggio' && (
          <button
            onClick={copyWhatsAppSummary}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1 active:scale-95"
          >
            <span>📱</span> {copiedNotification ? 'Copiato in Appunti!' : 'Copia per WhatsApp'}
          </button>
        )}
      </div>

      {/* SUB-VIEW 1: ELENCO SPESE */}
      {activeSubTab === 'spese' && (
        <div className="space-y-4">

          {/* Filters Bar */}
          <div className="bg-stone-100 p-3.5 rounded-2xl border border-stone-200 space-y-3">
            {/* Person Filter */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 block mb-1.5">
                👤 Filtra per Persona (Pagato o Coinvolto):
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedPerson('tutti')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedPerson === 'tutti'
                      ? 'bg-[#1E2923] text-white shadow'
                      : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
                  }`}
                >
                  Tutti ({expenses.length})
                </button>
                {participants.map(p => (
                  <button
                    key={p}
                    onClick={() => setSelectedPerson(p)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedPerson === p
                        ? 'bg-[#5B7043] text-white shadow'
                        : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 block mb-1.5">
                📁 Filtra per Categoria:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setCategoryFilter('tutti')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    categoryFilter === 'tutti'
                      ? 'bg-[#C85A32] text-white shadow'
                      : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
                  }`}
                >
                  Tutte le Categorie
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      categoryFilter === cat
                        ? 'bg-[#C85A32] text-white shadow'
                        : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Expense Cards List */}
          {filteredExpenses.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl text-center border border-stone-200 text-stone-500">
              <span className="text-4xl block mb-2">💸</span>
              <p className="font-bold text-sm">Nessuna spesa trovata con i filtri selezionati.</p>
              <button
                onClick={() => { setSelectedPerson('tutti'); setCategoryFilter('tutti') }}
                className="mt-3 text-xs font-bold text-[#C85A32] hover:underline"
              >
                Reset Filtri
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredExpenses.map((exp) => {
                const sharePerPerson = exp.involved && exp.involved.length > 0 ? (exp.amount / exp.involved.length) : 0

                return (
                  <div
                    key={exp.id}
                    className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
                            {exp.category}
                          </span>
                          <h4 className="font-black text-base text-[#1E2923] break-words">
                            {exp.title}
                          </h4>
                        </div>
                        <p className="text-[11px] text-stone-400 font-medium mt-0.5">
                          Pagato da <span className="font-black text-[#5B7043]">{exp.payer}</span> {exp.date ? `• ${exp.date}` : ''}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-xs text-stone-400 font-bold block text-[10px] uppercase">Totale</span>
                          <span className="text-xl font-black text-[#C85A32]">€ {exp.amount.toFixed(2)}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 pl-2 border-l border-stone-200">
                          <button
                            onClick={() => handleStartEdit(exp)}
                            className="p-1.5 text-stone-400 hover:text-amber-600 transition-colors text-sm"
                            title="Modifica Spesa"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(exp.id, exp.title)}
                            className="p-1.5 text-stone-400 hover:text-red-600 transition-colors text-sm"
                            title="Elimina Spesa"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Involved People Badges */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-black uppercase text-stone-400 shrink-0">Diviso con:</span>
                        {exp.involved.map(p => (
                          <span
                            key={p}
                            className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                              p === exp.payer
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-stone-100 text-stone-700 border border-stone-200'
                            }`}
                          >
                            {p}
                          </span>
                        ))}
                      </div>

                      <span className="text-[11px] font-bold text-stone-500 shrink-0 bg-stone-50 px-2 py-1 rounded-lg border border-stone-200">
                        Quota: <strong className="text-stone-800">€ {sharePerPerson.toFixed(2)}</strong> / pers. ({exp.involved.length})
                      </span>
                    </div>

                  </div>
                )
              })}
            </div>
          )}

          {/* Reset Defaults button */}
          <div className="text-center pt-2">
            <button
              onClick={handleRestoreDefaults}
              className="text-[11px] text-stone-400 hover:text-amber-700 underline font-semibold"
            >
              Ripristina spese di esempio iniziali
            </button>
          </div>

        </div>
      )}

      {/* SUB-VIEW 2: TABELLA SALDI E BILANCIO */}
      {activeSubTab === 'saldi' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-stone-200 space-y-4">
            <div>
              <h3 className="font-black text-base text-[#1E2923] flex items-center gap-2">
                <span>📊 Tabella Saldi & Bilancio dei Partecipanti</span>
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Visualizza quanto ha anticipato ciascuno, qual è la sua quota spettante e il saldo finale.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-100 border-b border-stone-200 text-stone-600 font-black uppercase text-[10px] tracking-wider">
                    <th className="p-3">Partecipante</th>
                    <th className="p-3 text-right">Pagato (Anticipato)</th>
                    <th className="p-3 text-right">Quota Dovuta</th>
                    <th className="p-3 text-right">Saldo Netto</th>
                    <th className="p-3 text-center">Stato Tricount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-semibold text-stone-800">
                  {participants.map(p => {
                    const stats = personStats[p] || { paid: 0, owed: 0, balance: 0 }
                    const bal = Math.round(stats.balance * 100) / 100
                    const isCreditor = bal > 0.01
                    const isDebtor = bal < -0.01

                    return (
                      <tr key={p} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-3 font-black text-sm text-[#1E2923] flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#1E2923] text-amber-300 text-[10px] flex items-center justify-center font-bold">
                            {p.charAt(0)}
                          </span>
                          {p}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-stone-700">
                          € {stats.paid.toFixed(2)}
                        </td>
                        <td className="p-3 text-right font-mono text-stone-500">
                          € {stats.owed.toFixed(2)}
                        </td>
                        <td className="p-3 text-right font-mono font-extrabold text-sm">
                          {isCreditor && <span className="text-emerald-600">+€ {bal.toFixed(2)}</span>}
                          {isDebtor && <span className="text-red-600">-€ {Math.abs(bal).toFixed(2)}</span>}
                          {!isCreditor && !isDebtor && <span className="text-stone-400">€ 0.00</span>}
                        </td>
                        <td className="p-3 text-center">
                          {isCreditor && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-300 uppercase tracking-wider">
                              🟢 Riceve € {bal.toFixed(2)}
                            </span>
                          )}
                          {isDebtor && (
                            <span className="bg-red-100 text-red-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-red-300 uppercase tracking-wider">
                              🔴 Deve € {Math.abs(bal).toFixed(2)}
                            </span>
                          )}
                          {!isCreditor && !isDebtor && (
                            <span className="bg-stone-100 text-stone-500 text-[10px] font-black px-2.5 py-1 rounded-full border border-stone-200 uppercase tracking-wider">
                              ⚪ In pari
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* SUB-VIEW 3: PAREGGIO CONTI (OPTIMAL DEBT SETTLEMENT) */}
      {activeSubTab === 'pareggio' && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-stone-200 space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-black text-base text-[#1E2923] flex items-center gap-2">
                <span>💸 Come Pareggiare i Conti (Metodo Tricount)</span>
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Calcolo automatico per minimizzare il numero di bonifici/Satispay tra i partecipanti.
              </p>
            </div>

            <button
              onClick={copyWhatsAppSummary}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
            >
              <span>📱</span> {copiedNotification ? 'Copiato in Appunti!' : 'Copia per WhatsApp'}
            </button>
          </div>

          {settlements.length === 0 ? (
            <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-4xl block mb-2">🎉</span>
              <h4 className="font-black text-base text-emerald-900">Tutti i conti sono perfettamente in pari!</h4>
              <p className="text-xs text-emerald-700 mt-1">Nessuno deve dare o ricevere denaro.</p>
            </div>
          ) : (
            <div className="space-y-4">

              {/* Person Filter for Settlements */}
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 block mb-1.5">
                  👤 Filtra rimborsi per persona:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedPerson('tutti')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedPerson === 'tutti'
                        ? 'bg-[#1E2923] text-white shadow'
                        : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    Tutti ({settlements.length})
                  </button>
                  {participants.map(p => (
                    <button
                      key={p}
                      onClick={() => setSelectedPerson(p)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        selectedPerson === p
                          ? 'bg-[#C85A32] text-white shadow'
                          : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <span className="text-xs font-black uppercase tracking-wider text-stone-400 block">
                Rimborsi da effettuare ({settlements.filter(s => selectedPerson === 'tutti' || s.from === selectedPerson || s.to === selectedPerson).length}):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {settlements
                  .filter(s => selectedPerson === 'tutti' || s.from === selectedPerson || s.to === selectedPerson)
                  .map((s, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-gradient-to-r from-stone-50 to-amber-50/50 border border-stone-200 shadow-sm flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-red-100 border border-red-300 text-red-700 flex items-center justify-center font-black text-xs shrink-0">
                            🔴
                          </div>
                          <div className="min-w-0">
                            <span className="font-black text-sm text-[#1E2923] block truncate">{s.from}</span>
                            <span className="text-[10px] text-stone-400 font-bold uppercase">Deve dare a</span>
                          </div>
                        </div>

                        <div className="text-center shrink-0">
                          <span className="text-xs font-black text-[#C85A32] bg-white px-2.5 py-1 rounded-xl border border-amber-300 shadow-sm block font-mono">
                            € {s.amount.toFixed(2)}
                          </span>
                          <span className="text-[9px] text-stone-400 font-bold">➔ ➔ ➔</span>
                        </div>

                        <div className="flex items-center gap-2 min-w-0 justify-end">
                          <div className="min-w-0 text-right">
                            <span className="font-black text-sm text-[#1E2923] block truncate">{s.to}</span>
                            <span className="text-[10px] text-emerald-600 font-bold uppercase">Riceve</span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center font-black text-xs shrink-0">
                            🟢
                          </div>
                        </div>
                      </div>

                      {/* Consolidate / Mark as Settled Button */}
                      <button
                        onClick={() => handleSettleTransfer(s.from, s.to, s.amount)}
                        className="w-full mt-1 py-2 px-3 bg-[#5B7043] hover:bg-[#495b36] text-white text-xs font-black rounded-xl shadow transition-all flex items-center justify-center gap-1.5 active:scale-95 border border-emerald-600/30"
                      >
                        <span>✅</span>
                        <span>Segna come Pagato / Consolidato</span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  )
}
