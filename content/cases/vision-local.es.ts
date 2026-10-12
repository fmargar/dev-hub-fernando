import type { CaseStudy } from "../types";

export const visionLocalEs: CaseStudy = {
  slug: "vision-local",
  track: "personal",
  order: 8,
  featured: true,
  title: "Modelo de visión y lenguaje en local",
  tagline:
    "Qwen3-VL-4B cuantizado a 4 bits en mi propia GPU, para automatizar interfaces por visión en lugar de con coordenadas fijas.",
  client: "Proyecto propio",
  period: "Sep 2026",
  year: "2026",
  role: "Despliegue y evaluación",
  summary:
    "Una automatización que pulsa en coordenadas fijas se rompe en cuanto cambia el diseño de la pantalla. La alternativa es que un modelo mire la pantalla y diga dónde está el botón. Lo monté en local, sin que ninguna captura salga del servidor, y lo evalué antes de decidir si hacía falta entrenarlo.",
  stack: ["Qwen3-VL-4B", "Python", "Transformers", "bitsandbytes (NF4)", "CUDA", "Docker"],
  metrics: [
    { value: "2,7 GB", label: "de VRAM con 4 bits" },
    { value: "6 / 6", label: "pantallas reconocidas" },
    { value: "15 / 15", label: "clics dentro del elemento" },
    { value: "0", label: "datos que salen del servidor" },
  ],
  sections: [
    {
      id: "despliegue",
      heading: "Caber en una GPU doméstica",
      body: [
        "El modelo es **Qwen3-VL-4B**, de visión y lenguaje y de pesos abiertos. Cuantizado a **4 bits con bitsandbytes (NF4)** ocupa 2,7 GB de VRAM, con picos de 3,4 GB. La GPU es de arquitectura Turing y no tiene bfloat16, así que el cómputo va en float16: es el tipo de detalle que decide si un modelo arranca o no.",
      ],
    },
    {
      id: "evaluacion",
      heading: "Evaluar antes de entrenar",
      body: [
        "Antes de plantear un ajuste fino, monté un **conjunto de prueba** con pantallas reales y los elementos que había que localizar. Resultado sin entrenar nada: **6 de 6 pantallas** reconocidas y **15 de 15 clics** dentro del elemento correcto, con un error medio de 3 a 14 píxeles.",
        "Con esos números la decisión quedó escrita: no se entrena hasta que aparezca una pantalla en la que falle. Entrenar sin un caso que lo justifique es gastar tiempo y GPU en mejorar algo que ya funciona.",
      ],
      pullQuote: "Primero se mide. Entrenar es la respuesta a un fallo concreto, no el punto de partida.",
    },
    {
      id: "privacidad",
      heading: "Privacidad por diseño",
      body: [
        "Las capturas pueden contener datos personales, así que la inferencia es local: ningún dato sale del servidor ni pasa por una API de terceros.",
      ],
    },
  ],
  links: [],
  repo: {
    visibility: "private",
    note: "Forma parte de la infraestructura privada de mi servidor.",
  },
};
