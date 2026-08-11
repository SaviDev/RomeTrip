export const lodgingData = {
  name: "Podere Sèmia (Poggio Cucco)",
  address: "58014 Poderi (GR)",
  dates: "11 - 14 Agosto 2026",
  duration: "4 giorni / 3 notti",
  checkIn: "Dalle 15:00 alle 19:00 (Arrivo previsto h 11:00)",
  checkOut: "Dalle 08:00 alle 11:00",
  bookingUrl: "https://www.booking.com/hotel/it/poderi-di-montemerano.it.html",
  mapsUrl: "https://www.google.com/maps/place/Podere+S%C3%A8mia+(Poggio+Cucco),+58014+Poderi+GR/data=!4m2!3m1!1s0x132903bd3f7553f7:0x925ba0c11ca48922!18m1!1e1",
  notes: "Sistemazione immersa nella serena Maremma Toscana, con spazi esterni e piscina. Ideale per relax e grigliate!"
};

export const logisticsData = {
  departureDate: "11 Agosto 2026",
  departureMeeting: "Parcheggio Martini",
  departureTime: "06:00",
  arrivalTime: "11:00 (stimato, circa 5 ore + soste)",
  breakfastSpot: "Colazione in autogrill lungo il tragitto",
  returnDate: "14 Agosto 2026",
  returnDepartureTime: "11:00 / 12:00 (post check-out)",
  returnArrivalTime: "17:00 / 18:00 (circa 5h30m - 6h)",
  cars: [
    { id: 1, name: "Auto 1", driver: "Bass", description: "Trasporto gruppo e bagagli" },
    { id: 2, name: "Auto 2", driver: "Io (Luca) / Mamma di Bass", description: "Trasporto gruppo e bagagli" },
    { id: 3, name: "Auto 3", driver: "Chiara VK", description: "Auto messa a disposizione da Chiara" }
  ]
};

export const costsData = {
  sharedFixed: [
    { item: "Alloggio (Podere Sèmia)", totalCost: 1111.91, perPerson: 101.08, note: "Totale alloggio per la durata del soggiorno (su 11 persone)" },
    { item: "Carburante / Auto (pieni stimati)", totalCost: 180.00, perPerson: 16.36, note: "180€ totali per 3 auto / pieni (circa 16€ a testa su 11 pers)" },
    { item: "Tassa di soggiorno", totalCost: 36.00, perPerson: 3.27, note: "3.27€ a persona (11 persone)" }
  ],
  subtotalFixedPerPerson: 120.71,
  dailyBreakdown: [
    {
      day: "Giorno 1 (11 Agosto)",
      items: [
        { label: "Pranzo al volo / Tavola calda", amount: 20 },
        { label: "Spesa inizio avventura", amount: 20 },
        { label: "Cena tipica maremmana", amount: 50 },
        { label: "Visita Santuario Animali", amount: 20 },
        { label: "Spese varie & Souvenir", amount: 30 }
      ],
      dayTotal: 140
    },
    {
      day: "Giorno 2 (12 Agosto)",
      items: [
        { label: "Cibo per il mare (pranzo al sacco / pasta fredda)", amount: 20 },
        { label: "Spese varie, souvenirs, escursioni", amount: 30 }
      ],
      dayTotal: 50
    },
    {
      day: "Giorno 3 (13 Agosto)",
      items: [
        { label: "Grigliata di carne/verdure a casa", amount: 15 },
        { label: "Terme naturali", amount: 0, note: "Gratis! ♨️" }
      ],
      dayTotal: 15
    },
    {
      day: "Giorno 4 (14 Agosto)",
      items: [
        { label: "Colazione & Sosta rientro", amount: 10 }
      ],
      dayTotal: 10
    }
  ],
  baseTotalPerPerson: 372.55,
  contingencyBuffer: 50.00,
  grandTotalPerPerson: 422.55
};

