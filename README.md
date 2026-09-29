# Signal Atlas — Esame-Web2 (React)

Applicazione web sviluppata in React (Vite) per l'aggregazione di notizie tech da Hacker News. Il progetto consuma la REST API pubblica di Hacker News (https://hacker-news.firebaseio.com/v0/) per recuperare articoli top, thread commenti e profili utente.

Questa è la versione React del progetto, portata a partire dalla versione Vanilla JS mantenendo la stessa struttura funzionale e — soprattutto — gli stessi problemi da risolvere.

## Architettura e Struttura Directory

L'app è basata su componenti funzionali React con React Router per la navigazione client-side. La separazione dei file segue il principio di *Separation of Concerns* per disaccoppiare accesso ai dati, logica di pagina e componenti UI.

```text
Esame-Web2/
├── app/                        # Codice sorgente dell'applicazione
│   ├── App.jsx                 # Componente radice, definisce le rotte
│   ├── App.css                 # Foglio di stile globale
│   ├── main.jsx                # Entry point React
│   ├── components/             # Componenti UI riusabili
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── StoryCard.jsx
│   │   ├── RecordsTable.jsx
│   │   └── CommentThread.jsx
│   ├── pages/                  # Pagine/route dell'applicazione
│   │   ├── Home.jsx
│   │   ├── Radar.jsx           # Feed articoli più votati
│   │   ├── Focus.jsx           # Visualizzazione thread/commenti
│   │   ├── Profile.jsx         # Profilo utente
│   │   └── Archive.jsx         # Lista articoli salvati
│   ├── services/                # Accesso ai dati e persistenza
│   │   ├── api.js
│   │   └── storage.js
│   └── utils/
│       └── text.js
├── index.html
├── vite.config.js
├── LICENSE
└── README.md
```

## Funzionalità Core

- **Top Stories Feed (`app/pages/Radar.jsx`, `app/services/api.js`)**: fetching delle top stories da Hacker News con rendering dinamico delle card.
- **Thread e Commenti (`app/pages/Focus.jsx`, `app/components/CommentThread.jsx`)**: visualizzazione ricorsiva dell'albero commenti con lazy loading per rami profondi.
- **Profilo Utente (`app/pages/Profile.jsx`)**: recupero dati profilo e attività tramite query string `?user=<id>`.
- **Read It Later (`app/pages/Archive.jsx`, `app/services/storage.js`)**: persistenza client-side degli ID articolo via `localStorage`.
- **Dynamic UI (`app/components/StoryCard.jsx`, `app/components/RecordsTable.jsx`)**: rendering dichiarativo dei dati, gestione eventi e stati di loading tramite hook React.

## Setup ed Esecuzione

Requisiti minimi: Node.js, Git, VS Code.

1. Scaricate il codice sorgente da GitHub con il clone di git o tramite CTRL+P → "Git: Clone" in VS Code.
2. Aprite la cartella del progetto in VS Code.
3. Verrà chiesto di installare delle estensioni consigliate: accettate. (se rifiutate basta andare a rimuovere nelle impostazioni di VS Code la voce "ignoreRecommendations").
4. Verrà chiesto di far eseguire dei task automatici: accettate. (se rifiutate basta andare a rimuovere nelle impostazioni di VS Code la voce "ignoreTasks").

A questo punto il server di sviluppo frontend è già pronto e potete aprire il progetto tramite il link indicato nel terminale (tipicamente `http://localhost:5173`).

Se il server si chiude, non parte o qualcosa va storto, chiudete VS Code e riapritelo, oppure aprite un terminale e lanciate manualmente:

```bash
npm install
npm run dev
```

## Esercizi da Svolgere

Gli esercizi totali sono suddivisi in 3 macro-aree di intervento, ognuna con un peso specifico in termini di punteggio finale.
I primi due avranno anche dei commenti `TODO` all'interno del codice per guidarvi nei punti esatti in cui intervenire.
Il terzo esercizio richiede invece un'attività di debugging logico, per cui dovrete esplorare autonomamente i file per trovare e risolvere il problema.

Nel caso può essere utile, usare il numero storia: `48195009` per testare le funzionalità di recupero dati e visualizzazione. Poi per vedere la pagina Autori, cliccare sull'autore `andreww591` così da essere reindirizzati alla pagina `/profile?user=andreww591` e verificare che i dati siano corretti.

### 1. INTEGRAZIONI DATI

**Obiettivo:** Ripristinare il sistema di recupero e visualizzazione delle storie nella pagina principale. Il sito per ora da errore o mostra dati incompleti.

**Task richiesti:**

1. **Data Fetching in [app/services/api.js](app/services/api.js)**\
   Completa la logica della funzione `requestJson` per effettuare una fetch. Questo metodo è il cuore del sito e viene usato da tutte le funzioni di accesso ai dati. Dovrai, dato un url in input, effettuare correttamente la fetch e restituire i dati come oggetto, senza trasformarli o manipolarli.

2. **Data Binding & UI Rendering in [app/components/StoryCard.jsx](app/components/StoryCard.jsx)**\
   Una volta recuperati i dati, completa il componente `StoryCard` per popolare correttamente la card di ogni storia usando i valori già calcolati (title, meta info, link...) in modo che tutte le informazioni richieste siano visualizzate in modo chiaro e ordinato.


### 2. CORREZIONE LAYOUT

**Obiettivo:** Ripristinare la visualizzazione di alcune sezioni del sito che presentano anomalie strutturali ed estetiche.

**Task richiesti:**

1. **Classi mancanti in [app/pages/Radar.jsx](app/pages/Radar.jsx)**\
   Nella barra dei controlli della pagina Radar mancano alcune classi CSS che causano la visione dei componenti non formattati correttamente. Controlla la pagina e la struttura delle altre pagine (es. `Focus.jsx`, `Profile.jsx`) per identificare quali classi sono necessarie e applicale agli elementi corretti.

2. **Stili CSS in [app/App.css](app/App.css)**\
   Completa le regole CSS per gli stati `hover` e `active` dei link di navigazione. Assicurati che i link reagiscano visivamente al passaggio del mouse e quando sono attivi, migliorando l'usabilità e l'estetica del sito.

3. **CSS per la tabella dei record [app/App.css](app/App.css)**\
   Completa le regole CSS per la tabella dei record della pagina Autori, aggiungendo padding alle celle e mettendo a posto le intestazioni e le righe in modo che siano più leggibili e visivamente distinte.
  

### 3. DEBUGGING LOGICO

**Obiettivo:** Individuare e risolvere un'anomalia logica del codice che impedisce il corretto funzionamento di una funzionalità del sito.

**Problema riscontrato:** Nella pagina Radar, quando le storie vengono caricate, appare sempre il pulsante "Salvata" attivo, come se tutte le storie fossero già state salvate nell'archivio. Inoltre se si preme sul tasto "Salvata" il pulsante diventa "Salva" correttamente, ma se si cerca di cliccarci sopra di nuovo, invece di riattivarsi come "Salvata" rimane "Salva".\
Il pulsante dovrebbe comportarsi diversamente: "Salva" permette di salvare la storia nell'archivio se non presente, mentre "Salvata" indica che la storia è già presente nell'archivio e permette di rimuoverla se cliccato.

**Task richiesti:**
1. Individua la causa di questo comportamento anomalo, esplorando il codice della pagina Radar e dei relativi componenti e/o servizi coinvolti.
2. Risolvi il problema in modo che il pulsante "Salva"/"Salvata" si comporti correttamente in base alla presenza o meno della storia nell'archivio, e che cambi stato ogni volta che viene cliccato.
