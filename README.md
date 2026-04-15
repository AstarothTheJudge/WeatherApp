# WeatherApp
Panoramica

Questa è una semplice applicazione web sviluppata in JavaScript che consente agli utenti di ottenere informazioni meteo in tempo reale inserendo il nome di una città.

L'app utilizza l'API gratuita di Open-Meteo per:

Convertire il nome della città in coordinate geografiche (latitudine e longitudine)
Recuperare i dati meteo correnti

L'interfaccia è minimale e basata su HTML, mentre la logica è gestita tramite JavaScript e fetch.

Installazione

Non è richiesta alcuna installazione complessa o dipendenze esterne.

Passaggi:
Clona o scarica il progetto
Assicurati di avere questa struttura:
weather-app/
├── index.html
└── WeatherApp.js
Apri il file index.html nel browser

Guida all’uso

Apri l'app nel browser

Inserisci il nome di una città nel campo di input

Clicca su "Cerca"

Visualizza il risultato direttamente nella pagina

Output di esempio
Input:
Milano
Output:
Città: Milano | Temperatura: 22°C | Meteo: Parzialmente nuvoloso
Errori gestiti:
Campo vuoto:
Errore: Inserisci un nome di città valido.
Città non trovata:
Errore: Città non trovata.

Funzionalità
 Ricerca meteo per città
 Conversione città → coordinate (Geocoding API)
 Visualizzazione temperatura attuale
 Descrizione meteo leggibile
 Gestione errori:
 -input non valido
 -città inesistente
 -errori API
 Richieste HTTP con fetch
 Codice semplice e adatto a principianti

Limitazioni attuali
Parsing limitato dei dati (solo temperatura e descrizione base)
Nessuna interfaccia grafica avanzata
Nessun salvataggio persistente dei dati
Logging solo tramite console (non file reale lato browser)

Tecnologie utilizzate
HTML5
JavaScript (ES6+)
Fetch API
Open-Meteo API

Licenza

Progetto open-source per scopi educativi.
