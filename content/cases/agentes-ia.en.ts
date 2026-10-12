import type { CaseStudy } from "../types";

export const agentesIaEn: CaseStudy = {
  slug: "agentes-ia",
  track: "personal",
  order: 7,
  featured: true,
  title: "A team of AI agents working in parallel",
  tagline:
    "One agent per project and a supervisor that starts them, watches them and resumes them, on my own server.",
  client: "Own system",
  period: "Jul 2026 – present",
  year: "2026–",
  role: "Design and operations",
  summary:
    "Since July 2026 I have been developing every day by directing AI agents (Claude Code, Codex and Gemini); since October, several at once, each on its own project. The problem is not getting them to write code; it is making sure they do not step on each other, do not lose the thread, do not overspend, and that nothing gets published without review. This is the system that solves it.",
  stack: [
    "Claude Code",
    "Codex",
    "Gemini",
    "Sessions API",
    "Scheduled tasks",
    "systemd",
    "Linux PSI",
    "Git",
  ],
  metrics: [
    { value: "1 + N", label: "a supervisor and one agent per project" },
    { value: "30 %", label: "of context: the handover point" },
    { value: "~5×", label: "lower cost per step after handover" },
    { value: "hourly", label: "automatic supervisor review" },
  ],
  sections: [
    {
      id: "como-funciona",
      heading: "How it works",
      body: [
        "Each project has its worker agent, with its brief in writing. A **supervisor agent** starts them, hands them the work and watches them through an API: status, context usage and last message. When a worker finishes a milestone it tells the supervisor by message; saying so in its own reply is not enough, because nobody reads it there.",
        "The supervisor checks in **every hour through a recurring scheduled task**. It used to be chained reminders: if one failed, the chain broke and nobody resumed. A recurring task does not depend on the previous one having run.",
      ],
    },
    {
      id: "contexto",
      heading: "State lives in files, not in the conversation",
      body: [
        "Every project has a **roadmap versioned in Git**. When a session reaches 30 % of its context, it writes down where it is and what comes next, pushes it, and a new session that only reads that file takes over.",
        "The reason is cost, and it is measured: each step of a 500,000-token session costs about five times as much as one of a 100,000-token session, and the cache lasts an hour. After a long pause you do not resume a large session: you open a new one from the roadmap.",
      ],
      pullQuote: "Context is a budget. You spend it on the work, not on dragging the history along.",
    },
    {
      id: "maquina",
      heading: "Sharing the machine between agents",
      body: [
        "Several agents running builds, test browsers and recordings at once will saturate any server. Heavy jobs go through a **shared queue** and a gate that reads **real CPU and memory pressure (Linux PSI)**, not the load average: I measured a load average of 17 to 23 with only 5 % real CPU pressure, because load also counts disk waits.",
      ],
    },
    {
      id: "revision",
      heading: "Review where mistakes are expensive",
      bullets: [
        {
          term: "Another model reviews",
          text: "Independent reviews are done with a different, more expensive model, reserved for what really matters: a launch, the accuracy of some calculations, a player's experience.",
        },
        {
          term: "Instructions treated as code",
          text: "The rules agents read are versioned, short and layered: what always loads is minimal and the detail lives elsewhere, so no context is wasted on every step.",
        },
        {
          term: "People decide",
          text: "Agents propose and build; publishing, spending money or touching accounts is decided by a person.",
        },
      ],
    },
  ],
  links: [],
  repo: {
    visibility: "private",
    note: "The system runs on my server; a documented public version is in preparation.",
  },
};
