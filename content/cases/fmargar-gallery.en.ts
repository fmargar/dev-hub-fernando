import type { CaseStudy } from "../types";

export const galleryEn: CaseStudy = {
  slug: "fmargar-gallery",
  track: "personal",
  order: 5,
  featured: false,
  title: "Self-hosted video service",
  tagline:
    "A self-hosted video upload and publishing service: it re-encodes, pushes to YouTube, and knows when to stop before the disk fills up.",
  client: "Personal project",
  period: "2026",
  year: "2026",
  role: "Design and full implementation",
  summary:
    "An application to upload, organise and publish video, with automatic delivery to YouTube. The interesting part is not the CRUD: it is everything around it that stops a service handling large files from destroying itself when it runs out of space.",
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
    { value: "3", label: "containerised services with healthchecks" },
    { value: "4", label: "notification channels" },
    { value: "2 TB", label: "of dedicated storage" },
  ],
  sections: [
    {
      id: "contexto",
      heading: "Context",
      body: [
        "I wanted somewhere of my own to keep and publish video without depending entirely on third-party services, while keeping the convenience of having it reachable outside too. The application is three containers: a Node/Express API, a MariaDB database and a React frontend served by Nginx.",
        "Authentication is JWT-based, with per-user access control over the catalogue.",
      ],
    },
    {
      id: "pipeline",
      heading: "The upload pipeline",
      body: [
        "When a video arrives, the API does more than store it: it re-encodes with FFmpeg if the file is above a size threshold, uploads to YouTube via OAuth with a refresh token, and decides what to do with the original based on configuration.",
      ],
      figure: {
        key: "gallery-pipeline",
        caption: "Every step can be switched off by environment variable; the defaults are duplicated in the compose file on purpose.",
      },
      bullets: [
        {
          term: "Re-encoding with capped threads",
          text: "Transcoding uses a fixed, low thread count. The server shares CPU with other services, and an unbounded FFmpeg eats the whole machine and degrades everything else.",
        },
        {
          term: "Minimum threshold",
          text: "Below a certain size nothing is re-encoded. The saving does not justify the CPU cost or the quality loss.",
        },
      ],
    },
    {
      id: "guardarrailes",
      heading: "Guardrails: the part that prevents disasters",
      pullQuote:
        "Uploading a video is twenty lines. Making sure uploading a video cannot take down the database is several evenings.",
      body: [
        "A service writing hundreds of megabytes at a time needs to be able to say no. These are the brakes I gave it, and all three come from a real problem.",
      ],
      bullets: [
        {
          term: "Video does not live on the system disk",
          text: "They sit on a dedicated 2 TB disk mounted with `nofail`. They used to share the root filesystem with the operating system and MariaDB: if uploads filled the disk, the database could drop to read-only. Now, in the worst case, uploads fail and the gallery stays up.",
        },
        {
          term: "A marker file that aborts startup",
          text: "The container looks for a marker file that only exists inside the data disk. If it is missing — because the disk did not mount — the `entrypoint` aborts instead of starting. Without that check, Docker would create an empty directory at the mount point and the service would quietly start writing to the system disk. Same pattern again: the dangerous failure is the one that raises no error.",
        },
        {
          term: "Free-space thresholds",
          text: "A floor below which uploads are rejected, and a warning threshold that fires a notification before reaching it.",
        },
      ],
    },
    {
      id: "notificaciones",
      heading: "Notifications",
      body: [
        "The service notifies through four channels depending on the event: **web push** with VAPID for the browser, **ntfy** for mobile, a **Discord webhook** and SMTP email. All of them are optional through environment variables, so the service starts fine in a development environment where none are configured.",
      ],
    },
    {
      id: "aprendizaje",
      heading: "What I took away",
      body: [
        "That the real work in a service handling files is in the unhappy paths. Uploading a video is twenty lines; making sure uploading a video cannot take down the database is several evenings and one prior incident.",
        "I also learned to duplicate default values in the compose file rather than leaving them only in code: if a variable is not declared there, Portainer never passes it to the container and the setting silently stops having any effect.",
      ],
    },
  ],
  links: [],
  repo: {
    visibility: "private",
    note: "Private repository: the configuration includes YouTube API and notification credentials.",
  },
};
