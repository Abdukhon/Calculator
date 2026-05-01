# Taschenrechner mit Verlauf

Ein interaktives Taschenrechner, entwickelt mit JavaScript, HTML und CSS. Das Projekt ist eine Übungsprojekt und zeigt meine grundlegende Frontend Kenntnisse und saubere Code

## Funktionen

- Grundrechenarten: Addition, Subtraktion, Multiplikation und Division
- Live-Ergebniss auf einem zweiten Display (Vorschau während der Eingabe)
- Rechenkette (Mehrfachoperationen nacheinander)
- Verlauf (Historie) nit Speicherung im 'localStorage'
- Automatische Sortierung und Anzeige der letzten 10 Berechnungen
- Fehlerbehandlung: Division durch null, mehrere Dezimalpunkte
- Buttons: `C` (Löschen), `DEL` (Backspace), `%` (Prozent), `=` (Speichern der Rechnung)
- Visueller Effekt: Nach Druck auf `=` wird das obere Display halbtransparent, das untere wird voll sichtbar
- Sichere Berechnung über `switch`-Logik

## Verwendete Technologien

- HTML5 – semantische Struktur, Data-Attribute
- CSS3 – Grid-Layout, Transparenz-Übergänge, einfaches Styling
- JavaScript (ES6+) – DOM-Manipulation, Event-Handling, Array-Methoden, `localStorage`
- Kein Framework – bewusst Vanilla JS, um Grundprinzipien zu beherrschen

## Projektstruktur

taschenrechner/
├── index.html # Struktur der Taschenrechner-Benutzeroberfläche
├── css/
│ └── style.css # Styling für Displays, Buttons und Verlauf
├── js/
│ └── script.js # Gesamte Anwendungslogik
└── README.md # Dokumentation

## Starten der Anwendung

1. Repository klonen oder als ZIP herunterladen.
2. Datei `index.html` in einem beliebigen modernen Browser öffnen.
3. Es sind keine weiteren Abhängigkeiten, Server oder Build-Tools erforderlich.

## Was ich dabei gelernt habe (wichtig für die Ausbildung)

- Trennung der Anliegen: State-Verwaltung, Rendering und Event-Handling sind klar getrennt.
- Aufbau einer Single-Page-Anwendung ohne Frameworks.
- Arbeiten mit `localStorage` zur persistenten Datenspeicherung.
- Umgang mit Arrays (Tokenisierung der Rechenausdrücke) und Datumsobjekten.
- Erstellung einer sauberen, nachvollziehbaren Dokumentation.

## Mögliche Erweiterungen

- Unterstützung von Klammern und mathematischem Parser (Shunting-Yard-Algorithmus)
- Dark Mode mit CSS-Variablen
- Unit-Tests für die Berechnungslogik (z. B. mit Jest)
- Optional: Anbindung an ein Backend (Django REST Framework) zur Speicherung der Historie

---
*Erstellt von Abdumukhtor Yodgorov als Teil der Bewerbung / Ausbildung.*