export const checklistData = [
  { id: 1, item: "Tovaglia (Sagra)", assignedTo: ["Bass"], checkedBy: [], category: "Casa / Cucina" },
  { id: 2, item: "Straccio", assignedTo: ["Cla"], checkedBy: [], category: "Casa / Cucina" },
  { id: 3, item: "Candela", assignedTo: ["Maddi"], checkedBy: [], category: "Casa / Cucina" },
  { id: 4, item: "Candele per zanzare", assignedTo: ["Da comprare"], checkedBy: [], category: "Spesa comune" },
  { id: 5, item: "Olio d'oliva", assignedTo: ["Da comprare"], checkedBy: [], category: "Spesa comune" },
  { id: 6, item: "Sale fino", assignedTo: ["Meryland"], checkedBy: [], category: "Casa / Cucina" },
  { id: 7, item: "Sale grosso", assignedTo: ["Maddi"], checkedBy: [], category: "Casa / Cucina" },
  { id: 8, item: "Zucchero", assignedTo: ["Bass"], checkedBy: [], category: "Casa / Cucina" },
  { id: 9, item: "Caffè", assignedTo: ["Io (Luca)"], checkedBy: [], category: "Spesa comune" },
  { id: 10, item: "Borse Frigo", assignedTo: ["Onga", "Maddi", "Chiara", "Meryland"], checkedBy: [], category: "Mare & Viaggio" },
  { id: 11, item: "Spruzzo Multiuso detergenti", assignedTo: ["Maddi"], checkedBy: [], category: "Pulizia" },
  { id: 12, item: "Spugnetta per piatti", assignedTo: ["Io (Luca)", "Meryland", "Maddi"], checkedBy: [], category: "Pulizia" },
  { id: 13, item: "Detersivo per piatti", assignedTo: ["Onga"], checkedBy: [], category: "Pulizia" },
  { id: 14, item: "Sacchetti per immondizia", assignedTo: ["Chiedere alla struttura"], checkedBy: [], category: "Pulizia" },
  { id: 15, item: "Moka per il caffè", assignedTo: ["Bass"], checkedBy: [], category: "Casa / Cucina" },
  { id: 16, item: "Scottex / Carta casa", assignedTo: ["Da comprare"], checkedBy: [], category: "Pulizia" },
  { id: 17, item: "Cassa Audio Bluetooth", assignedTo: ["Bass"], checkedBy: [], category: "Svago" },
  { id: 18, item: "Quickstop / Carte da gioco / Giochi da tavola", assignedTo: ["Meryland", "Dave"], checkedBy: [], category: "Svago" },
  { id: 19, item: "Fogli per giochi", assignedTo: ["Dave"], checkedBy: [], category: "Svago" },
  { id: 20, item: "Pistole d'acqua Dave", assignedTo: ["Dave"], checkedBy: [], category: "Svago" },
  { id: 21, item: "Schiscette e contenitori cibo", assignedTo: ["Io (Luca)", "Bass", "Cla", "Maddi", "Meryland", "Dave", "Chiara", "Onga"], checkedBy: [], category: "Mare & Viaggio" },
  { id: 22, item: "Cavatappi", assignedTo: ["Chiara"], checkedBy: [], category: "Casa / Cucina" },
  { id: 23, item: "Maschere per snorkeling", assignedTo: ["Chiara"], checkedBy: [], category: "Mare & Viaggio" },
  { id: 24, item: "Ombrelloni da spiaggia", assignedTo: ["Maddi", "Chiara", "Cla", "Onga"], checkedBy: [], category: "Mare & Viaggio" },
  { id: 25, item: "Pasta", assignedTo: ["Da comprare"], checkedBy: [], category: "Spesa comune" },
  { id: 26, item: "Biscotti", assignedTo: ["Da comprare"], checkedBy: [], category: "Spesa comune" }
];

