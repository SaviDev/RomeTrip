export const scheduleData = [
  {
    day: "Giovedì 2 Luglio 2026",
    events: [
      { 
        time: "06:50", 
        title: "Inizio Viaggio", 
        location: "Casa", 
        notes: "Si parte con la colazione a casa. La zia ci accompagna in stazione.",
        maps: "https://www.google.com/maps/search/?api=1&query=Stazione+di+Castelfranco+Veneto"
      },
      { 
        time: "07:39", 
        title: "Treno da Castelfranco", 
        location: "Stazione Castelfranco", 
        notes: "Treno regionale per Padova.",
        maps: "https://www.google.com/maps/search/?api=1&query=Stazione+di+Castelfranco+Veneto"
      },
      { 
        time: "08:50", 
        title: "Partenza da Padova", 
        location: "Stazione di Padova", 
        notes: "Treno ad alta velocità per Roma Termini.",
        maps: "https://www.google.com/maps/search/?api=1&query=Stazione+di+Padova"
      },
      { 
        time: "12:05", 
        title: "Arrivo a Roma Termini", 
        location: "Roma Termini", 
        notes: "Arrivo previsto a mezzogiorno.",
        maps: "https://www.google.com/maps/search/?api=1&query=Roma+Termini"
      },
      { 
        time: "12:15", 
        title: "Deposito Valigie", 
        location: "Hotel AltaDomus", 
        notes: "L'hotel si trova a soli 4 minuti a piedi dalla stazione Termini.",
        maps: "https://www.google.com/maps/search/?api=1&query=Hotel+AltaDomus+Roma",
        link: { label: "🏨 Sito Hotel", url: "https://www.hotelaltadomus.it" }
      },
      { 
        time: "Pranzo", 
        title: "Pranzo veloce", 
        location: "Termini Area", 
        notes: "Pranzo al sacco o take away veloce (paninozzo e ovetto Kuretto).",
        maps: "https://www.google.com/maps/search/?api=1&query=Pranzo+Roma+Termini"
      },
      { 
        time: "Pomeriggio", 
        title: "Vittoriano & Foro Romano", 
        location: "Piazza Venezia", 
        notes: "Visita al Monumento Vittorio Emanuele II (il \"Vittoriano\") e passeggiata lungo i Fori Imperiali fino al Colosseo. Il monumento è gratuito e offre una vista panoramica spettacolare dalla terrazza.",
        maps: "https://www.google.com/maps/search/?api=1&query=Altare+della+Patria",
        link: { label: "ℹ️ Info Guida", url: "https://www.museiincomuneroma.it/il-vittoriano" }
      },
      { 
        time: "15:40", 
        title: "Colosseo", 
        location: "Colosseo", 
        notes: "Visita prenotata per mamma, papà e dodo. Durata circa 20 min. Il Colosseo, costruito nel 70-80 d.C., poteva ospitare fino a 80.000 spettatori. Ricordati di portare il documento d'identità per i biglietti nominativi.",
        maps: "https://www.google.com/maps/search/?api=1&query=Colosseo",
        link: { label: "📖 Guida Ufficiale", url: "https://colosseo.it" }
      },
      { 
        time: "21:00", 
        title: "Cena al Dar Bruttone", 
        location: "Rione Monti", 
        notes: "Tradizionale osteria romana a Rione Monti. Specialità: Carbonara, Amatriciana, Coda alla vaccinara. Prenotazione già confermata.",
        maps: "https://www.google.com/maps/search/?api=1&query=Dar+Bruttone+Roma",
        link: { label: "🍽️ Menù e Info", url: "http://www.darbruttonerionemonti.com" }
      },
      { 
        time: "Sera", 
        title: "Fontana di Trevi", 
        location: "Fontana di Trevi", 
        notes: "Passeggiata serale alla fontana. Forse dopo cena non si paga l'ingresso. Buttate una monetina: secondo la leggenda garantisce il ritorno a Roma!",
        maps: "https://www.google.com/maps/search/?api=1&query=Fontana+di+Trevi",
        link: { label: "📖 Storia & Info", url: "https://www.turismoroma.it/it/luoghi/fontana-di-trevi" }
      }
    ]
  },
  {
    day: "Venerdì 3 Luglio 2026",
    events: [
      { 
        time: "08:30", 
        title: "Colazione", 
        location: "Roma", 
        notes: "Carica per la giornata vaticana.",
        maps: "https://www.google.com/maps/search/?api=1&query=Colazione+Roma+Prati"
      },
      { 
        time: "10:00", 
        title: "Basilica di San Pietro", 
        location: "Piazza San Pietro", 
        notes: "Visita prenotata! La basilica più grande del mondo, costruita sul luogo del martirio di San Pietro. Da non perdere: la Pietà di Michelangelo (1499), la cupola e il colonnato del Bernini. Abbigliamento decoroso obbligatorio (spalle e ginocchia coperte).",
        maps: "https://www.google.com/maps/search/?api=1&query=Basilica+di+San+Pietro",
        link: { label: "📖 Sito Ufficiale", url: "https://www.basilicasanpietro.va" }
      },
      { 
        time: "13:00", 
        title: "Circo Massimo & Giardino degli Aranci", 
        location: "Aventino", 
        notes: "Il Circo Massimo era il più grande stadio dell'antichità (300.000 spettatori). Il Giardino degli Aranci sull'Aventino offre la migliore vista panoramica di Roma e il famoso 'buco della serratura' del Priorato di Malta, dove si vede la cupola di San Pietro perfettamente inquadrata.",
        maps: "https://www.google.com/maps/search/?api=1&query=Giardino+degli+Aranci",
        link: { label: "ℹ️ Info Circo Massimo", url: "https://www.turismoroma.it/it/luoghi/circo-massimo" }
      },
      { 
        time: "16:00", 
        title: "Catacombe (Prenotato)", 
        location: "Via Appia Antica", 
        notes: "Visita guidata prenotata. Dalila è a lezione fino alle 18:30. Le catacombe sono una rete di gallerie sotterranee usate dai primi cristiani come cimitero. Temperature interne attorno ai 15°C — portate una felpa!",
        maps: "https://www.google.com/maps/search/?api=1&query=Catacombe+Roma+Via+Appia",
        link: { label: "📖 Sito Catacombe", url: "https://www.catacombesancallisto.it" }
      },
      { 
        time: "19:00", 
        title: "Isola Tiberina", 
        location: "Tevere", 
        notes: "L'unica isola fluviale di Roma, collegata al Trastevere e al Ghetto Ebraico da ponti antichissimi. Bella per una passeggiata serale nelle piazze vicine.",
        maps: "https://www.google.com/maps/search/?api=1&query=Isola+Tiberina",
        link: { label: "ℹ️ Scopri di Più", url: "https://www.turismoroma.it/it/luoghi/isola-tiberina" }
      },
      { 
        time: "Cena", 
        title: "Cena: Come 'na Vorta", 
        location: "Trastevere / Centro", 
        notes: "Cucina romana con pasta fresca fatta in casa. Scegli il formato (fettuccine, gnocchi, ravioli…) e il condimento (Carbonara, Cacio e Pepe, Amatriciana). Alternative: Osteria il Matto o Vino Bono.",
        maps: "https://www.google.com/maps/search/?api=1&query=Come+'na+Vorta+Pasta+E+Vino+Roma",
        link: { label: "🍽️ Menù e Sedi", url: "https://www.comenavorta.it" }
      }
    ]
  },
  {
    day: "Sabato 4 Luglio 2026",
    events: [
      { 
        time: "08:30", 
        title: "Colazione", 
        location: "Roma", 
        notes: "Ultima mattina libera prima del tour del centro.",
        maps: "https://www.google.com/maps/search/?api=1&query=Colazione+Roma"
      },
      { 
        time: "09:30", 
        title: "Piazza di Spagna & Pincio", 
        location: "Piazza di Spagna", 
        notes: "La scalinata di Trinità dei Monti (135 gradini, 1725) è uno dei luoghi più fotografati di Roma. Salite fino alla terrazza del Pincio per una vista panoramica con vista su Piazza del Popolo. Dalila è a lezione.",
        maps: "https://www.google.com/maps/search/?api=1&query=Piazza+di+Spagna",
        link: { label: "ℹ️ Guida Turistica", url: "https://www.turismoroma.it/it/luoghi/piazza-di-spagna" }
      },
      { 
        time: "12:00", 
        title: "Pranzo veloce", 
        location: "Zona Prati/Vaticano", 
        notes: "Snack prima dei musei.",
        maps: "https://www.google.com/maps/search/?api=1&query=Pranzo+Prati+Roma"
      },
      { 
        time: "13:00", 
        title: "Musei Vaticani & Cappella Sistina", 
        location: "Musei Vaticani", 
        notes: "I Musei Vaticani contengono una delle più grandi collezioni d'arte al mondo. La Cappella Sistina (affrescata da Michelangelo 1508-1512) è inclusa nel biglietto. Attenzione: il sabato può essere molto affollato — senza prenotazione possono esserci attese. Silenzio e niente foto con flash nella Cappella.",
        maps: "https://www.google.com/maps/search/?api=1&query=Musei+Vaticani",
        link: { label: "🎟️ Biglietti Ufficiali", url: "https://tickets.museivaticani.va" }
      },
      { 
        time: "17:00", 
        title: "Gianicolo", 
        location: "Passeggiata del Gianicolo", 
        notes: "Uno dei colli più alti di Roma con una terrazza panoramica mozzafiato sul centro storico. Ogni giorno a mezzogiorno viene sparato un colpo di cannone come tradizione. Ottimo per il tramonto!",
        maps: "https://www.google.com/maps/search/?api=1&query=Passeggiata+del+Gianicolo",
        link: { label: "ℹ️ Info Gianicolo", url: "https://www.turismoroma.it/it/luoghi/gianicolo" }
      },
      { 
        time: "20:00", 
        title: "Cena: Osteria Rugantino", 
        location: "Trastevere",
        notes: "Ristorante storico nel cuore di Trastevere, famoso per la cucina romana tradizionale. Atmosfera vivace e tipica del quartiere. Via della Lungaretta 54.",
        maps: "https://www.google.com/maps/search/?api=1&query=Osteria+Rugantino+Trastevere",
        link: { label: "🍽️ Menù & Prenotazioni", url: "https://www.anticaosteriarugantino.it" }
      }
    ]
  },
  {
    day: "Domenica 5 Luglio 2026",
    events: [
      { 
        time: "08:30", 
        title: "Colazione", 
        location: "Centro", 
        notes: "Ultima colazione romana — godetevela!",
        maps: "https://www.google.com/maps/search/?api=1&query=Colazione+Roma+Centro"
      },
      { 
        time: "09:30", 
        title: "Piazza Navona", 
        location: "Piazza Navona", 
        notes: "Una delle piazze più belle di Roma, costruita sullo stadio di Domiziano (86 d.C.). Al centro si trova la Fontana dei Quattro Fiumi del Bernini. Nei dintorni anche il Pantheon e Campo dei Fiori.",
        maps: "https://www.google.com/maps/search/?api=1&query=Piazza+Navona",
        link: { label: "ℹ️ Guida Piazza Navona", url: "https://www.turismoroma.it/it/luoghi/piazza-navona" }
      },
      { 
        time: "09:30", 
        title: "Pantheon", 
        location: "Pantheon", 
        notes: "Il tempio romano meglio conservato al mondo, costruito da Adriano nel 125 d.C. La cupola con il suo 'oculus' (apertura di 9m) è ancora oggi la più grande cupola non rinforzata del mondo. Ingresso a pagamento (7€). Orari: 9:00-19:00.",
        maps: "https://www.google.com/maps/search/?api=1&query=Pantheon+Roma",
        link: { label: "🎟️ Biglietti Ufficiali", url: "https://portale.museiitaliani.it" }
      },
      { 
        time: "09:30", 
        title: "Campo dei Fiori", 
        location: "Campo dei Fiori", 
        notes: "Vivace piazza nel centro storico. La domenica mattina c'è il mercato. Al centro la statua di Giordano Bruno, bruciato vivo qui nel 1600. Ottimo posto per uno spuntino o un gelato.",
        maps: "https://www.google.com/maps/search/?api=1&query=Campo+dei+Fiori+Roma",
        link: { label: "ℹ️ Info Campo dei Fiori", url: "https://www.turismoroma.it/it/luoghi/campo-de-fiori" }
      },
      { 
        time: "12:00", 
        title: "Pranzo", 
        location: "Centro Storico", 
        notes: "Ultimo pasto a Roma — da scegliere sul momento!",
        maps: "https://www.google.com/maps/search/?api=1&query=Ristorante+Centro+Storico+Roma"
      },
      { 
        time: "13:00", 
        title: "Verso Termini", 
        location: "Roma Termini", 
        notes: "Rientro in stazione, ritiro valigie e partenza.",
        maps: "https://www.google.com/maps/search/?api=1&query=Roma+Termini"
      },
      { 
        time: "16:35", 
        title: "Treno di Ritorno", 
        location: "Roma Termini", 
        notes: "Arrivo a Padova alle 20:04. Possibile coincidenza per Castelfranco alle 20:07, altrimenti si aspetta 1 ora il treno successivo.",
        maps: "https://www.google.com/maps/search/?api=1&query=Roma+Termini",
        link: { label: "🚄 Trenitalia", url: "https://www.trenitalia.com" }
      }
    ]
  }
];
