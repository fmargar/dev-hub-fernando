// Contenido y trazado del plano. Los textos salen de docs/direcciones-diseno/tarjetas/proyectos.json
// (contrastados con el CV); aquí no se inventa ninguna cifra.
//
// Cada línea es un proyecto. Sus cuatro paradas cuentan lo mismo que las tarjetas de la maqueta O:
// qué es · qué hice yo · resultado · ficha. El tren espera en la cabecera y la ficha se abre cuando
// llega a la última.

export const PERFIL = {
  nombre: 'Fernando Martínez',
  titular: 'Desarrollador Full Stack · agentes de IA · integración de LLM',
  frase: 'Construyo y pongo en marcha software con un equipo de agentes de IA',
  correo: 'fmargardeveloper@gmail.com',
  github: 'https://github.com/fmargar',
  linkedin: 'https://www.linkedin.com/in/fernando-maximo-martinez-garcia/',
  cv: 'cv/fernando-martinez-cv.pdf',
};

const PASOS = ['Qué es', 'Qué hice yo', 'Resultado', 'Ficha'];

// El orden de este array es el orden de pintado: lo último va encima en los cruces.
export const LINEAS = [
  {
    id: 'servidor', n: 6, nombre: 'Mi servidor', rotulo: ['Mi', 'servidor'], color: '#23262d', tinta: '#f4efe4',
    tipo: 'Sistema propio', estado: 'En uso',
    paradas: ['Servidor propio', 'Operación', 'Un orquestador', 'Ficha'],
    textos: [
      'El servidor propio donde corren mis webs.',
      'Lo diseño, lo opero y lo mantengo.',
      '28 tareas programadas pasaron a un solo orquestador; copias en 3 capas.',
    ],
    stack: ['Docker', 'PostgreSQL', 'Cloudflare'],
    cifra: ['28 → 1', 'tareas programadas, en un solo orquestador'],
  },
  {
    id: 'agentes', n: 1, nombre: 'Equipo de agentes', rotulo: ['Equipo', 'de agentes'], color: '#2459f5', tinta: '#ffffff',
    tipo: 'Sistema propio', estado: 'En uso',
    paradas: ['Uno por proyecto', 'El reparto', 'Cada hora', 'Ficha'],
    textos: [
      'Varios agentes de IA trabajando en paralelo, uno por proyecto.',
      'Diseñé cómo se reparten el trabajo y cómo se revisan.',
      'Un supervisor revisa a cada agente cada hora; así se construyen mis webs.',
    ],
    stack: ['Claude Code', 'Codex', 'Gemini'],
    web: ['github.com/fmargar/equipo-de-agentes', 'https://github.com/fmargar/equipo-de-agentes'],
    cifra: ['cada hora', 'un supervisor revisa el trabajo de cada agente'],
  },
  {
    id: 'adivinadle', n: 3, nombre: 'Adivinadle', rotulo: ['Adivinadle'], color: '#f7b500', tinta: '#15171c',
    tipo: 'Producto publicado', estado: 'En línea',
    paradas: ['Juegos diarios', 'Dirección', '9 juegos', 'Ficha'],
    textos: [
      'Juegos diarios de adivinar personajes de videojuegos.',
      'Producto, arquitectura y revisión. El código lo escriben agentes de IA que dirijo.',
      '9 juegos en adivinadle.com, con la portada cargada en 1,5 s.',
    ],
    stack: ['Astro', 'Laravel', 'PostgreSQL'],
    web: ['adivinadle.com', 'https://adivinadle.com'],
    imagen: 'img/adivinadle.webp',
  },
  {
    id: 'wardux', n: 2, nombre: 'Wardux', rotulo: ['Wardux'], color: '#f0293f', tinta: '#ffffff',
    tipo: 'Producto publicado', estado: 'En línea',
    paradas: ['Noticias de IA', 'Redacción', '90 artículos', 'Ficha'],
    textos: [
      'Noticias y guías de IA y hardware, en español.',
      'Producto, arquitectura y el flujo de redacción y revisión.',
      '90 artículos publicados; cada uno lo revisa una IA distinta de la que lo escribe.',
    ],
    stack: ['Astro', 'Laravel', 'Docker'],
    web: ['wardux.com', 'https://wardux.com'],
    imagen: 'img/wardux.webp',
  },
  {
    id: 'calculo', n: 4, nombre: 'Cálculo Exacto', rotulo: ['Cálculo', 'Exacto'], color: '#0fb463', tinta: '#0c1a12',
    tipo: 'Precisión contrastada', estado: 'En desarrollo',
    paradas: ['Nómina y dinero', 'Validación', 'Al céntimo', 'Ficha'],
    textos: [
      'Calculadoras de nómina y dinero para España.',
      'Producto, arquitectura y la batería de validación.',
      '46 casos comparados con la Agencia Tributaria: coinciden al céntimo.',
    ],
    stack: ['TypeScript', 'Astro', 'Vitest'],
    cifra: ['46', 'casos comparados con la Agencia Tributaria, al céntimo'],
  },
  {
    id: 'erp', n: 5, nombre: 'IA en el ERP', rotulo: ['IA en', 'el ERP'], color: '#e22b90', tinta: '#ffffff',
    tipo: 'Trabajo en empresa', estado: 'En uso',
    paradas: ['Descripciones', 'El módulo', 'Aprobar', 'Ficha'],
    textos: [
      'Descripciones de producto redactadas por IA dentro de Odoo.',
      'Desarrollé el módulo y su instalador, con simulación y vuelta atrás.',
      'Ninguna descripción se publica sin que una persona la apruebe.',
    ],
    stack: ['Odoo', 'Python', 'OpenAI'],
    cifra: ['0', 'descripciones publicadas sin que una persona las apruebe'],
  },
];
LINEAS.forEach((l) => { l.pasos = PASOS; });

