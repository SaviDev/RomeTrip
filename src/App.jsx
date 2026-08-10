import { useState, useEffect } from 'react'
import {
  scheduleData,
  lodgingData,
  logisticsData,
  costsData,
  checklistData
} from './data/schedule'
import ExpensesTab from './components/ExpensesTab'

const groupMembers = [
  "Io (Luca)",
  "Bass",
  "Cla",
  "Maddi",
  "Meryland",
  "Dave",
  "Chiara",
  "Onga",
  "Da comprare",
  "Chiedere alla struttura"
]

function App() {
  const [activeTab, setActiveTab] = useState('programma') // 'programma', 'logistica', 'alloggio', 'costi', 'checklist'
  const [activeDay, setActiveDay] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem('toscana_checklist_v2')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          return parsed.map(item => ({
            ...item,
            assignedTo: (item.assignedTo || []).map(p => p === 'Io' ? 'Io (Luca)' : p),
            checkedBy: (item.checkedBy || []).map(p => p === 'Io' ? 'Io (Luca)' : p)
          }))
        }
      } catch (e) { console.error(e) }
    }
    return checklistData
  })
  const [checklistFilter, setChecklistFilter] = useState('tutti')
  const [personFilter, setPersonFilter] = useState('tutti')
  const [numPeople, setNumPeople] = useState(9)

  // New Item State
  const [newItemName, setNewItemName] = useState('')
  const [newItemPersons, setNewItemPersons] = useState(['Io (Luca)'])
  const [newItemCategory, setNewItemCategory] = useState('Casa / Cucina')
  const [showAddForm, setShowAddForm] = useState(false)

  // Edit item assigned people inline state
  const [editingItemId, setEditingItemId] = useState(null)

  // Save checklist to localStorage
  useEffect(() => {
    localStorage.setItem('toscana_checklist_v2', JSON.stringify(checklist))
  }, [checklist])

  // Calculate if today is within trip period (August 11-14, 2026)
  const getTodayTripDayIndex = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 7 = August (0-indexed)
    const date = today.getDate();

    if (year === 2026 && month === 7 && date >= 11 && date <= 14) {
      return date - 11;
    }
    return null;
  };

  const todayTripDayIndex = getTodayTripDayIndex();

  // Auto-detect current day if in trip period
  useEffect(() => {
    if (todayTripDayIndex !== null) {
      setActiveDay(todayTripDayIndex);
    }
  }, []);

  const googleDriveLink = "https://drive.google.com/drive/folders/1eOcFmTC4WRdJ5KM2st71CHc-eGRRDknG?usp=sharing"

  // Toggle check state for a specific person on an item
  const togglePersonCheck = (itemId, person) => {
    setChecklist(prev => prev.map(item => {
      if (item.id !== itemId) return item
      const checked = item.checkedBy || []
      const isAlreadyChecked = checked.includes(person)
      const updatedCheckedBy = isAlreadyChecked
        ? checked.filter(p => p !== person)
        : [...checked, person]
      return { ...item, checkedBy: updatedCheckedBy }
    }))
  }

  // Toggle assignment of a person to an item
  const togglePersonAssignment = (itemId, person) => {
    setChecklist(prev => prev.map(item => {
      if (item.id !== itemId) return item
      const assigned = item.assignedTo || []
      const isAssigned = assigned.includes(person)
      const updatedAssigned = isAssigned
        ? assigned.filter(p => p !== person)
        : [...assigned, person]
      // Also clean up checkedBy if unassigned
      const updatedCheckedBy = (item.checkedBy || []).filter(p => updatedAssigned.includes(p))
      return { ...item, assignedTo: updatedAssigned, checkedBy: updatedCheckedBy }
    }))
  }

  const handleAddItem = (e) => {
    e.preventDefault()
    if (!newItemName.trim()) return
    const newItem = {
      id: Date.now(),
      item: newItemName.trim(),
      assignedTo: newItemPersons.length > 0 ? newItemPersons : ['Io (Luca)'],
      checkedBy: [],
      category: newItemCategory
    }
    setChecklist(prev => [...prev, newItem])
    setNewItemName('')
    setShowAddForm(false)
  }

  const deleteItem = (id, itemTitle) => {
    if (window.confirm(`Sei sicuro di voler eliminare "${itemTitle}" dalla lista?`)) {
      setChecklist(prev => prev.filter(item => item.id !== id))
    }
  }

  const restoreDefaultChecklist = () => {
    if (window.confirm("Vuoi ripristinare tutti i 26 oggetti della lista predefinita?")) {
      setChecklist(checklistData.map(item => ({ ...item, checkedBy: [] })))
    }
  }

  const categories = ['tutti', ...new Set(checklist.map(i => i.category))]

  const filteredChecklist = checklist.filter(item => {
    const matchesCategory = checklistFilter === 'tutti' || item.category === checklistFilter
    const matchesPerson = personFilter === 'tutti' || (item.assignedTo || []).includes(personFilter)
    return matchesCategory && matchesPerson
  })

  // Calculate overall total completed items
  const totalAssignedSlots = checklist.reduce((acc, i) => acc + (i.assignedTo ? i.assignedTo.length : 0), 0)
  const totalCheckedSlots = checklist.reduce((acc, i) => acc + (i.checkedBy ? i.checkedBy.length : 0), 0)

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E2923] flex flex-col items-center max-w-full overflow-x-hidden">

      {/* Top Banner & Header */}
      <header className="w-full bg-[#1E2923] text-white shadow-xl relative overflow-hidden">
        {/* Decorative background image overlay */}
        <div className="absolute inset-0 opacity-25 bg-cover bg-center" style={{ backgroundImage: `url('/tuscany_hero.png')` }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-5 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl filter drop-shadow">🍷</span>
            <div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-[#E5A93C] uppercase">
                Toscana 2026
              </h1>
              <p className="text-[11px] sm:text-sm font-semibold text-amber-100/90 tracking-wide">
                Ritiro Estivo in Maremma • 11 - 14 Agosto
              </p>
            </div>
          </div>

          {/* Quick Nav Header Buttons */}
          <div className="flex items-center gap-2">
            <a
              href={lodgingData.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-[#C85A32] hover:bg-[#a64724] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
              title="Mappa Casa Poderi Di Montemerano"
            >
              <span>🏡</span>
              <span className="hidden sm:inline">Mappa Casa</span>
            </a>

            {/* Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col justify-center items-center w-10 h-10 bg-amber-500/20 border border-amber-400/40 rounded-xl shadow-md gap-1 active:scale-90 transition-all"
              aria-label="Menu"
            >
              <span className={`block w-5 h-0.5 bg-amber-300 rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block w-5 h-0.5 bg-amber-300 rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-amber-300 rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>
        </div>

        {/* Header Navigation Dropdown */}
        {menuOpen && (
          <div className="relative z-50 bg-[#27342D] border-t border-amber-500/20 shadow-2xl px-4 sm:px-5 py-4 animate-fadeIn">
            <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-6 gap-2">
              <button
                onClick={() => { setActiveTab('programma'); setMenuOpen(false); }}
                className={`p-3 rounded-xl text-left font-bold text-xs flex flex-col gap-1 transition-all ${
                  activeTab === 'programma' ? 'bg-[#C85A32] text-white shadow-md' : 'bg-white/5 text-amber-100 hover:bg-white/10'
                }`}
              >
                <span className="text-base">📅</span> Programma
              </button>

              <button
                onClick={() => { setActiveTab('spese'); setMenuOpen(false); }}
                className={`p-3 rounded-xl text-left font-bold text-xs flex flex-col gap-1 transition-all ${
                  activeTab === 'spese' ? 'bg-[#C85A32] text-white shadow-md' : 'bg-white/5 text-amber-100 hover:bg-white/10'
                }`}
              >
                <span className="text-base">💶</span> Spese
              </button>

              <button
                onClick={() => { setActiveTab('checklist'); setMenuOpen(false); }}
                className={`p-3 rounded-xl text-left font-bold text-xs flex flex-col gap-1 transition-all ${
                  activeTab === 'checklist' ? 'bg-[#C85A32] text-white shadow-md' : 'bg-white/5 text-amber-100 hover:bg-white/10'
                }`}
              >
                <span className="text-base">🎒</span> Checklist
              </button>

              <button
                onClick={() => { setActiveTab('logistica'); setMenuOpen(false); }}
                className={`p-3 rounded-xl text-left font-bold text-xs flex flex-col gap-1 transition-all ${
                  activeTab === 'logistica' ? 'bg-[#C85A32] text-white shadow-md' : 'bg-white/5 text-amber-100 hover:bg-white/10'
                }`}
              >
                <span className="text-base">🚗</span> Logistica Auto
              </button>

              <button
                onClick={() => { setActiveTab('alloggio'); setMenuOpen(false); }}
                className={`p-3 rounded-xl text-left font-bold text-xs flex flex-col gap-1 transition-all ${
                  activeTab === 'alloggio' ? 'bg-[#C85A32] text-white shadow-md' : 'bg-white/5 text-amber-100 hover:bg-white/10'
                }`}
              >
                <span className="text-base">🏡</span> Alloggio
              </button>

              <button
                onClick={() => { setActiveTab('costi'); setMenuOpen(false); }}
                className={`p-3 rounded-xl text-left font-bold text-xs flex flex-col gap-1 transition-all ${
                  activeTab === 'costi' ? 'bg-[#C85A32] text-white shadow-md' : 'bg-white/5 text-amber-100 hover:bg-white/10'
                }`}
              >
                <span className="text-base">💰</span> Budget & Costi
              </button>
            </div>

            <div className="max-w-4xl mx-auto mt-3 border-t border-white/10 pt-3 flex justify-between items-center">
              <a
                href={googleDriveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#E5A93C] hover:underline"
              >
                <span>📸</span> Cartella Foto Drive
              </a>
              <span className="text-[10px] text-amber-200/50 uppercase tracking-widest font-mono">
                Poderi Di Montemerano
              </span>
            </div>
          </div>
        )}
      </header>

      {/* Main Navigation Bar - Scrollable on small screens */}
      <nav className="w-full bg-[#5B7043] text-white shadow-md sticky top-0 z-40 overflow-x-auto no-scrollbar">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 flex justify-start sm:justify-center items-center gap-1 sm:gap-6 py-2 overflow-x-auto no-scrollbar min-w-0">
          <button
            onClick={() => setActiveTab('programma')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-extrabold text-[11px] sm:text-xs flex items-center gap-1 shrink-0 transition-all ${
              activeTab === 'programma' ? 'bg-[#E5A93C] text-[#1E2923] shadow-md scale-105' : 'hover:bg-white/10 text-white/90'
            }`}
          >
            <span>📅</span> Programma
          </button>
          <button
            onClick={() => setActiveTab('spese')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-extrabold text-[11px] sm:text-xs flex items-center gap-1 shrink-0 transition-all ${
              activeTab === 'spese' ? 'bg-[#E5A93C] text-[#1E2923] shadow-md scale-105' : 'hover:bg-white/10 text-white/90'
            }`}
          >
            <span>💶</span> Spese
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-extrabold text-[11px] sm:text-xs flex items-center gap-1 shrink-0 transition-all ${
              activeTab === 'checklist' ? 'bg-[#E5A93C] text-[#1E2923] shadow-md scale-105' : 'hover:bg-white/10 text-white/90'
            }`}
          >
            <span>🎒</span> Checklist
          </button>
          <button
            onClick={() => setActiveTab('logistica')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-extrabold text-[11px] sm:text-xs flex items-center gap-1 shrink-0 transition-all ${
              activeTab === 'logistica' ? 'bg-[#E5A93C] text-[#1E2923] shadow-md scale-105' : 'hover:bg-white/10 text-white/90'
            }`}
          >
            <span>🚗</span> Auto
          </button>
          <button
            onClick={() => setActiveTab('alloggio')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-extrabold text-[11px] sm:text-xs flex items-center gap-1 shrink-0 transition-all ${
              activeTab === 'alloggio' ? 'bg-[#E5A93C] text-[#1E2923] shadow-md scale-105' : 'hover:bg-white/10 text-white/90'
            }`}
          >
            <span>🏡</span> Casa
          </button>
          <button
            onClick={() => setActiveTab('costi')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-extrabold text-[11px] sm:text-xs flex items-center gap-1 shrink-0 transition-all ${
              activeTab === 'costi' ? 'bg-[#E5A93C] text-[#1E2923] shadow-md scale-105' : 'hover:bg-white/10 text-white/90'
            }`}
          >
            <span>💰</span> Costi
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="w-full max-w-4xl p-3 sm:p-6 flex-grow overflow-x-hidden min-w-0">

        {/* TAB: SPESE (TRICOUNT) */}
        {activeTab === 'spese' && (
          <ExpensesTab groupMembers={groupMembers} />
        )}

        {/* TAB 1: PROGRAMMA DEL GIORNO */}
        {activeTab === 'programma' && (
          <div className="animate-fadeIn space-y-6">

            {/* Day Selector Buttons */}
            <div className="bg-white rounded-2xl p-2 shadow-md border border-amber-200/60 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {scheduleData.map((dayObj, idx) => {
                const isToday = todayTripDayIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveDay(idx)}
                    className={`p-3 rounded-xl text-center transition-all flex flex-col items-center justify-center relative ${
                      activeDay === idx
                        ? 'bg-[#C85A32] text-white shadow-lg ring-2 ring-[#C85A32]/30 scale-[1.02]'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    {isToday && (
                      <span className="absolute -top-2 -right-1 bg-amber-400 text-stone-900 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow border border-amber-300 uppercase tracking-widest animate-pulse">
                        ⚡ OGGI
                      </span>
                    )}
                    <span className="text-[10px] font-black uppercase tracking-wider opacity-80">
                      Giorno {idx + 1}
                    </span>
                    <span className="font-black text-xs sm:text-sm mt-0.5">
                      {dayObj.day.split(' ')[0]} {dayObj.day.split(' ')[1]}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Day Card Details */}
            <div className="bg-white rounded-3xl p-4 sm:p-7 shadow-xl border border-amber-200/50 relative overflow-hidden">
              {/* Day Badge Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b-2 border-[#E5A93C] pb-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-[#C85A32] rounded-full text-xs font-black uppercase tracking-wider mb-1">
                    <span>📅</span> Giorno {activeDay + 1} • {scheduleData[activeDay].day}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#1E2923]">
                    {scheduleData[activeDay].title}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
                    {scheduleData[activeDay].highlight}
                  </p>
                </div>

                <a
                  href={googleDriveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-end sm:self-auto inline-flex items-center gap-2 bg-[#5B7043] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-[#495b35] transition-all"
                >
                  <span>📸</span> Foto Drive
                </a>
              </div>

              {/* Events Timeline */}
              <div className="space-y-8 relative">
                {/* Vertical timeline bar */}
                <div className="absolute left-[79px] top-3 bottom-3 w-0.5 bg-amber-200 hidden sm:block" />

                {scheduleData[activeDay].events.map((event, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-3 sm:gap-5 group relative">

                    {/* Time Badge */}
                    <div className="sm:w-28 flex-shrink-0 pt-0.5">
                      <span className="inline-block bg-[#1E2923] text-[#E5A93C] font-black text-xs px-2.5 py-1 rounded-lg shadow-sm border border-amber-500/20 font-mono">
                        {event.time}
                      </span>
                    </div>

                    {/* Timeline bullet for desktop */}
                    <div className="hidden sm:block absolute left-[74px] top-2.5 w-3 h-3 rounded-full bg-[#C85A32] ring-4 ring-white shadow" />

                    {/* Event Content Box */}
                    <div className="flex-grow bg-stone-50/80 rounded-2xl p-4 border border-stone-200/70 hover:border-amber-400 transition-all hover:shadow-md min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h3 className="font-black text-base text-[#1E2923] group-hover:text-[#C85A32] transition-colors break-words">
                            {event.title}
                          </h3>
                          <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mt-0.5 flex items-center gap-1">
                            <span>📍</span> {event.location}
                          </p>
                        </div>

                        {/* Direct Navigation Button */}
                        <a
                          href={event.maps}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 w-9 h-9 bg-[#C85A32] text-white rounded-xl flex items-center justify-center shadow-md hover:bg-[#a64724] active:scale-95 transition-all"
                          title="Naviga su Google Maps"
                        >
                          📍
                        </a>
                      </div>

                      {/* Event Notes */}
                      {event.notes && (
                        <p className="text-xs sm:text-sm text-stone-700 mt-2.5 leading-relaxed font-medium bg-amber-50/60 p-3 rounded-xl border-l-4 border-[#E5A93C]">
                          {event.notes}
                        </p>
                      )}

                      {/* Event Link */}
                      {event.link && (
                        <div className="mt-3">
                          <a
                            href={event.link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C85A32] hover:text-[#9e3f1e] underline"
                          >
                            {event.link.label} ↗
                          </a>
                        </div>
                      )}

                      {/* Options Grid (e.g. Borghi or Beaches) */}
                      {event.options && (
                        <div className="mt-4 pt-3 border-t border-stone-200/80">
                          <p className="text-[11px] font-black text-stone-500 uppercase tracking-widest mb-2.5">
                            💡 Opzioni & Destinazioni consigliate:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {event.options.map((opt, oIdx) => (
                              <div key={oIdx} className="bg-white p-3 rounded-xl border border-amber-200/70 shadow-sm hover:shadow transition-all flex flex-col justify-between">
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-extrabold text-xs text-[#1E2923]">{opt.name}</span>
                                    <span className="text-[10px] font-bold bg-amber-100 text-[#C85A32] px-2 py-0.5 rounded-full font-mono">
                                      ⏱ {opt.dist}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-stone-600 leading-snug">{opt.desc}</p>
                                </div>
                                <a
                                  href={opt.maps}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 text-[10px] font-bold text-[#5B7043] hover:underline inline-flex items-center gap-1"
                                >
                                  <span>🗺️</span> Apri in Mappa
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: LOGISTICA & AUTO */}
        {activeTab === 'logistica' && (
          <div className="animate-fadeIn space-y-6">

            {/* Travel Summary Header */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-amber-200/50">
              <h2 className="text-xl font-black text-[#1E2923] flex items-center gap-2 mb-2">
                <span>🚗</span> Logistica Trasporti & Viaggio
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                Organizzazione dei trasferimenti con mezzi privati per ottimizzare posti, carburante e pedaggi.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

                {/* Andata */}
                <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200">
                  <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 uppercase tracking-wider mb-2">
                    <span>🛫</span> ANDATA: {logisticsData.departureDate}
                  </div>
                  <ul className="text-xs space-y-2 font-medium text-emerald-950">
                    <li>📍 <strong>Ritrovo & Partenza:</strong> {logisticsData.departureMeeting} • ore <strong>{logisticsData.departureTime}</strong></li>
                    <li>☕ <strong>Sosta:</strong> {logisticsData.breakfastSpot}</li>
                    <li>🏁 <strong>Arrivo stimato:</strong> {logisticsData.arrivalTime}</li>
                    <li>🔑 <strong>Check-in Casa:</strong> {lodgingData.checkIn}</li>
                  </ul>
                </div>

                {/* Ritorno */}
                <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200">
                  <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-800 uppercase tracking-wider mb-2">
                    <span>🛬</span> RITORNO: {logisticsData.returnDate}
                  </div>
                  <ul className="text-xs space-y-2 font-medium text-amber-950">
                    <li>🔑 <strong>Check-out Casa:</strong> {lodgingData.checkOut}</li>
                    <li>🚗 <strong>Partenza stimata:</strong> {logisticsData.returnDepartureTime}</li>
                    <li>🏁 <strong>Arrivo a casa stimato:</strong> {logisticsData.returnArrivalTime}</li>
                    <li>🍽️ <strong>Pranzo:</strong> Sosta in viaggio da concordare</li>
                  </ul>
                </div>

              </div>
            </div>

            {/* Cars List */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-amber-200/50">
              <h3 className="text-lg font-black text-[#1E2923] mb-4 flex items-center gap-2">
                <span>🚘</span> Parco Auto (3 Autovetture)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {logisticsData.cars.map((car) => (
                  <div key={car.id} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 hover:border-[#C85A32] transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-sm text-[#C85A32]">{car.name}</span>
                      <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Auto {car.id}</span>
                    </div>
                    <p className="text-sm font-bold text-[#1E2923] mb-1">
                      👤 Guidatore: <span className="text-[#5B7043] font-black">{car.driver}</span>
                    </p>
                    <p className="text-xs text-stone-500 font-medium">
                      {car.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: ALLOGGIO */}
        {activeTab === 'alloggio' && (
          <div className="animate-fadeIn space-y-6">
            <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-xl border border-amber-200/50">
              
              <div className="relative rounded-2xl overflow-hidden mb-6 h-48 sm:h-64 bg-stone-900 shadow-md">
                <img
                  src="/tuscany_hero.png"
                  alt="Poderi Di Montemerano"
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-xs font-black uppercase tracking-widest text-[#E5A93C]">Location Maremma</span>
                  <h2 className="text-2xl sm:text-3xl font-black">{lodgingData.name}</h2>
                  <p className="text-xs sm:text-sm text-stone-200 font-medium">📍 {lodgingData.address}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                  <h4 className="font-black text-xs uppercase text-amber-900 tracking-wider mb-2">🕒 Orari Inizio e Fine</h4>
                  <p className="text-xs text-stone-700 font-medium mb-1"><strong>Check-in:</strong> {lodgingData.checkIn}</p>
                  <p className="text-xs text-stone-700 font-medium"><strong>Check-out:</strong> {lodgingData.checkOut}</p>
                </div>

                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
                  <h4 className="font-black text-xs uppercase text-emerald-900 tracking-wider mb-2">🌿 Informazioni Struttura</h4>
                  <p className="text-xs text-[#1E2923] font-medium leading-relaxed">
                    {lodgingData.notes}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={lodgingData.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#003580] hover:bg-[#002660] text-white text-center py-3 px-5 rounded-xl text-xs font-extrabold shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>🏨</span> Apri Dettagli su Booking.com
                </a>
                <a
                  href={lodgingData.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#C85A32] hover:bg-[#a64724] text-white text-center py-3 px-5 rounded-xl text-xs font-extrabold shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>🗺️</span> Ottieni Indicazioni su Google Maps
                </a>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: BUDGET & COSTI */}
        {activeTab === 'costi' && (
          <div className="animate-fadeIn space-y-6">

            {/* Total Highlight */}
            <div className="bg-[#1E2923] text-white rounded-3xl p-5 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#E5A93C]">Stima Costo Totale a Persona</span>
                  <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
                    € {costsData.grandTotalPerPerson.toFixed(2)}
                  </h2>
                  <p className="text-xs text-amber-100/80 font-medium mt-1">
                    (Base €{costsData.baseTotalPerPerson.toFixed(2)} + €50.00 imprevisti/varie)
                  </p>
                </div>

                {/* Calculator widget */}
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md text-right w-full sm:w-auto">
                  <span className="text-[10px] font-bold text-amber-200 uppercase tracking-wider block mb-1">
                    Quota Fissa Alloggio (per {numPeople} persone)
                  </span>
                  <div className="flex items-center justify-end gap-2">
                    <label className="text-xs font-bold">Persone:</label>
                    <select
                      value={numPeople}
                      onChange={(e) => setNumPeople(Number(e.target.value))}
                      className="bg-[#27342D] text-white text-xs font-bold px-2 py-1 rounded-lg border border-amber-400/40"
                    >
                      {[6, 7, 8, 9, 10].map(n => (
                        <option key={n} value={n}>{n} Persone</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-xs font-mono font-bold text-amber-300 mt-2">
                    € {(1111.91 / numPeople).toFixed(2)} alloggio / pers.
                  </p>
                </div>
              </div>
            </div>

            {/* Shared Expenses Table */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-amber-200/50">
              <h3 className="text-lg font-black text-[#1E2923] mb-3 flex items-center gap-2">
                <span>📋</span> Spese Generali Condivise
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b-2 border-amber-200 text-stone-400 font-black uppercase">
                      <th className="py-2">Spesa</th>
                      <th className="py-2 text-right">Totale Gruppo</th>
                      <th className="py-2 text-right">Quota / Persona</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {costsData.sharedFixed.map((item, idx) => (
                      <tr key={idx} className="hover:bg-stone-50">
                        <td className="py-3 pr-2">
                          <strong className="text-[#1E2923]">{item.item}</strong>
                          <span className="block text-[10px] text-stone-500 font-normal">{item.note}</span>
                        </td>
                        <td className="py-3 text-right font-mono font-bold text-stone-700">€ {item.totalCost.toFixed(2)}</td>
                        <td className="py-3 text-right font-mono font-black text-[#C85A32]">€ {item.perPerson.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="bg-amber-50/70 font-black">
                      <td className="py-3">SUBTOTALE FISSO / PERS (escluso guidatore)</td>
                      <td className="py-3"></td>
                      <td className="py-3 text-right font-mono text-sm text-[#C85A32]">€ {costsData.subtotalFixedPerPerson.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Daily Expenses Breakdown */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-amber-200/50">
              <h3 className="text-lg font-black text-[#1E2923] mb-4 flex items-center gap-2">
                <span>📆</span> Stima Spese Giornaliere a Persona
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {costsData.dailyBreakdown.map((day, idx) => (
                  <div key={idx} className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <div className="flex justify-between items-center border-b border-stone-200 pb-2 mb-2">
                      <span className="font-black text-xs text-[#1E2923] uppercase">{day.day}</span>
                      <span className="font-mono font-black text-xs text-[#5B7043] bg-emerald-100 px-2 py-0.5 rounded-md">
                        € {day.dayTotal.toFixed(2)}
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-stone-700 font-medium">
                      {day.items.map((sub, sIdx) => (
                        <li key={sIdx} className="flex justify-between items-center">
                          <span>{sub.label}</span>
                          <span className="font-mono text-stone-500">€ {sub.amount}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: CHECKLIST / COSE DA PORTARE */}
        {activeTab === 'checklist' && (
          <div className="animate-fadeIn space-y-6">

            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-amber-200/50 overflow-hidden min-w-0">

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 min-w-0">
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-black text-[#1E2923] flex items-center gap-2 break-words">
                    <span>🎒</span> Checklist Cose da Portare ({checklist.length})
                  </h2>
                  <p className="text-xs text-stone-500 font-medium mt-0.5 leading-tight">
                    Clicca sul tuo nome per spuntare se hai preso l'oggetto! ({totalCheckedSlots} di {totalAssignedSlots} spunte completate)
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-3 py-1.5 bg-[#5B7043] text-white rounded-xl text-xs font-bold shadow hover:bg-[#495b35] transition-all flex items-center gap-1 shrink-0"
                  >
                    <span>➕</span> Nuovo Oggetto
                  </button>

                  <button
                    onClick={restoreDefaultChecklist}
                    className="px-3 py-1.5 bg-amber-100 border border-amber-300 text-amber-900 hover:bg-amber-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                    title="Ripristina i 19 oggetti originali se ne hai eliminati per sbaglio"
                  >
                    <span>🔄</span> Ripristina Lista
                  </button>
                </div>
              </div>

              {/* Add New Item Form */}
              {showAddForm && (
                <form onSubmit={handleAddItem} className="bg-amber-50/80 p-3 sm:p-4 rounded-2xl border border-amber-200 mb-6 space-y-3 animate-fadeIn">
                  <h4 className="text-xs font-black uppercase text-amber-900 tracking-wider">Aggiungi nuovo oggetto alla lista:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Nome oggetto (es. Solare, Carte...)"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="bg-white px-3 py-2 text-xs font-medium rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
                      required
                    />
                    <div>
                      <span className="text-[10px] font-bold text-amber-900 block mb-1">Seleziona chi lo porta (anche più persone):</span>
                      <div className="flex flex-wrap gap-1">
                        {groupMembers.slice(0, 8).map(m => (
                          <button
                            type="button"
                            key={m}
                            onClick={() => {
                              setNewItemPersons(prev =>
                                prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
                              )
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              newItemPersons.includes(m) ? 'bg-[#C85A32] text-white' : 'bg-white text-stone-600 border'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      className="bg-white px-3 py-2 text-xs font-medium rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-[#C85A32] self-end"
                    >
                      <option value="Casa / Cucina">Casa / Cucina</option>
                      <option value="Spesa comune">Spesa comune</option>
                      <option value="Pulizia">Pulizia</option>
                      <option value="Mare & Viaggio">Mare & Viaggio</option>
                      <option value="Svago">Svago</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-1.5 text-xs font-bold text-stone-500 hover:text-stone-700"
                    >
                      Annulla
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#C85A32] text-white text-xs font-extrabold rounded-xl shadow hover:bg-[#a64724]"
                    >
                      Salva Oggetto
                    </button>
                  </div>
                </form>
              )}

              {/* Progress bar */}
              <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden mb-6 border border-stone-200">
                <div
                  className="bg-[#5B7043] h-full transition-all duration-300"
                  style={{ width: `${totalAssignedSlots > 0 ? (totalCheckedSlots / totalAssignedSlots) * 100 : 0}%` }}
                />
              </div>

              {/* Filters (Category + Person) */}
              <div className="space-y-3 mb-6 bg-stone-50 p-3 sm:p-4 rounded-2xl border border-stone-200 overflow-hidden">
                {/* Person Filter */}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-1.5">
                    👤 Filtra per Persona / Responsabile:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setPersonFilter('tutti')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        personFilter === 'tutti' ? 'bg-[#1E2923] text-white shadow' : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                      }`}
                    >
                      Tutti gli Oggetti
                    </button>
                    {["Io (Luca)", "Bass", "Cla", "Maddi", "Meryland", "Dave", "Chiara", "Onga", "Da comprare"].map(p => (
                      <button
                        key={p}
                        onClick={() => setPersonFilter(p)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          personFilter === p ? 'bg-[#5B7043] text-white shadow' : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-1.5">
                    📁 Filtra per Categoria:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat, idx) => (
                      <button
                        key={idx}
                        onClick={() => setChecklistFilter(cat)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                          checklistFilter === cat
                            ? 'bg-[#C85A32] text-white shadow'
                            : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Checklist Items */}
              <div className="space-y-3">
                {filteredChecklist.map((item) => {
                  const assignedList = item.assignedTo || []
                  const checkedList = item.checkedBy || []
                  const isFullyComplete = assignedList.length > 0 && assignedList.every(p => checkedList.includes(p))

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all min-w-0 ${
                        isFullyComplete
                          ? 'bg-emerald-50/70 border-emerald-200 shadow-sm'
                          : 'bg-white border-stone-200 hover:border-amber-300 shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2 mb-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-black text-sm break-words ${isFullyComplete ? 'line-through text-emerald-900' : 'text-[#1E2923]'}`}>
                              {item.item}
                            </span>
                            {isFullyComplete && (
                              <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                                ✓ TUTTI PRONTI!
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                            {item.category}
                          </span>
                        </div>

                        {/* Progress counter pill & Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <span className="text-[11px] font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-lg">
                            {checkedList.length} / {assignedList.length} pronti
                          </span>
                          
                          {/* Edit Assigned People toggle */}
                          <button
                            onClick={() => setEditingItemId(editingItemId === item.id ? null : item.id)}
                            className="text-[10px] font-bold text-stone-400 hover:text-[#C85A32] underline"
                          >
                            {editingItemId === item.id ? "Chiudi" : "✏️ Chi la porta"}
                          </button>

                          {/* Delete Item Button with Confirmation */}
                          <button
                            onClick={() => deleteItem(item.id, item.item)}
                            className="text-stone-300 hover:text-red-600 p-1 transition-colors text-xs font-bold"
                            title="Elimina oggetto"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {/* Inline Assignee Modifier Form */}
                      {editingItemId === item.id && (
                        <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 mb-3 animate-fadeIn">
                          <span className="text-[11px] font-black text-amber-900 block mb-1.5">
                            Seleziona tutte le persone che devono portare questo oggetto:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {groupMembers.map(person => {
                              const isAssigned = (item.assignedTo || []).includes(person)
                              return (
                                <button
                                  key={person}
                                  type="button"
                                  onClick={() => togglePersonAssignment(item.id, person)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                    isAssigned
                                      ? 'bg-[#C85A32] text-white shadow-sm ring-1 ring-[#C85A32]'
                                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                                  }`}
                                >
                                  {isAssigned ? '✓ ' : '+ '}{person}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Individual Person Status Pills (Clickable by each person) */}
                      <div>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1.5">
                          Clicca sul tuo nome quando hai preso la tua parte:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {assignedList.map((person) => {
                            const isChecked = checkedList.includes(person)
                            return (
                              <button
                                key={person}
                                onClick={() => togglePersonCheck(item.id, person)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all active:scale-95 ${
                                  isChecked
                                    ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-600/30'
                                    : 'bg-stone-100 hover:bg-amber-100 text-stone-700 border border-stone-300'
                                }`}
                              >
                                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                                  isChecked ? 'bg-white text-emerald-700' : 'bg-stone-300 text-stone-600'
                                }`}>
                                  {isChecked ? '✓' : ' '}
                                </span>
                                {person}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                    </div>
                  )
                })}
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer Banner */}
      <footer className="w-full bg-[#1E2923] text-white py-6 px-4 border-t border-amber-500/20 text-center text-xs">
        <p className="font-[#E5A93C] font-bold text-amber-200">🍷 TOSCANA 2026 • Ritiro Estivo in Maremma 🌾</p>
        <p className="text-stone-400 text-[11px] mt-1 font-medium">Poderi Di Montemerano • 11 - 14 Agosto 2026</p>
      </footer>

    </div>
  )
}

export default App
