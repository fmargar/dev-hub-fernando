// Contenido del showcase. Los textos y las cifras salen de la maqueta anterior (currada/js/datos.js),
// contrastados con el CV; aquí no se inventa ninguna cifra.

export const PERFIL = {
  nombre: 'Fernando Martínez',
  titular: ['Desarrollador Full Stack', 'agentes de IA', 'integración de LLM'],
  frase: 'Construyo y pongo en marcha software con un equipo de agentes de IA',
  correo: 'fmargardeveloper@gmail.com',
  github: 'https://github.com/fmargar',
  linkedin: 'https://www.linkedin.com/in/fernando-maximo-martinez-garcia/',
  cv: 'cv/fernando-martinez-cv.pdf',
};

// Cómo se rotula cada demo: lo inventado siempre lleva «Simulación».
export const ROTULOS = {
  simulacion: ['Simulación', 'Datos inventados para la demo; la mecánica es la real.'],
  reconstruccion: ['Reconstrucción', 'Datos reales, reproducidos a otro ritmo.'],
  'en-vivo': ['En vivo', 'Funciona de verdad mientras lo miras.'],
  esquema: ['Esquema', 'Un dibujo de cómo está montado.'],
};

export const PROYECTOS = [
  {
    id: 'adivinadle', n: '01', nombre: 'Adivinadle', objeto: 'La caja del juego',
    linea: 'Juegos diarios de adivinar personajes de videojuegos.',
    tipo: 'Producto publicado', estado: 'En línea', demo: 'simulacion',
    entradilla: ['Un personaje nuevo cada día.', 'El mismo caso', 'para todo el mundo.'],
    bloques: [
      ['Qué es', 'Juegos diarios de adivinar personajes de videojuegos: escribes un nombre y cada intento te dice en qué te acercas.'],
      ['Qué hice yo', 'Producto, arquitectura y revisión. El código lo escriben agentes de IA que dirijo.'],
      ['Resultado', '9 juegos en adivinadle.com, con la portada cargada en 1,5 s.'],
    ],
    cifras: [['9', 'juegos'], ['4', 'modos'], ['1,5 s', 'la portada']],
    stack: ['Astro', 'Laravel', 'PostgreSQL'],
    web: ['adivinadle.com', 'https://adivinadle.com'],
    interior: true,
  },
  {
    id: 'wardux', n: '02', nombre: 'Wardux', objeto: 'El periódico',
    linea: 'Noticias y guías de IA y hardware, en español.',
    tipo: 'Producto publicado', estado: 'En línea', demo: 'reconstruccion',
    entradilla: ['Lo escribe una IA.', 'Lo revisa otra', 'antes de publicarse.'],
    bloques: [
      ['Qué es', 'Noticias y guías de IA y hardware, en español.'],
      ['Qué hice yo', 'Producto, arquitectura y el flujo de redacción y revisión.'],
      ['Resultado', '90 artículos publicados; cada uno lo revisa una IA distinta de la que lo escribe.'],
    ],
    cifras: [['90', 'artículos'], ['2', 'IA por artículo']],
    stack: ['Astro', 'Laravel', 'Docker'],
    web: ['wardux.com', 'https://wardux.com'],
  },
  {
    id: 'calculo', n: '03', nombre: 'Cálculo Exacto', objeto: 'La calculadora',
    linea: 'Calculadoras de nómina y dinero para España.',
    tipo: 'Precisión contrastada', estado: 'En desarrollo', demo: 'reconstruccion',
    entradilla: ['Cuentas de nómina', 'al céntimo,', 'comparadas con la Agencia Tributaria.'],
    bloques: [
      ['Qué es', 'Calculadoras de nómina y dinero para España.'],
      ['Qué hice yo', 'Producto, arquitectura y la batería de validación.'],
      ['Resultado', '46 casos comparados con la Agencia Tributaria: coinciden al céntimo.'],
    ],
    cifras: [['46', 'casos contrastados'], ['0,00 €', 'de diferencia']],
    stack: ['TypeScript', 'Astro', 'Vitest'],
  },
  {
    id: 'agentes', n: '04', nombre: 'Equipo de agentes', objeto: 'Las bandejas',
    linea: 'Varios agentes de IA trabajando en paralelo, uno por proyecto.',
    tipo: 'Sistema propio', estado: 'En uso', demo: 'simulacion',
    entradilla: ['Cada encargo pasa por', 'tres bandejas:', 'hacer, revisar, terminar.'],
    bloques: [
      ['Qué es', 'Varios agentes de IA trabajando en paralelo, uno por proyecto.'],
      ['Qué hice yo', 'Diseñé cómo se reparten el trabajo y cómo se revisan.'],
      ['Resultado', 'Un supervisor revisa a cada agente cada hora; así se construyen mis webs.'],
    ],
    cifras: [['cada hora', 'una revisión']],
    stack: ['Claude Code', 'Codex', 'Gemini'],
    web: ['github.com/fmargar/equipo-de-agentes', 'https://github.com/fmargar/equipo-de-agentes'],
  },
  {
    id: 'erp', n: '05', nombre: 'IA en el ERP', objeto: 'La ficha y el sello',
    linea: 'Descripciones de producto redactadas por IA dentro de Odoo.',
    tipo: 'Trabajo en empresa', estado: 'En uso', demo: 'simulacion',
    entradilla: ['La IA propone.', 'Una persona', 'pone el sello.'],
    bloques: [
      ['Qué es', 'Descripciones de producto redactadas por IA dentro de Odoo.'],
      ['Qué hice yo', 'Desarrollé el módulo y su instalador, con simulación y vuelta atrás.'],
      ['Resultado', 'Ninguna descripción se publica sin que una persona la apruebe.'],
    ],
    cifras: [['0', 'publicadas sin aprobar']],
    stack: ['Odoo', 'Python', 'OpenAI'],
  },
  {
    id: 'servidor', n: '06', nombre: 'Mi servidor', objeto: 'El servidor',
    linea: 'El servidor propio donde corren mis webs.',
    tipo: 'Sistema propio', estado: 'En uso', demo: 'esquema',
    entradilla: ['Veintiocho relojes sueltos,', 'un solo', 'orquestador.'],
    bloques: [
      ['Qué es', 'El servidor propio donde corren mis webs.'],
      ['Qué hice yo', 'Lo diseño, lo opero y lo mantengo.'],
      ['Resultado', '28 tareas programadas pasaron a un solo orquestador; copias en 3 capas.'],
    ],
    cifras: [['28 → 1', 'tareas en un orquestador'], ['3', 'capas de copias']],
    stack: ['Docker', 'PostgreSQL', 'Cloudflare'],
  },
  {
    id: 'marbella', n: '07', nombre: 'Marbella Fácil', objeto: 'La postal', menor: true,
    linea: 'Reservas, directorio y servicios de Marbella en una sola web.',
    tipo: 'Proyecto de fin de ciclo', estado: 'En línea',
    bloques: [
      ['Qué es', 'Reservas, directorio y servicios de Marbella en una sola web.'],
      ['Resultado', 'Proyecto de fin de ciclo: 10 con Matrícula de Honor.'],
    ],
    cifras: [['10', 'con Matrícula de Honor']],
    stack: [],
    web: ['marbellafacil.com', 'https://marbellafacil.com'],
  },
  {
    id: 'vados', n: '08', nombre: 'Vados de Marbella', objeto: 'La placa', menor: true,
    linea: 'Gestión de los vados del Ayuntamiento de Marbella.',
    tipo: 'Trabajo para el Ayuntamiento', estado: 'Entregado',
    bloques: [
      ['Qué es', 'Gestión de los vados del Ayuntamiento de Marbella.'],
      ['Resultado', '4 zonas unificadas y los datos de 2 sistemas antiguos importados.'],
    ],
    cifras: [['4', 'zonas unificadas']],
    stack: [],
  },
  {
    id: 'vision', n: '09', nombre: 'Visión en local', objeto: 'La lámina', menor: true,
    linea: 'Un modelo que entiende capturas de pantalla, en mi propio equipo.',
    tipo: 'Prueba técnica', estado: 'Probado',
    bloques: [
      ['Qué es', 'Un modelo que entiende capturas de pantalla, en mi propio equipo.'],
      ['Resultado', 'Reconoció 6 de 6 pantallas usando 2,7 GB de memoria gráfica.'],
    ],
    cifras: [['6 de 6', 'pantallas reconocidas']],
    stack: [],
  },
];

export const porId = (id) => PROYECTOS.find((p) => p.id === id);
