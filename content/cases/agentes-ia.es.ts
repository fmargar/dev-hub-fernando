import type { CaseStudy } from "../types";

export const agentesIaEs: CaseStudy = {
  slug: "agentes-ia",
  track: "personal",
  order: 7,
  featured: true,
  title: "Equipo de agentes de IA en paralelo",
  tagline:
    "Un agente por proyecto y un supervisor que los arranca, los vigila y los reanuda, sobre mi propio servidor.",
  client: "Sistema propio",
  period: "Jul 2026 – actualidad",
  year: "2026–",
  role: "Diseño y operación",
  summary:
    "Desde julio de 2026 desarrollo a diario dirigiendo agentes de IA (Claude Code, Codex y Gemini); desde octubre, varios a la vez, cada uno en su proyecto. El problema no es que escriban código, sino que no se pisen, no pierdan el hilo, no gasten de más y que nadie publique nada sin revisar. Esto es el sistema que lo resuelve.",
  stack: [
    "Claude Code",
    "Codex",
    "Gemini",
    "API de sesiones",
    "Tareas programadas",
    "systemd",
    "Linux PSI",
    "Git",
  ],
  metrics: [
    { value: "1 + N", label: "supervisor y un agente por proyecto" },
    { value: "30 %", label: "de contexto: punto de relevo" },
    { value: "~5×", label: "menos coste por paso tras el relevo" },
    { value: "cada hora", label: "revisión automática del supervisor" },
  ],
  sections: [
    {
      id: "como-funciona",
      heading: "Cómo funciona",
      body: [
        "Cada proyecto tiene su agente trabajador, con su encargo por escrito. Un **agente supervisor** los arranca, les da el trabajo y los vigila por API: estado, uso de contexto y último mensaje. Cuando un trabajador acaba un hito, avisa al supervisor por mensaje; no basta con decirlo en su propia respuesta, porque ahí nadie lo lee.",
        "El supervisor se revisa a sí mismo **cada hora con una tarea programada recurrente**. Antes eran recordatorios encadenados: si uno caía, la cadena se rompía y nadie reanudaba. Una tarea recurrente no depende de que la anterior haya corrido.",
      ],
    },
    {
      id: "contexto",
      heading: "El estado vive en ficheros, no en la conversación",
      body: [
        "Cada proyecto tiene una **hoja de ruta versionada en Git**. Cuando una sesión llega al 30 % de su contexto, escribe dónde está y qué sigue, lo sube, y la sustituye una sesión nueva que solo lee ese fichero.",
        "La razón es de coste, y está medida: cada paso de una sesión de 500.000 tokens cuesta unas cinco veces lo que uno de una de 100.000, y la caché dura una hora. Tras una parada larga no se reanuda una sesión grande: se abre una nueva desde la hoja de ruta.",
      ],
      pullQuote: "El contexto es un presupuesto. Se gasta en el trabajo, no en arrastrar el historial.",
    },
    {
      id: "maquina",
      heading: "Repartir la máquina entre agentes",
      body: [
        "Varios agentes lanzando builds, navegadores de test y grabaciones a la vez saturan cualquier servidor. Los trabajos pesados pasan por una **cola común** y un semáforo que mira la **presión real de CPU y memoria (PSI de Linux)**, no la media de carga: medí una media de carga de 17 a 23 con solo un 5 % de presión real de CPU, porque la media cuenta también la espera de disco.",
      ],
    },
    {
      id: "revision",
      heading: "Revisión donde cuesta caro equivocarse",
      bullets: [
        {
          term: "Otro modelo revisa",
          text: "Las revisiones independientes se hacen con otro modelo, más caro, reservado para lo que de verdad importa: un lanzamiento, la exactitud de unos cálculos, la experiencia de un jugador.",
        },
        {
          term: "Instrucciones tratadas como código",
          text: "Las reglas que leen los agentes están versionadas, son cortas y van por capas: lo que se carga siempre es mínimo y el detalle vive aparte, para no gastar contexto en cada paso.",
        },
        {
          term: "Las personas deciden",
          text: "Los agentes proponen y construyen; publicar, gastar dinero o tocar cuentas lo decide una persona.",
        },
      ],
    },
  ],
  links: [],
  repo: {
    visibility: "private",
    note: "El sistema corre en mi servidor; una versión pública documentada está en preparación.",
  },
};
