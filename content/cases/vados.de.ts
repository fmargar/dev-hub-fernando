import type { CaseStudy } from "../types";

export const vadosDe: CaseStudy = {
  slug: "sistema-vados-marbella",
  track: "professional",
  order: 1,
  featured: true,
  title: "Verwaltungssystem für Einfahrtsgenehmigungen",
  tagline:
    "Die Akten zu Einfahrtsgenehmigungen aus vier Stadtbezirken von Marbella in einer einzigen Datenbank zusammenführen.",
  client: "Stadtverwaltung Marbella",
  period: "Feb – Mai 2026",
  year: "2026",
  role: "Full-Stack-Entwickler (Praktikum), im Zweierteam",
  summary:
    "Die Stadtverwaltung führte ihre Akten zu Einfahrtsgenehmigungen in Altdateien aus zwei verschiedenen Systemen, in Formaten und Kodierungen, die niemand mehr pflegte. Wir haben die Anwendung gebaut, die sie zusammenführt: Importer, die die historischen Daten normalisieren, die Anmeldung gegen das Active Directory der Stadtverwaltung, eine nach Bezirken abgegrenzte Zugriffskontrolle, eine automatische Protokollierung jeder Änderung und eine Karte mit den verorteten Genehmigungen.",
  stack: [
    "Laravel 12",
    "PHP 8.2",
    "React 18",
    "Inertia.js",
    "PostgreSQL",
    "Eloquent ORM",
    "Leaflet",
    "Tailwind CSS",
    "Vite 7",
    "Active Directory",
  ],
  metrics: [
    { value: "4", label: "zusammengeführte Stadtbezirke" },
    { value: "2", label: "importierte Altformate" },
    { value: "5", label: "Rollen mit räumlicher Abgrenzung" },
    { value: "20", label: "Schema-Migrationen" },
  ],
  sections: [
    {
      id: "contexto",
      heading: "Ausgangslage",
      body: [
        "Das Gemeindegebiet von Marbella wird in vier Bezirken verwaltet — Marbella Zentrum, San Pedro de Alcántara, Nueva Andalucía und Las Chapas — und jeder führte seine eigenen Akten mit eigenem Fachpersonal.",
        "Die Aufgabe bestand nicht darin, ein CRUD zu bauen. Das Problem war, dass die Ausgangsdaten aus **zwei Altsystemen stammten, die nicht miteinander sprachen**: Die Akten aus Marbella lagen als TSV-Datei vor, die aus San Pedro als dBASE-Abzug mit fester Feldbreite, beide in IBM850 kodiert. Niemand konnte Daten bezirksübergreifend abgleichen, feststellen, ob eine Genehmigung noch gültig war, oder nachvollziehen, wer eine Akte zuletzt bearbeitet hatte.",
      ],
    },
    {
      id: "reto",
      heading: "Die Herausforderung",
      body: ["Drei Vorgaben haben den gesamten Entwurf geprägt:"],
      bullets: [
        {
          term: "Nichts wird gelöscht",
          text: "In der öffentlichen Verwaltung hat eine Akte dokumentarischen Wert. Eine Genehmigung außer Kraft zu setzen ist ein Verwaltungsakt, keine gelöschte Zeile.",
        },
        {
          term: "Jede Fachkraft schreibt nur im eigenen Bezirk",
          text: "Muss aber die anderen einsehen können: Eine Genehmigung in Nueva Andalucía kann eine Straße in Marbella Zentrum betreffen.",
        },
        {
          term: "Lückenlose Nachvollziehbarkeit",
          text: "Das System muss beantworten, wer was wann und von welchem Rechner aus geändert hat — ohne darauf zu bauen, dass jemand daran denkt, es zu protokollieren.",
        },
      ],
    },
    {
      id: "arquitectura",
      heading: "Architektur",
      body: [
        "Wir haben uns für **Laravel 12 mit Inertia.js** entschieden statt für eine REST-API mit getrennter SPA. Für eine Intranet-Anwendung mit einem einzigen Client hätte eine eigenständige API nur zusätzliche Arbeit bedeutet, ohne sich zu rechnen: Mit Inertia schreibt man gewöhnliche Laravel-Controller, die React-Komponenten zurückgeben — mit SPA-Navigation und ohne die Validierung im Client zu duplizieren.",
        "Die Persistenz übernimmt PostgreSQL über Eloquent. Das Frontend besteht aus React-18-Komponenten, ausgeliefert von Vite, mit Tailwind und Headless UI.",
      ],
      figure: {
        key: "vados-flow",
        caption: "Ablauf einer Anfrage: Autorisierung und Protokollierung laufen automatisch, nicht über den Controller.",
      },
    },
    {
      id: "decisiones",
      heading: "Technische Entscheidungen",
      pullQuote:
        "Eine Regel, die in einem Button steckt, ist verloren, sobald jemand eine neue Maske ergänzt. Eine Regel in der Policy nicht.",
      body: [
        "Drei Entscheidungen tragen fast den gesamten Wert des Projekts, und alle drei verlagern eine Geschäftsregel dorthin, wo man sie nicht vergessen kann.",
      ],
      bullets: [
        {
          term: "Das Löschen wird im Code blockiert, nicht in der Oberfläche",
          text: "`VadoPolicy::delete()` liefert immer `false`. Es gibt weder eine Route noch einen Button zum Löschen. Eine Genehmigung außer Kraft zu setzen heißt, ein `fecha_baja` zu setzen; der Status aktiv/inaktiv wird aus diesem Feld berechnet. Den Button auszublenden hätte für eine Demo gereicht; die Sperre in der Policy sorgt dafür, dass die Regel noch gilt, wenn in zwei Jahren jemand eine neue Maske ergänzt.",
        },
        {
          term: "Die räumliche Filterung ist ein Global Scope, kein `where` in jeder Abfrage",
          text: "`TerritorioScope` hängt am Modell und filtert in jeder Abfrage der Sitzung nach dem Bezirk des angemeldeten Benutzers. In der Konsole ist er abgeschaltet, weil Importer und Seeder bezirksübergreifend schreiben müssen. Läge der Filter in jedem Controller, würde ein einziges Vergessen Daten eines anderen Bezirks preisgeben.",
        },
        {
          term: "Die Protokollierung ist ein Observer, kein expliziter Aufruf",
          text: "`VadoObserver` erfasst Anlage, Änderung und Außerkraftsetzung, ohne dass der Controller etwas tut. Gespeichert werden Benutzer, Ausweisnummer, der Rechnername, von dem die Änderung kam (per PTR aufgelöst), und ein JSON mit den Werten `old` und `new`. Niemand kann die Protokollierung umgehen, indem er über einen anderen Weg schreibt.",
        },
      ],
    },
    {
      id: "roles",
      heading: "Berechtigungen: global lesen, lokal schreiben",
      body: [
        "Das System kennt fünf Rollen: einen Superadministrator und je einen Administrator pro Bezirk. Interessant ist die Asymmetrie: **alle dürfen alles lesen, aber jeder schreibt nur im eigenen Bezirk**.",
        "Damit ist der reale Fall gelöst — eine Fachkraft muss die Genehmigung in der Nachbarstraße nachschlagen können, auch wenn diese zu einem anderen Bezirk gehört — ohne dass sie sie ändern kann. Der Bezirk eines neuen Benutzers wird nicht von Hand gewählt: Er ergibt sich über eine Zuordnung im Modell `User` aus seiner Rolle und kann so nicht inkonsistent werden.",
      ],
      figure: {
        key: "vados-roles",
        caption: "Berechtigungsmatrix: Die räumliche Einschränkung gilt nur für Schreibzugriffe.",
      },
    },
    {
      id: "importacion",
      heading: "Drei Jahrzehnte digitalisierter Akten importieren",
      body: [
        "Der aufwendigste Teil war die Übernahme der Altbestände. Zwei getrennte Konsolenbefehle, weil die Dateien nichts gemeinsam haben.",
      ],
      bullets: [
        {
          term: "Marbella (TSV, IBM850)",
          text: "Zeilenweises Einlesen, Umwandlung jedes Feldes von IBM850 nach UTF-8 und Bereinigung von Zeichen, die aus älteren Systemen stammten (`¥` statt `Ñ`, `§` statt `º`).",
        },
        {
          term: "San Pedro (dBASE mit fester Feldbreite)",
          text: "Auslesen über exakte Byte-Positionen — `NUMERO(7)`, `NOMBRE(37)`, `DNI(8)`, `DOMICILIO(41)` —, Zusammenführen von fünf getrennten Bemerkungsspalten und Bereinigung unbrauchbarer Datumsangaben aus dem Originalabzug (Muster wie `03/01/-1`).",
        },
        {
          term: "Gespiegelte Adressspalte",
          text: "Die Adressen waren uneinheitlich abgekürzt. Der Importer erzeugt eine normalisierte Fassung, indem er Abkürzungen ausschreibt (`C/` → `CALLE`, `AVDA.` → `AVENIDA`), und behält das Original. Die Adresssuche hängt damit nicht mehr davon ab, wie ein bestimmter Sachbearbeiter sie getippt hat.",
        },
        {
          term: "Eine Genehmigung, mehrere Inhaber",
          text: "Vor dem Anlegen prüft der Importer über `Plakettennummer + Bezirk + Standort`, ob die Genehmigung bereits existiert. Wenn ja, verwendet er die vorhandene Kennung weiter und hängt den Inhaber an den bestehenden Datensatz. Aus der Eigentümerhistorie wird so eine 1:N-Beziehung statt doppelter Zeilen.",
        },
      ],
    },
    {
      id: "mapa",
      heading: "Verortung",
      body: [
        "Die Karte nutzt Leaflet mit react-leaflet und zeigt alle Genehmigungen, zu denen Koordinaten vorliegen. Die Adressvervollständigung spricht mit **CartoCiudad**, dem öffentlichen Geokodierungsdienst der spanischen Regierung: Die Fachkraft tippt eine Adresse, wählt einen Vorschlag, und die Koordinaten füllen sich von selbst. Die Position lässt sich zusätzlich durch Klicken auf der Karte feinjustieren.",
      ],
    },
    {
      id: "autenticacion",
      heading: "Anmeldung gegen das Active Directory",
      body: [
        "Der Zugang wurde gegen das **Active Directory der Stadtverwaltung** gelöst: Die Mitarbeitenden melden sich mit ihrer Ausweisnummer und ihrem Passwort aus dem städtischen Intranet an, ohne eigene Zugangsdaten im Genehmigungssystem.",
        "Das vermeidet das Problem zweier Passwörter pro Person. Das An- und Abmelden von Personal bleibt dort, wo es ohnehin verwaltet wurde, und die Anwendung speichert keine Passwörter, die gegenüber dem Intranet veralten können.",
        "Ab da übernimmt die Rolle: Sie bestimmt den Bezirk des Benutzers, `TerritorioScope` filtert jede Abfrage, und das Protokoll hält die Ausweisnummer und den Rechner fest, von dem jede Änderung kam.",
      ],
    },
    {
      id: "resultado",
      heading: "Ergebnis",
      body: [
        "Zum Ende des Praktikums deckte das System den vollständigen Ablauf ab: Import der Altbestände aus beiden Bezirken mit Daten, Anlegen und Bearbeiten von Genehmigungen unter räumlicher Kontrolle, Detailansicht, Eigentümerhistorie, verortete Karte, Benutzerverwaltung und Einsicht in das Änderungsprotokoll.",
        "Dazu haben wir eine technische Dokumentation mit 23 Abschnitten geliefert: Datenmodell, Installationsanleitung und vorgeschlagene Kennzahlen für den laufenden Betrieb.",
      ],
    },
  ],
  links: [],
  repo: {
    visibility: "private",
    note: "Für die Stadtverwaltung Marbella entwickelt; das Repository ist nicht öffentlich.",
  },
};
