import type { CaseStudy } from "../types";

export const visionLocalEn: CaseStudy = {
  slug: "vision-local",
  track: "personal",
  order: 8,
  featured: true,
  title: "A local vision-language model",
  tagline:
    "Qwen3-VL-4B quantised to 4 bits on my own GPU, to automate interfaces by vision instead of fixed coordinates.",
  client: "Own project",
  period: "Sep 2026",
  year: "2026",
  role: "Deployment and evaluation",
  summary:
    "Automation that clicks on fixed coordinates breaks as soon as the screen design changes. The alternative is a model that looks at the screen and says where the button is. I set it up locally, with no screenshot ever leaving the server, and evaluated it before deciding whether it needed training.",
  stack: ["Qwen3-VL-4B", "Python", "Transformers", "bitsandbytes (NF4)", "CUDA", "Docker"],
  metrics: [
    { value: "2.7 GB", label: "of VRAM at 4 bits" },
    { value: "6 / 6", label: "screens recognised" },
    { value: "15 / 15", label: "clicks inside the element" },
    { value: "0", label: "data leaving the server" },
  ],
  sections: [
    {
      id: "despliegue",
      heading: "Fitting on a consumer GPU",
      body: [
        "The model is **Qwen3-VL-4B**, an open-weights vision-language model. Quantised to **4 bits with bitsandbytes (NF4)** it takes 2.7 GB of VRAM, peaking at 3.4 GB. The GPU is a Turing card without bfloat16, so compute runs in float16: the kind of detail that decides whether a model starts at all.",
      ],
    },
    {
      id: "evaluacion",
      heading: "Evaluate before you train",
      body: [
        "Before considering fine-tuning, I built a **test set** of real screens and the elements to locate. Result with no training at all: **6 out of 6 screens** recognised and **15 out of 15 clicks** inside the right element, with a mean error of 3 to 14 pixels.",
        "With those numbers the decision was written down: no training until a screen shows up where it fails. Training without a case that justifies it is spending time and GPU on improving something that already works.",
      ],
      pullQuote: "Measure first. Training is the answer to a specific failure, not the starting point.",
    },
    {
      id: "privacidad",
      heading: "Privacy by design",
      body: [
        "Screenshots can contain personal data, so inference is local: no data leaves the server or goes through a third-party API.",
      ],
    },
  ],
  links: [],
  repo: {
    visibility: "private",
    note: "Part of my server's private infrastructure.",
  },
};
