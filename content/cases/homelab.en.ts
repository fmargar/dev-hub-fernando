import type { CaseStudy } from "../types";

export const homelabEn: CaseStudy = {
  slug: "homelab",
  track: "personal",
  order: 4,
  featured: true,
  title: "Homelab: self-hosted infrastructure",
  tagline:
    "An Ubuntu server running twenty-five containerised services for months on end, and what maintaining them teaches you.",
  client: "Personal project, continuously in production",
  period: "2025 – present",
  year: "2025–",
  role: "Design, operations and maintenance",
  summary:
    "Everything on this domain is served from a machine I administer myself. It is not a toy lab: there are services with real users, incidents at three in the morning, and architecture decisions that cost you when you get them wrong. It is where I actually learned the operations side.",
  stack: [
    "Ubuntu Server",
    "Docker",
    "Docker Compose",
    "Portainer",
    "Nginx",
    "Cloudflare Tunnel",
    "Tailscale",
    "PostgreSQL",
    "MariaDB",
    "ntfy",
  ],
  metrics: [
    { value: "25", label: "containers in production" },
    { value: "17", label: "managed stacks" },
    { value: "0", label: "database ports exposed" },
    { value: "2", label: "independent internet uplinks" },
  ],
  sections: [
    {
      id: "que-hay",
      heading: "What runs on it",
      body: [
        "The server hosts my own applications — this portfolio, a video service and several dashboards — a push notification server, a unified mail inbox and a number of scheduled cron processes.",
        "Everything is containerised and managed through **Portainer on Docker Compose stacks**, versioned in Git. No configuration lives only in someone's head or in a loose file on the server.",
      ],
      figure: {
        key: "homelab-net",
        caption: "Three separate entry paths, each with its own purpose: public, private and isolated.",
      },
    },
    {
      id: "red",
      heading: "Three networks, three purposes",
      bullets: [
        {
          term: "Cloudflare Tunnel for anything public",
          text: "Domains reach the internet through an outbound tunnel. The router opens no inbound ports, and the line's real IP appears in no DNS record.",
        },
        {
          term: "Tailscale for administration",
          text: "Portainer, internal dashboards and SSH are reachable only from the mesh network. None of it is published.",
        },
        {
          term: "An isolated ipvlan network",
          text: "One automation process needs to route through a different uplink than everything else. Rather than solving it with policy routing rules — fragile and easy to break without noticing — I created a Docker **ipvlan** network that places that container directly on the second modem's network segment, with no NAT. The separation is real, at layer 2, and does not depend on a routing table staying correct.",
        },
      ],
    },
    {
      id: "datos",
      heading: "Data is the only thing you cannot rebuild",
      body: [
        "A container comes back in thirty seconds; a corrupted database does not. Two rules follow from that, and I apply them to every stack.",
      ],
      bullets: [
        {
          term: "No database listens on the network",
          text: "PostgreSQL and MariaDB publish their ports on `127.0.0.1` only. Real traffic goes over Docker's internal network between containers; the local bind exists purely for debugging from the host.",
        },
        {
          term: "Isolation between stacks",
          text: "Unrelated services do not share a database, even when sharing one would be cheaper. A stack that falls over cannot take another stack's data with it.",
        },
        {
          term: "Healthchecks on anything stateful",
          text: "With `depends_on: service_healthy`, so an API never starts against a database that is still initialising and fails in a way that is hard to diagnose later.",
        },
      ],
    },
    {
      id: "incidente",
      heading: "One incident that taught me more than any tutorial",
      pullQuote:
        "The dangerous failure is not the one that crashes: it is the one that stays up without doing its job.",
      body: [
        "The most instructive failure I have had was a **silent** one. Two containers running a client against a third-party API showed as `healthy`, connected, with not a single error in the logs. They had simply stopped making progress. Days without completing a single task.",
        "Diagnosis took a while precisely because there was nothing broken to look at. It turned out the remote service had stopped accepting the periodic signal the client sent through a GraphQL mutation: it ignored it without returning an error. The alternative method, a direct POST to a different endpoint, still worked and was in fact already in the source, unused. I confirmed it against the upstream project, where an open issue described the same symptom.",
        "I applied the patch by editing the file inside the containers. And that is where the real lesson came: **the fix lived in the container's writable layer, so it disappeared the moment the image was updated**. Silently, again. The permanent solution was to keep the patched file on the host and mount it read-only from the stack, so it survives any recreation — and to document when that mount has to be removed so it does not mask a future release that already includes the fix.",
      ],
    },
    {
      id: "automatizacion",
      heading: "Automating operations, not just services",
      bullets: [
        {
          term: "Push notifications",
          text: "A self-hosted ntfy server and a script that tails several containers' logs in parallel, detects the events that matter and alerts me. I would rather find out from a notification than from reading logs.",
        },
        {
          term: "On-demand startup",
          text: "One of the heavier services does not run continuously: a proxy listens on its port, detects the first connection and starts it; another process shuts it down after a while with no use. It stops burning CPU during the hours nobody needs it, which is most of them.",
        },
        {
          term: "Configuration changes by script",
          text: "Adding an account to an automation stack is a script that asks for the password on the console without storing it, finds the next free slot, shows the diff, applies only on confirmation, redeploys through the Portainer API and verifies the container came up.",
        },
      ],
    },
    {
      id: "aprendizaje",
      heading: "What I took away",
      body: [
        "That the failures which really cost you are the silent ones. A container that crashes raises an alert; one that stays up without doing its job can go unnoticed for days. Since then, when I build something, I think first about how I will find out it has stopped working.",
        "And that a fix which does not survive a deployment is not a fix. It is a countdown.",
      ],
    },
  ],
  links: [],
  repo: {
    visibility: "private",
    note: "The configuration includes credentials and the network topology of a live machine, so the repository is private.",
  },
};
