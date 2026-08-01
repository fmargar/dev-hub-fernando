import type { CaseStudy } from "../types";

export const galleryDe: CaseStudy = {
  slug: "fmargar-gallery",
  order: 4,
  featured: false,
  title: "fmargar-gallery",
  tagline:
    "Eine private Clip-Galerie, die selbstständig neu kodiert und zu YouTube hochlädt — mit Schutzgeländern, damit die Platte nie volläuft.",
  client: "Privatprojekt",
  period: "2026",
  year: "2026",
  role: "Entwurf und vollständige Umsetzung",
  summary:
    "Eine Anwendung zum Hochladen, Ordnen und Teilen von Videoclips, mit automatischer Veröffentlichung auf YouTube. Das Interessante ist nicht das CRUD, sondern alles drumherum, das verhindert, dass sich ein Dienst mit großen Dateien selbst zerlegt, wenn der Platz ausgeht.",
  stack: [
    "Node.js",
    "Express",
    "React",
    "MariaDB",
    "JWT",
    "FFmpeg",
    "YouTube Data API",
    "Web Push (VAPID)",
    "Docker",
    "Nginx",
  ],
  metrics: [
    { value: "3", label: "containerisierte Dienste mit Healthcheck" },
    { value: "4", label: "Benachrichtigungskanäle" },
    { value: "2 TB", label: "dedizierter Speicher" },
  ],
  sections: [
    {
      id: "contexto",
      heading: "Ausgangslage",
      body: [
        "Ich wollte einen eigenen Ort, um Clips zu sichern und zu teilen, ohne von fremden Diensten abzuhängen — aber mit dem Komfort, sie zugleich veröffentlicht zu haben. Die Anwendung besteht aus drei Containern: einer API in Node mit Express, einer MariaDB-Datenbank und einem React-Frontend, ausgeliefert von Nginx.",
        "Die Authentifizierung läuft über JWT, und der Katalog wird über die RAWG-API mit Spiel-Metadaten angereichert.",
      ],
    },
    {
      id: "pipeline",
      heading: "Die Upload-Pipeline",
      body: [
        "Trifft ein Clip ein, speichert die API ihn nicht einfach ab: Sie kodiert ihn mit FFmpeg neu, sofern er eine Mindestgröße überschreitet, lädt ihn per OAuth mit Refresh-Token zu YouTube hoch und entscheidet anhand der Konfiguration, was mit dem Original geschieht.",
      ],
      figure: {
        key: "gallery-pipeline",
        caption: "Jeder Schritt lässt sich per Umgebungsvariable abschalten; die Standardwerte stehen bewusst doppelt in der Compose-Datei.",
      },
      bullets: [
        {
          term: "Neukodierung mit begrenzten Threads",
          text: "Das Transkodieren nutzt eine feste, niedrige Anzahl Threads. Der Server teilt sich die CPU mit anderen Diensten, und ein unbegrenztes FFmpeg frisst die ganze Maschine und macht alles andere langsam.",
        },
        {
          term: "Mindestgröße",
          text: "Unterhalb einer bestimmten Größe wird nichts neu kodiert. Die Ersparnis rechtfertigt weder den CPU-Aufwand noch den Qualitätsverlust.",
        },
      ],
    },
    {
      id: "guardarrailes",
      heading: "Schutzgeländer: der Teil, der Katastrophen verhindert",
      body: [
        "Ein Dienst, der hunderte Megabyte am Stück schreibt, muss nein sagen können. Das sind die Bremsen, die ich eingebaut habe — alle drei stammen aus einem realen Problem.",
      ],
      bullets: [
        {
          term: "Die Clips liegen nicht auf der Systemplatte",
          text: "Sie liegen auf einer eigenen 2-TB-Platte, eingehängt mit `nofail`. Früher teilten sie sich das Wurzeldateisystem mit dem Betriebssystem und MariaDB: Füllten Uploads die Platte, konnte die Datenbank auf Nur-Lesen umschalten. Jetzt schlagen im schlimmsten Fall die Uploads fehl und die Galerie bleibt stehen.",
        },
        {
          term: "Eine Markierungsdatei, die den Start abbricht",
          text: "Der Container sucht eine Markierungsdatei, die es nur innerhalb der Datenplatte gibt. Fehlt sie — weil die Platte nicht eingehängt wurde — bricht der `entrypoint` ab, statt zu starten. Ohne diese Prüfung würde Docker ein leeres Verzeichnis am Einhängepunkt anlegen und der Dienst still auf die Systemplatte schreiben. Wieder dasselbe Muster: Der gefährliche Fehler ist der, der keinen Fehler meldet.",
        },
        {
          term: "Schwellenwerte für freien Speicher",
          text: "Eine Untergrenze, ab der Uploads abgelehnt werden, und eine Warnschwelle, die vorher eine Benachrichtigung auslöst.",
        },
      ],
    },
    {
      id: "notificaciones",
      heading: "Benachrichtigungen",
      body: [
        "Je nach Ereignis meldet sich der Dienst über vier Wege: **Web Push** mit VAPID für den Browser, **ntfy** fürs Handy, einen **Discord-Webhook** und E-Mail über SMTP. Alle sind über Umgebungsvariablen optional, sodass der Dienst auch in einer Entwicklungsumgebung startet, in der keiner davon eingerichtet ist.",
      ],
    },
    {
      id: "aprendizaje",
      heading: "Was ich mitnehme",
      body: [
        "Dass die eigentliche Arbeit bei einem Dienst mit Dateien in den Pfaden steckt, die nicht der glückliche Fall sind. Ein Video hochzuladen sind zwanzig Zeilen; dafür zu sorgen, dass das Hochladen eines Videos die Datenbank nicht umwerfen kann, sind mehrere Abende und ein vorangegangener Zwischenfall.",
        "Außerdem habe ich gelernt, Standardwerte in der Compose-Datei zu wiederholen, statt sie nur im Code zu lassen: Ist eine Variable dort nicht deklariert, reicht Portainer sie nicht an den Container weiter, und die Einstellung wirkt still nicht mehr.",
      ],
    },
  ],
  links: [],
  repo: {
    visibility: "private",
    note: "Privates Repository: Die Konfiguration enthält Zugangsdaten für die YouTube-API und die Benachrichtigungen.",
  },
};