// Lo que no tiene línea en el plano pero sí va en la lista de proyectos.
export const OTROS = [
  { nombre: 'Marbella Fácil', que: 'Reservas, directorio y servicios de Marbella en una sola web.', resultado: 'Proyecto de fin de ciclo: 10 con Matrícula de Honor.', estado: 'En línea', web: ['marbellafacil.com', 'https://marbellafacil.com'] },
  { nombre: 'Vados de Marbella', que: 'Gestión de los vados del Ayuntamiento de Marbella.', resultado: '4 zonas unificadas y los datos de 2 sistemas antiguos importados.', estado: 'Entregado' },
  { nombre: 'Visión en local', que: 'Un modelo que entiende capturas de pantalla, en mi propio equipo.', resultado: 'Reconoció 6 de 6 pantallas usando 2,7 GB de memoria gráfica.', estado: 'Probado' },
];

// — Trazado. Unidades de diseño: en horizontal, un lienzo de 1440×900; en vertical, 390 de ancho.
// `via`: vértices octolineales (0°, 45°, 90°); las esquinas se redondean al construir la vía.
// `paradas`: [x, y, lado del nombre]. La primera es la cabecera (lleva la insignia «L1»).
export const TRAZADO = {
  horizontal: {
    ancho: 1440, alto: 900,
    lineas: {
      servidor: { cerrada: true, radio: 110, via: [[900, 750], [1350, 750], [1350, 140], [820, 140], [820, 750]],
        paradas: [[900, 750, 's'], [1150, 750, 's'], [1105, 140, 'n'], [820, 330, 'e']] },
      agentes: { via: [[84, 430], [620, 430], [780, 590], [1120, 590]],
        paradas: [[84, 430, 'cab-n'], [400, 430, 'n'], [700, 510, 'so'], [1120, 590, 's']] },
      adivinadle: { via: [[84, 520], [540, 520], [700, 680], [1000, 680]],
        paradas: [[84, 520, 'cab-s'], [330, 520, 's'], [620, 600, 'ne'], [1000, 680, 's']] },
      wardux: { via: [[980, 96], [980, 590], [1100, 710], [1384, 710]],
        paradas: [[980, 96, 'cab-e'], [980, 290, 'o'], [980, 500, 'o'], [1384, 710, 's-fin']] },
      calculo: { via: [[1230, 96], [1230, 330], [1392, 330]],
        paradas: [[1230, 96, 'cab-e'], [1230, 230, 'e'], [1300, 330, 's'], [1392, 330, 's-fin']] },
      erp: { via: [[1060, 200], [1260, 400], [1260, 570]],
        paradas: [[1060, 200, 'cab-e'], [1140, 280, 'so'], [1260, 455, 'o'], [1260, 570, 'o']] },
    },
  },
  // En vertical cada línea es una horquilla (ida, media vuelta y vuelta) y se alternan a izquierda y derecha.
  vertical: {
    ancho: 390, alto: 1500, radio: 34,
    lineas: Object.fromEntries(['agentes', 'wardux', 'adivinadle', 'calculo', 'erp', 'servidor'].map((id, i) => {
      const y = 540 + i * 150, X = (x) => (i % 2 ? 390 - x : x), dentro = i % 2 ? 'e' : 'o';
      return [id, {
        via: [[X(52), y], [X(338), y], [X(338), y + 70], [X(150), y + 70]],
        paradas: [[X(52), y, i % 2 ? 'cab-n-fin' : 'cab-n'], [X(250), y, 'n'], [X(338), y + 35, dentro], [X(150), y + 70, dentro]],
      }];
    })),
  },
};
