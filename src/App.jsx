import { useState, useEffect } from 'react'
import { scheduleData } from './data/schedule'

function App() {
  const [activeDay, setActiveDay] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  // Calcola il giorno attuale all'avvio
  useEffect(() => {
    const today = new Date();
    const isYear2026 = today.getFullYear() === 2026;
    const isMonthJuly = today.getMonth() === 6; // Luglio è 6 (0-indexed)

    if (isYear2026 && isMonthJuly) {
      const date = today.getDate();
      // Mappa delle date: 2 -> Indice 0, 3 -> Indice 1, 4 -> Indice 2, 5 -> Indice 3
      if (date >= 2 && date <= 5) {
        setActiveDay(date - 2);
      }
    }
  }, []);

  const googleDriveLink = "https://drive.google.com/drive/folders/1FToNHTCCGVssfJD-5lAfl5qQIvpJMl2D?usp=sharing"

  const selectDay = (idx) => {
    setActiveDay(idx)
    setMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">

      {/* Header */}
      <header className="w-full bg-sun-gold shadow-lg">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <h1 className="text-2xl font-black text-deep-blue tracking-tight leading-none">Roma 2026 🇮🇹</h1>
            <p className="text-deep-blue font-bold mt-0.5 uppercase tracking-widest text-[10px]">Savietto's family</p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {/* Hotel Quick Link */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Hotel+AltaDomus+Roma"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-11 h-11 bg-white border-2 border-deep-blue text-deep-blue rounded-xl shadow-md active:scale-90 transition-all font-bold text-xl"
              title="Naviga verso l'Hotel"
            >
              🏨
            </a>

            {/* Hamburger Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col justify-center items-center w-11 h-11 bg-deep-blue rounded-xl shadow-lg gap-1.5 active:scale-90 transition-all"
              aria-label="Menu"
            >
            <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="bg-white border-t border-amber-200 shadow-xl pb-2 animate-fadeIn">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 px-5 pt-3 pb-2">
              📅 Giorni del Viaggio
            </p>
            {scheduleData.map((day, idx) => (
              <button
                key={idx}
                onClick={() => selectDay(idx)}
                className={`w-full text-left px-5 py-3 font-bold text-sm flex items-center gap-3 transition-colors ${
                  activeDay === idx
                    ? 'bg-amber-50 text-sun-orange border-l-4 border-sun-orange'
                    : 'text-slate-700 hover:bg-slate-50 border-l-4 border-transparent'
                }`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                  activeDay === idx ? 'bg-sun-orange text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {idx + 1}
                </span>
                {day.day}
              </button>
            ))}

            {/* Divider */}
            <div className="mx-5 my-2 border-t border-slate-100" />

            {/* Photos Link in Menu */}
            <a
              href={googleDriveLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="w-full flex items-center gap-3 px-5 py-3 font-bold text-sm text-white bg-sun-orange hover:bg-amber-600 transition-colors"
            >
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-base flex-shrink-0">📸</span>
              Vai alle Foto del Viaggio
            </a>
          </div>
        )}
      </header>

      {/* Overlay to close menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[-1]" onClick={() => setMenuOpen(false)} />
      )}

      {/* Current day indicator strip */}
      <div className="w-full bg-deep-blue text-white text-center py-2 text-xs font-black uppercase tracking-widest">
        {scheduleData[activeDay].day}
      </div>

      {/* Main Content */}
      <main className="w-full max-w-lg p-4 pb-8 flex-grow">
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 animate-fadeIn">
          <div className="flex justify-between items-center mb-6 border-b-4 border-sun-gold pb-2">
            <h2 className="text-xl font-black text-slate-800">
              Programma del Giorno
            </h2>
            {/* Compact Photos icon at top of day */}
            <a
              href={googleDriveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sun-orange text-white p-2 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              title="Vai alle Foto"
            >
              <span className="text-xl">📸</span>
            </a>
          </div>

          <div className="space-y-8">
            {scheduleData[activeDay].events.map((event, idx) => (
              <div key={idx} className="flex group">
                {/* Time Column */}
                <div className="w-20 pt-1 flex-shrink-0">
                  <span className="bg-sun-gold px-2 py-1 rounded text-deep-blue font-black text-xs shadow-sm ring-1 ring-deep-blue/10">
                    {event.time}
                  </span>
                </div>

                {/* Vertical Line */}
                <div className="w-px bg-slate-200 mx-4 relative">
                  <div className="absolute top-2 -left-1 w-2 h-2 rounded-full bg-sun-orange shadow-sm" />
                </div>

                {/* Details Column */}
                <div className="flex-grow pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-sun-orange transition-colors pr-2">
                        {event.title}
                      </h3>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-tighter mb-1 flex items-center">
                        <span className="mr-1">📍</span> {event.location}
                      </p>
                    </div>

                    {/* Maps Button - Icon Only */}
                    <a
                      href={event.maps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 flex items-center justify-center bg-deep-blue text-white w-10 h-10 rounded-full shadow-lg hover:bg-slate-800 active:scale-90 transition-all border-2 border-white"
                      title="Apri in Google Maps"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </a>
                  </div>

                  {event.notes && (
                    <p className="text-slate-600 text-sm italic mt-2 mb-3 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border-l-4 border-sun-gold">
                      {event.notes}
                    </p>
                  )}

                  {event.link && (
                    <a
                      href={event.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-800 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-100 active:scale-95 transition-all"
                    >
                      {event.link.label}
                      <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Photos Section - Bottom Banner */}
        <div className="mt-6 bg-sun-orange rounded-3xl p-5 shadow-xl text-white flex items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-lg leading-tight">📸 Ricordi del Viaggio</h3>
            <p className="text-sm opacity-90 font-medium mt-0.5">Guarda & carica le foto su Drive!</p>
          </div>
          <a
            href={googleDriveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-white text-sun-orange font-black text-sm px-4 py-2.5 rounded-2xl shadow-lg hover:bg-amber-50 active:scale-95 transition-all"
          >
            VAI ALLE FOTO
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-5 text-center text-slate-400 text-xs font-semibold">
        <p>© 2026 Savietto's Family - Roma Trip</p>
      </footer>
    </div>
  )
}

export default App
