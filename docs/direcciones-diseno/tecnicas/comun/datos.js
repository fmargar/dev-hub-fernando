// Contenido común de las cuatro pruebas: la misma caja (Adivinadle) y los mismos lomos en la balda.
// Los textos y las cifras son los de las maquetas anteriores, contrastados con el CV; aquí no se inventa nada.
// Cada técnica pinta esto a su manera, pero ninguna lleva texto metido en una imagen que no salga de aquí.

export const JUEGO = {
  id: 'adivinadle', n: '01', nombre: 'Adivinadle',
  lema: 'Un personaje nuevo cada día. El mismo caso para todo el mundo.',
  que: 'Juegos diarios de adivinar personajes de videojuegos: escribes un nombre y cada intento te dice en qué te acercas.',
  hice: 'Producto, arquitectura y revisión. El código lo escriben agentes de IA que dirijo.',
  cifras: [['9', 'juegos'], ['4', 'modos'], ['1,5 s', 'la portada']],
  stack: ['Astro', 'Laravel', 'PostgreSQL'],
  estado: 'En línea',
  web: 'adivinadle.com',
};

// La balda: los nueve proyectos de canto. Adivinadle va el tercero para que salga del centro de la balda.
export const BALDA = [
  { n: '06', nombre: 'Mi servidor' },
  { n: '02', nombre: 'Wardux' },
  { n: '01', nombre: 'Adivinadle', yo: true },
  { n: '03', nombre: 'Cálculo Exacto' },
  { n: '04', nombre: 'Equipo de agentes' },
  { n: '05', nombre: 'IA en el ERP' },
  { n: '07', nombre: 'Marbella Fácil' },
  { n: '08', nombre: 'Vados de Marbella' },
  { n: '09', nombre: 'Visión en local' },
];

// Los cuatro pasos del recorrido, iguales en todas las técnicas.
export const PASOS = [
  { id: 'balda', boton: 'En la balda', dice: 'Los nueve juegos de canto.' },
  { id: 'portada', boton: 'Sacarla', dice: 'La caja sale girando y enseña la carátula.' },
  { id: 'dorso', boton: 'Darle la vuelta', dice: 'La contraportada: lema, cifras y con qué está hecho.' },
  { id: 'abierta', boton: 'Abrirla', dice: 'Dentro, el manual a la izquierda y el disco a la derecha.' },
];
