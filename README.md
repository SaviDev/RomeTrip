# Toscana 2026 - Ritiro Estivo in Maremma 🍷🌾

Web Application per il soggiorno ed esplorazione della Maremma Toscana.

## 📅 Dettagli del Viaggio
- **Date**: Dal 30 luglio al 2 agosto 2026 (4 giorni / 3 notti)
- **Location**: Poderi Di Montemerano (Via del Santarello 35, Manciano - GR)
- **Mezzi**: 3 Autovetture (Bass, Mamma di Bass, Chiara VK)

## 🚀 Caratteristiche dell'App
- **Programma Interattivo**: Dettaglio giorno per giorno (30 Luglio - 2 Agosto) con collegamenti diretti a Google Maps per borghi, spiagge dell'Argentario e terme.
- **Logistica Trasporti**: Orari di partenza, check-in, check-out e dettagli autovetture.
- **Dettaglio Alloggio**: Mappa, link a Booking e note sulla struttura.
- **Budget & Calcolatore Costi**: Tabella riassuntiva spese fisse e giornaliere, con calcolatore interattivo per persona.
- **Spese (Tricount)**: Gestione spese di gruppo con divisione costi, saldi e pareggio conti — **sincronizzata in tempo reale via backend**.
- **Checklist 'Cose da Portare'**: Lista interattiva con spunte per persona — **sincronizzata in tempo reale via backend**.

## 🔄 Sincronizzazione Multi-Dispositivo

L'app salva spese e checklist su un **backend centrale** (gira sul PC dedicato), così ogni telefono del gruppo vede e modifica gli stessi dati.

### Backend (PC dedicato)

```bash
cd backend
npm install
TOSCANA_TOKEN=il-tuo-token node server.js
```

- Porta: `4000`
- Dati salvati in: `backend/data/db.json`
- Auth: header `Authorization: Bearer <token>`
- CRUD granulare: `GET/POST /api/expenses`, `PUT/DELETE /api/expenses/:id`, idem per `/api/checklist`

### Esposizione su internet (per i telefoni in 4G/5G)

```bash
cloudflared tunnel --url http://localhost:4000   # URL temporaneo
# oppure: hostname stabile sul tunnel named esistente (es. toscana.tuomeccanico.it)
```

### Frontend

Copia `.env.example` in `.env` e imposta l'URL del backend:

```env
VITE_API_URL=https://toscana.tuomeccanico.it
VITE_API_TOKEN=il-tuo-token
```

- Se `VITE_API_URL` è vuoto → modalità offline (solo localStorage, come prima)
- Il **server è la fonte di verità**: al caricamento i dati locali vengono sincronizzati col server
- Sincronizzazione **granulare** (create/update/delete per singolo elemento): due telefoni possono modificare in parallelo senza sovrascriversi
- Polling automatico ogni 10s + sincronizzazione immediata a ogni modifica
- localStorage resta come cache offline

## 💻 Sviluppo

```bash
npm install
npm run dev        # frontend (Vite)
cd backend && npm install && node server.js   # backend
```

## 🔒 Sicurezza

Cambia sempre `TOSCANA_TOKEN` (il default `toscana2026-maremma` è solo per sviluppo). Il backend è pensato per un gruppo ristretto su rete semi-privata (tunnel Cloudflare): non esporlo senza protezione aggiuntiva se contiene dati sensibili.
