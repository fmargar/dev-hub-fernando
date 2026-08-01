import type { CaseStudy } from "../types";

export const vadosEn: CaseStudy = {
  slug: "sistema-vados-marbella",
  track: "professional",
  order: 1,
  featured: true,
  title: "Municipal driveway permit system",
  tagline:
    "Consolidating driveway permit records from four districts of Marbella into a single database.",
  client: "Marbella City Council",
  period: "Feb – May 2026",
  year: "2026",
  role: "Full stack developer (internship), in a pair",
  summary:
    "The city council kept its driveway permit records in legacy files from two different systems, in encodings and formats nobody maintained any more. We built the application that consolidates them: importers that normalise the historical data, district-scoped access control, automatic audit logging of every change, and a map of geolocated permits.",
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
  ],
  metrics: [
    { value: "4", label: "districts consolidated" },
    { value: "2", label: "legacy formats imported" },
    { value: "5", label: "territorially scoped roles" },
    { value: "20", label: "schema migrations" },
  ],
  sections: [
    {
      id: "contexto",
      heading: "Context",
      body: [
        "Marbella is administered as four districts — Marbella centre, San Pedro de Alcántara, Nueva Andalucía and Las Chapas — and each one kept its own driveway permit records, with its own assigned technical staff.",
        "The problem was not building a CRUD app. It was that the source data came from **two legacy systems that did not talk to each other**: Marbella's records lived in a TSV file and San Pedro's in a fixed-width dBASE dump, both encoded in IBM850. Nobody could cross-reference districts, or tell whether a permit was still active, or who had last touched a record.",
      ],
    },
    {
      id: "reto",
      heading: "The challenge",
      body: ["Three constraints shaped every design decision:"],
      bullets: [
        {
          term: "Nothing gets deleted",
          text: "In public administration a record has documentary value. Withdrawing a permit is an administrative act, not a deleted row.",
        },
        {
          term: "Each officer writes only within their district",
          text: "But they need to read the others: a permit in Nueva Andalucía can affect a street in Marbella centre.",
        },
        {
          term: "Full traceability",
          text: "The system must answer who changed what, when and from which machine — without relying on anyone remembering to log it.",
        },
      ],
    },
    {
      id: "arquitectura",
      heading: "Architecture",
      body: [
        "We chose **Laravel 12 with Inertia.js** over a REST API plus a separate SPA. For an intranet application with a single client, building and versioning a standalone API added work without paying for itself: Inertia lets you write ordinary Laravel controllers that return React components, with SPA navigation and without duplicating validation on the client.",
        "Persistence is PostgreSQL through Eloquent. The frontend is React 18 served by Vite, with Tailwind and Headless UI.",
      ],
      figure: {
        key: "vados-flow",
        caption: "Request path: authorisation and audit logging are automatic, not the controller's responsibility.",
      },
    },
    {
      id: "decisiones",
      heading: "Technical decisions",
      pullQuote:
        "A rule that lives in a button is lost the moment someone adds a new screen. One that lives in the policy is not.",
      body: [
        "Three decisions carry most of the project's value, and all three move a business rule somewhere it cannot be forgotten.",
      ],
      bullets: [
        {
          term: "Deletion is blocked in code, not in the UI",
          text: "`VadoPolicy::delete()` always returns `false`. There is no delete route and no delete button. Withdrawing a permit means setting a `fecha_baja`, and active/inactive status is derived from that field. Hiding the button would have been enough for a demo; blocking it in the policy is what keeps the rule alive when someone adds a new screen two years from now.",
        },
        {
          term: "District filtering is a Global Scope, not a `where` in every query",
          text: "`TerritorioScope` is attached to the model and filters by the signed-in user's district across every query in the session. It is disabled on the console, because importers and seeders need to write across all districts. If the filter lived in each controller, forgetting it once would leak another district's data.",
        },
        {
          term: "Auditing is an Observer, not an explicit call",
          text: "`VadoObserver` records creation, update and administrative withdrawal without the controller doing anything. It stores the user, their ID number, the hostname the change came from (resolved by PTR) and a JSON payload with `old` and `new` values. Nobody can bypass logging by writing through another path.",
        },
      ],
    },
    {
      id: "roles",
      heading: "Permissions: read globally, write locally",
      body: [
        "The system has five roles: a super-administrator and one administrator per district. The asymmetry is the interesting part: **everyone can read everything, but each person only writes within their own district**.",
        "That solves the real-world case — an officer needs to look up the permit on the next street even if it belongs to another district — without letting them modify it. A new user's district is not picked by hand: it is derived from their role through a mapping on the `User` model, so it cannot end up inconsistent.",
      ],
      figure: {
        key: "vados-roles",
        caption: "Permission matrix: the territorial restriction applies to writes only.",
      },
    },
    {
      id: "importacion",
      heading: "Importing three decades of digitised paperwork",
      body: [
        "The most laborious part was migrating the historical records. Two separate console commands, because the files have nothing in common.",
      ],
      bullets: [
        {
          term: "Marbella (TSV, IBM850)",
          text: "Line-by-line reading, per-field conversion from IBM850 to UTF-8, and cleanup of characters inherited from older systems (`¥` for `Ñ`, `§` for `º`).",
        },
        {
          term: "San Pedro (fixed-width dBASE)",
          text: "Extraction by exact byte offsets — `NUMERO(7)`, `NOMBRE(37)`, `DNI(8)`, `DOMICILIO(41)` — concatenation of five separate remarks columns, and cleanup of garbage dates from the original dump (patterns like `03/01/-1`).",
        },
        {
          term: "Mirrored address column",
          text: "Addresses were abbreviated inconsistently. The importer generates a normalised version by expanding abbreviations (`C/` → `CALLE`, `AVDA.` → `AVENIDA`) while keeping the original. Searching by address no longer depends on how a particular clerk typed it.",
        },
        {
          term: "One physical permit, many holders",
          text: "Before creating a record, the importer checks whether the permit already exists by `plate number + district + location`. If it does, it reuses the identifier and attaches the holder to the existing permit. Ownership history becomes a 1:N relationship instead of duplicated rows.",
        },
      ],
    },
    {
      id: "mapa",
      heading: "Geolocation",
      body: [
        "The map uses Leaflet with react-leaflet and plots every permit that has coordinates. Address autocomplete talks to **CartoCiudad**, the Spanish government's public geocoding service: the officer types an address, picks a suggestion, and the coordinates fill themselves in. The position can also be fine-tuned by clicking directly on the map.",
      ],
    },
    {
      id: "resultado",
      heading: "Outcome",
      body: [
        "By the end of the internship the system covered the full cycle: importing historical records from both districts that had data, creating and editing permits under territorial control, detail views, ownership history, the geolocated map, user management and the audit log.",
        "We also delivered a 23-section technical report covering the data model, the deployment manual and suggested operational indicators.",
      ],
    },
    {
      id: "pendiente",
      heading: "What was left open",
      callout: {
        tone: "warning",
        text: "I would rather describe it this way than claim the system \"integrates with LDAP\", because that is not what we built.",
      },
      body: [
        "Authentication works against the local users table and is validated with test accounts. **Validation against the city council's active directory was left pending**: we were never given real intranet accounts during the internship.",
        "The report documents both go-live paths: creating employee accounts inside the application, which needs no code changes, or integrating LDAP/Active Directory for single sign-on, which does. For the second one we identified the files to change, the package to install, and estimated two to four days of work.",
        "I would rather describe it this way than claim the system \"integrates with LDAP\", because that is not what we built.",
      ],
    },
  ],
  links: [],
  repo: {
    visibility: "private",
    note: "Built for Marbella City Council; the repository is not public.",
  },
};
