export const lodgingData = {
  name: "Poderi Di Montemerano",
  address: "Via del Santarello 35, Manciano (GR)",
  dates: "11 - 14 Agosto 2026",
  duration: "4 giorni / 3 notti",
  checkIn: "Dalle 15:00 alle 19:00 (Arrivo previsto h 11:00)",
  checkOut: "Dalle 08:00 alle 11:00",
  bookingUrl: "https://www.booking.com/hotel/it/poderi-di-montemerano.it.html",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Poderi+Di+Montemerano+Via+del+Santarello+35+Manciano",
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
    { id: 2, name: "Auto 2", driver: "Io (Mamma di Bass)", description: "Trasporto gruppo e bagagli" },
    { id: 3, name: "Auto 3", driver: "Chiara VK", description: "Da definire la composizione equipaggio" }
  ]
};

export const costsData = {
  sharedFixed: [
    { item: "Alloggio (Poderi Di Montemerano)", totalCost: 1111.91, perPerson: 123.55, note: "Totale alloggio per la durata del soggiorno" },
    { item: "Carburante / Auto (pieni stimati)", totalCost: 180.00, perPerson: 30.00, note: "180€ totali per 3 auto / pieni (circa 15-30€ a testa su 6-9 pers)" },
    { item: "Tassa di soggiorno", totalCost: 36.00, perPerson: 4.00, note: "4€ a persona" }
  ],
  subtotalFixedPerPerson: 157.55,
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
  { id: 1, item: "Tovaglia", assignedTo: ["Bass"], checkedBy: [], category: "Casa / Cucina" },
  { id: 2, item: "Straccio", assignedTo: ["Cla"], checkedBy: [], category: "Casa / Cucina" },
  { id: 3, item: "Candela decorativa", assignedTo: ["Maddi"], checkedBy: [], category: "Casa / Cucina" },
  { id: 4, item: "Candele per zanzare", assignedTo: ["Da comprare"], checkedBy: [], category: "Spesa comune" },
  { id: 5, item: "Olio d'oliva", assignedTo: ["Da comprare"], checkedBy: [], category: "Spesa comune" },
  { id: 6, item: "Sale", assignedTo: ["Maddi"], checkedBy: [], category: "Casa / Cucina" },
  { id: 7, item: "Zucchero", assignedTo: ["Meryland"], checkedBy: [], category: "Casa / Cucina" },
  { id: 8, item: "Caffè", assignedTo: ["Da comprare"], checkedBy: [], category: "Spesa comune" },
  { id: 9, item: "Borse Frigo", assignedTo: ["Io", "Cla", "Onga", "Maddi", "Chiara"], checkedBy: [], category: "Mare & Viaggio" },
  { id: 10, item: "Spruzzo Multiuso detergenti", assignedTo: ["Chiedere alla struttura"], checkedBy: [], category: "Pulizia" },
  { id: 11, item: "Spugnetta per piatti", assignedTo: ["Chiedere alla struttura"], checkedBy: [], category: "Pulizia" },
  { id: 12, item: "Detersivo per piatti", assignedTo: ["Chiedere alla struttura"], checkedBy: [], category: "Pulizia" },
  { id: 13, item: "Sacchetti per immondizia", assignedTo: ["Chiedere alla struttura"], checkedBy: [], category: "Pulizia" },
  { id: 14, item: "Moka per il caffè", assignedTo: ["Bass"], checkedBy: [], category: "Casa / Cucina" },
  { id: 15, item: "Scottex / Carta casa", assignedTo: ["Chiedere alla struttura"], checkedBy: [], category: "Pulizia" },
  { id: 16, item: "Cassa Audio Bluetooth", assignedTo: ["Bass"], checkedBy: [], category: "Svago" },
  { id: 17, item: "Quickstop / Carte da gioco", assignedTo: ["Meryland", "Dave"], checkedBy: [], category: "Svago" },
  { id: 18, item: "Pistole d'acqua Dave", assignedTo: ["Dave"], checkedBy: [], category: "Svago" },
  { id: 19, item: "Schiscette e contenitori cibo", assignedTo: ["Maddi", "Io", "Meryland", "Onga"], checkedBy: [], category: "Mare & Viaggio" }
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
        title: "Arrivo ai Poderi Di Montemerano",
        location: "Via del Santarello 35, Manciano (GR)",
        notes: "Primo contatto con la struttura e scarico bagagli preliminare. L'arrivo anticipato consente di godersi la prima mezza giornata.",
        maps: "https://www.google.com/maps/search/?api=1&query=Poderi+Di+Montemerano+Via+del+Santarello+35+Manciano",
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
        location: "Poderi Di Montemerano",
        notes: "Orario ufficiale di Check-in. Assegnazione camere e relax iniziale.",
        maps: "https://www.google.com/maps/search/?api=1&query=Poderi+Di+Montemerano"
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
        location: "Poderi Di Montemerano",
        notes: "Colazione in struttura e preparazione borse frigo e pasta fredda per il mare.",
        maps: "https://www.google.com/maps/search/?api=1&query=Poderi+Di+Montemerano"
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
        location: "Poderi Di Montemerano",
        notes: "Rientro a casa, doccia rigenerante e momento aperitivo in giardino/piscina.",
        maps: "https://www.google.com/maps/search/?api=1&query=Poderi+Di+Montemerano"
      },
      {
        time: "20:30",
        title: "Cena a Casa: Bruschettata!",
        location: "Poderi Di Montemerano",
        notes: "Cena conviviale all'aperto a casa con super bruschette miste (pomodoro, olio locale, affettati, formaggi), musica e giochi di società.",
        maps: "https://www.google.com/maps/search/?api=1&query=Poderi+Di+Montemerano"
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
        maps: "https://www.google.com/maps/search/?api=1&query=Poderi+Di+Montemerano"
      },
      {
        time: "11:30",
        title: "Piscina & Solarium ai Poderi",
        location: "Piscina Poderi Di Montemerano",
        notes: "Permanenza in piscina, lettini, sole, musica con la cassa di Bass e totale tranquillità.",
        maps: "https://www.google.com/maps/search/?api=1&query=Poderi+Di+Montemerano"
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
        location: "Area Barbecue Poderi Di Montemerano",
        notes: "Accensione carbonella, preparazione delle carni e verdure locali acquistate durante il giorno.",
        maps: "https://www.google.com/maps/search/?api=1&query=Poderi+Di+Montemerano"
      },
      {
        time: "20:30",
        title: "Maxi Grigliata & Festa di Chiusura",
        location: "Giardino Struttura",
        notes: "Cena sociale all'aperto, grigliata, brindisi, giochi con carte / Quickstop e pistole d'acqua di Dave!",
        maps: "https://www.google.com/maps/search/?api=1&query=Poderi+Di+Montemerano"
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
        location: "Poderi Di Montemerano",
        notes: "Ultima colazione in Maremma, chiusura bagagli e pulizia sommaria.",
        maps: "https://www.google.com/maps/search/?api=1&query=Poderi+Di+Montemerano"
      },
      {
        time: "08:00 - 11:00",
        title: "Check-out ufficiale dalla Struttura",
        location: "Poderi Di Montemerano",
        notes: "Consegna chiavi ed espletamento delle procedure di partenza (entro le ore 11:00).",
        maps: "https://www.google.com/maps/search/?api=1&query=Poderi+Di+Montemerano"
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
