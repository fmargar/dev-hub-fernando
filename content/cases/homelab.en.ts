import type { CaseStudy } from "../types";

export const homelabEn: CaseStudy = {
  slug: "homelab",
  track: "personal",
  order: 9,
  featured: true,
  title: "Own infrastructure and task orchestrator",
  tagline:
    "A Linux server with over a hundred containers that I run on my own, and the orchestrator that replaced 28 scattered timers.",
  client: "Own server, in continuous production",
  period: "2025 – present",
  year: "2025–",
  role: "Design, operations and maintenance",
  summary:
    "Everything I build is served from a machine I run myself: this portfolio, Adivinadle and the AI agents working in parallel. It is not a toy lab: there are services with real users, late-night incidents and architecture decisions that cost you when you get them wrong.",
  stack: [
    "Linux",
    "Docker",
    "Node.js",
    "PostgreSQL",
    "systemd",
    "Cloudflare Tunnel and Access",
    "Tailscale",
    "Vector",
    "restic",
  ],
  metrics: [
    { value: "100+", label: "containers running", liveKey: "containers" },
    { value: "28 → 1", label: "timers replaced by one orchestrator" },
    { value: "0", label: "database ports exposed", liveKey: "dbPortsExposed" },
    { value: "3", label: "backup layers, one encrypted off-site" },
  ],
  sections: [
    {
      id: "orquestador",
      heading: "One orchestrator instead of 28 clocks",
      body: [
        "Scheduled jobs were scattered all over the server: crons inside a backend, intervals in services, `crontab` entries and a cron inside a container. Twenty-eight clocks that never talked to each other. Stop one piece for maintenance and the rest kept acting on their own.",
        "I replaced them with **my own orchestrator in Node.js and PostgreSQL** with a single clock. Each task declares in a catalogue **the resources it needs** and only runs if they are free: mutual exclusion by resource, not by schedule. A global key switches everything to running, paused or maintenance.",
      ],
      bullets: [
        {
          term: "State that survives restarts",
          text: "Busy resources are the runs with no end time in the database. If the orchestrator restarts it neither loses track nor repeats anything; whatever was half done is marked as interrupted.",
        },
        {
          term: "A resource is not released until the task has really finished",
          text: "When a hung task is cut off, cancellation is a request, not a guarantee. Releasing its resource before it dies could put two processes on the same thing at once.",
        },
        {
          term: "What stays out, on purpose",
          text: "Backups do not depend on the orchestrator, and an external watchdog alerts if it goes down: if the orchestrator fails, nothing else could raise the alarm.",
        },
      ],
      pullQuote: "We were not switching the car off: we were stopping the parts one by one.",
    },
    {
      id: "red",
      heading: "Network and access",
      bullets: [
        {
          term: "Cloudflare Tunnel for public services",
          text: "Domains reach the internet through an outbound tunnel: the router does not open a single inbound port. Private services also sit behind Cloudflare Access.",
        },
        {
          term: "Tailscale for administration",
          text: "Internal dashboards and SSH are only reachable from the private network. None of it is published.",
        },
        {
          term: "Layer 2 segmentation",
          text: "Services that must leave through a different connection live on their own Docker ipvlan network, separated at layer 2 instead of relying on fragile routing rules.",
        },
      ],
    },
    {
      id: "datos",
      heading: "Data is the only thing you cannot rebuild",
      bullets: [
        {
          term: "No database listens on the network",
          text: "PostgreSQL and MariaDB only publish on `127.0.0.1`; real traffic goes over Docker's internal network.",
        },
        {
          term: "Three layers of backups",
          text: "Daily local backup, a copy of what is critical and an encrypted off-site copy with restic. Secrets encrypted with the key kept outside the database.",
        },
        {
          term: "Centralised logs",
          text: "Vector streams service logs to disk with a year of retention: they survive container rebuilds, and an incident from days ago is investigated with `grep`.",
        },
      ],
    },
    {
      id: "aprendizaje",
      heading: "What I take away",
      body: [
        "That the failures that really cost you are the silent ones. Once, a hung-task alert **did fire**, but the alert service rejected it because of a type it did not accept, and nobody noticed for days. An alert that can be lost silently is not an alert. Since then, the first thing I think about when I build something is how I will find out it has stopped working.",
        "And that a fix that does not survive a deployment is not a fix: it is a countdown. Everything lives as code, versioned in Git.",
      ],
    },
  ],
  links: [],
  repo: {
    visibility: "private",
    note: "The configuration includes credentials and the topology of a production machine, so the repository is private.",
  },
};