export const scheduleData = [
  {
    dayIndex: 0,
    day: "11 Agosto 2026",
    title: "Borghi & Maremma",
    highlight: "Arrivo in Maremma, borghi medievali e cena tipica",
    events: [
      {
        time: "06:00",
        title: "Partenza dal Parcheggio Martini",
        location: "Parcheggio Martini",
        notes: "Partenza in orario mattutino per massimizzare il primo pomeriggio. Sosta colazione in autogrill lungo il viaggio.",
        maps: "https://www.google.com/maps/search/?api=1&query=Parcheggio+Martini"
      },
      {
        time: "11:00",
        title: "Arrivo ai Podere Sèmia",
        location: "Via del Santarello 35, Manciano (GR)",
        notes: "Primo contatto con la struttura e scarico bagagli preliminare. L'arrivo anticipato consente di godersi la prima mezza giornata.",
        maps: "https://www.google.com/maps/search/?api=1&query=Podere+S%C3%A8mia+Via+del+Santarello+35+Manciano",
        link: { label: "🏨 Link Booking Alloggio", url: "https://www.booking.com/hotel/it/poderi-di-montemerano.it.html" }
      },
      {
        time: "12:30",
        title: "Pranzo Leggero",
        location: "Manciano / Vicinanze Struttura",
        notes: "Pasto rapido (picnic o tavola calda/bar nelle vicinanze) prima dell'accesso alle camere.",
        maps: "https://www.google.com/maps/search/?api=1&query=Bar+Ristorante+Manciano"
      },
      {
        time: "15:00 - 19:00",
        title: "Check-in & Sistemazione Camere",
        location: "Podere Sèmia",
        notes: "Orario ufficiale di Check-in. Assegnazione camere e relax iniziale.",
        maps: "https://www.google.com/maps/search/?api=1&query=Podere+S%C3%A8mia"
      },
      {
        time: "16:30",
        title: "Esplorazione Borghi Limitrofi",
        location: "Maremma Toscana",
        notes: "Giro turistico dei pittoreschi borghi vicini e opzione visita Santuario Faunistico.",
        maps: "https://www.google.com/maps/search/?api=1&query=Montemerano+GR",
        options: [
          { name: "Montemerano", dist: "7 min", desc: "Pregevole borgo medievale, vicinissimo alla casa, perfetto per una passeggiata romantica.", maps: "https://www.google.com/maps/search/?api=1&query=Montemerano" },
          { name: "Manciano", dist: "7 min", desc: "Capoluogo con fantastica vista panoramica. Famoso per la Sagra dei Pici!", maps: "https://www.google.com/maps/search/?api=1&query=Manciano" },
          { name: "Semproniano", dist: "28 min", desc: "Ulteriore borgo di grande interesse storico e paesaggistico.", maps: "https://www.google.com/maps/search/?api=1&query=Semproniano" }
        ]
      },
      {
        time: "20:30",
        title: "Cena Tipica Maremmana",
        location: "Trattoria locale a Manciano / Montemerano",
        notes: "Cena in trattoria locale per assaporare le specialità maremmane: cinghiale in umido, acquacotta, tortelli maremmani e pici!",
        maps: "https://www.google.com/maps/search/?api=1&query=Trattoria+Maremmana+Manciano"
      }
    ]
  },
  {
    dayIndex: 1,
    day: "12 Agosto 2026",
    title: "Giornata Marina all'Argentario",
    highlight: "Mare, calette mozzafiato, pasta fredda e bruschettata serale",
    events: [
      {
        time: "08:30",
        title: "Colazione & Preparazione Pranzo al Sacco",
        location: "Podere Sèmia",
        notes: "Colazione in struttura e preparazione borse frigo e pasta fredda per il mare.",
        maps: "https://www.google.com/maps/search/?api=1&query=Podere+S%C3%A8mia"
      },
      {
        time: "09:30",
        title: "Partenza per l'Argentario & Costa Maremmana",
        location: "Monte Argentario & Litorale",
        notes: "Circa 45-60 min di strada panoramica per raggiungere il litorale. Selezione tra le spiagge migliori!",
        maps: "https://www.google.com/maps/search/?api=1&query=Monte+Argentario",
        options: [
          { name: "Cala del Gesso", dist: "1 ora", desc: "Cala rocciosa e pittoresca, splendida per snorkeling. Richiede un sentiero in pendenza.", maps: "https://www.google.com/maps/search/?api=1&query=Cala+del+Gesso" },
          { name: "Spiaggia della Feniglia", dist: "1 ora", desc: "Lunga spiaggia di sabbia libera immersa nella pineta e riserva naturale. Molto rilassante.", maps: "https://www.google.com/maps/search/?api=1&query=Spiaggia+della+Feniglia" },
          { name: "Spiaggia OSA", dist: "47 min", desc: "Sabbiosa, più vicina rispetto all'Argentario. Molto agevole per relax immediato.", maps: "https://www.google.com/maps/search/?api=1&query=Spiaggia+OSA+Fonteblanda" },
          { name: "Spiaggia La Giannella", dist: "42 min", desc: "Litorale di sabbia comodo, con tratti liberi e servizi/stabilimenti.", maps: "https://www.google.com/maps/search/?api=1&query=Spiaggia+La+Giannella" },
          { name: "Altre cale", dist: "45-60 min", desc: "La Cacciarella, Punta Cala Grande, Spiaggia di San Rocco, Poggio Pertuso.", maps: "https://www.google.com/maps/search/?api=1&query=Porto+Santo+Stefano" }
        ]
      },
      {
        time: "13:00",
        title: "Pranzo in Spiaggia",
        location: "Sotto l'ombrellone / Pineta",
        notes: "Pranzo al sacco con la pasta fredda preparata al mattino, frutta fresca e drink freschi dalle borse frigo.",
        maps: "https://www.google.com/maps/search/?api=1&query=Monte+Argentario"
      },
      {
        time: "18:00",
        title: "Rientro in Struttura & Docce",
        location: "Podere Sèmia",
        notes: "Rientro a casa, doccia rigenerante e momento aperitivo in giardino/piscina.",
        maps: "https://www.google.com/maps/search/?api=1&query=Podere+S%C3%A8mia"
      },
      {
        time: "20:30",
        title: "Cena a Casa: Bruschettata!",
        location: "Podere Sèmia",
        notes: "Cena conviviale all'aperto a casa con super bruschette miste (pomodoro, olio locale, affettati, formaggi), musica e giochi di società.",
        maps: "https://www.google.com/maps/search/?api=1&query=Podere+S%C3%A8mia"
      }
    ]
  },
  {
    dayIndex: 2,
    day: "13 Agosto 2026",
    title: "Relax, Piscina, Terme & Super Grigliata",
    highlight: "Giornata di puro relax, bagni in piscina e grigliata serale al BBQ",
    events: [
      {
        time: "09:00",
        title: "Mattinata Mare (Opzionale) o Relax a Casa",
        location: "Struttura o Spiaggia Vicina",
        notes: "Scelta libera: puntata rapida al mare oppure colazione senza fretta in veranda.",
        maps: "https://www.google.com/maps/search/?api=1&query=Podere+S%C3%A8mia"
      },
      {
        time: "11:30",
        title: "Piscina & Solarium ai Poderi",
        location: "Piscina Podere Sèmia",
        notes: "Permanenza in piscina, lettini, sole, musica con la cassa di Bass e totale tranquillità.",
        maps: "https://www.google.com/maps/search/?api=1&query=Podere+S%C3%A8mia"
      },
      {
        time: "16:30",
        title: "Sosta alle Terme Naturali",
        location: "Cascate del Mulino / Saturnia",
        notes: "Famosissime terme naturali ad accesso totalmente gratuito nei pressi di Montemerano! Acque termali sulfuree calde.",
        maps: "https://www.google.com/maps/search/?api=1&query=Cascate+del+Mulino+Saturnia",
        link: { label: "♨️ Info Terme di Saturnia", url: "https://www.cascate-del-mulino.it" }
      },
      {
        time: "19:00",
        title: "Preparazione Grigliata BBQ",
        location: "Area Barbecue Podere Sèmia",
        notes: "Accensione carbonella, preparazione delle carni e verdure locali acquistate durante il giorno.",
        maps: "https://www.google.com/maps/search/?api=1&query=Podere+S%C3%A8mia"
      },
      {
        time: "20:30",
        title: "Maxi Grigliata & Festa di Chiusura",
        location: "Giardino Struttura",
        notes: "Cena sociale all'aperto, grigliata, brindisi, giochi con carte / Quickstop e pistole d'acqua di Dave!",
        maps: "https://www.google.com/maps/search/?api=1&query=Podere+S%C3%A8mia"
      }
    ]
  },
  {
    dayIndex: 3,
    day: "14 Agosto 2026",
    title: "Check-out & Rientro",
    highlight: "Colazione, saluti alla Maremma e viaggio di rientro",
    events: [
      {
        time: "08:30",
        title: "Prima Colazione & Sistemazione Valigie",
        location: "Podere Sèmia",
        notes: "Ultima colazione in Maremma, chiusura bagagli e pulizia sommaria.",
        maps: "https://www.google.com/maps/search/?api=1&query=Podere+S%C3%A8mia"
      },
      {
        time: "08:00 - 11:00",
        title: "Check-out ufficiale dalla Struttura",
        location: "Podere Sèmia",
        notes: "Consegna chiavi ed espletamento delle procedure di partenza (entro le ore 11:00).",
        maps: "https://www.google.com/maps/search/?api=1&query=Podere+S%C3%A8mia"
      },
      {
        time: "11:30",
        title: "Partenza Viaggio di Rientro",
        location: "In viaggio verso casa",
        notes: "Partenza in auto (stimata tra le 11:00 e le 12:00). Tempo di percorrenza stimato: 5 ore e mezza / 6 ore.",
        maps: "https://www.google.com/maps/search/?api=1&query=Parcheggio+Martini"
      },
      {
        time: "13:30",
        title: "Sosta Pranzo di Rientro",
        location: "Autostrada / Ristorante lungo il tragitto",
        notes: "Pausa pranzo rilassante a metà percorso per spezzare il viaggio di rientro.",
        maps: "https://www.google.com/maps/search/?api=1&query=Autogrill"
      },
      {
        time: "17:30 / 18:00",
        title: "Arrivo a Destinazione",
        location: "Parcheggio Martini",
        notes: "Arrivo previsto a casa, scarico bagagli e saluti finali del Ritiro Estivo Toscana 2026! 🍷",
        maps: "https://www.google.com/maps/search/?api=1&query=Parcheggio+Martini"
      }
    ]
  }
];
