// Sonidos sintetizados al vuelo (no hay ficheros): el plástico de la caja, el clac al abrir, el motor
// de la consola leyendo el disco y el chasquido de la tele. Solo suenan tras un gesto de quien visita,
// bajos, y se pueden quitar (se recuerda en este navegador).
let ctx = null, encendido = true;
try { encendido = localStorage.getItem('fragua-sonido') !== 'no'; } catch { /* sin almacenamiento: con sonido */ }

export const sonidoActivo = () => encendido;
export function alternarSonido() {
  encendido = !encendido;
  try { localStorage.setItem('fragua-sonido', encendido ? 'si' : 'no'); } catch { /* nada */ }
  return encendido;
}

function audio() {
  if (!encendido) return null;
  if (!ctx) { try { ctx = new AudioContext(); } catch { encendido = false; return null; } }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function ruido(c, dur) {
  const b = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const s = c.createBufferSource(); s.buffer = b; return s;
}

function golpe(c, t, { f = 2400, q = 1.2, dur = .05, vol = .25, tipo = 'bandpass' } = {}) {
  const s = ruido(c, dur), fl = c.createBiquadFilter(), g = c.createGain();
  fl.type = tipo; fl.frequency.value = f; fl.Q.value = q;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  s.connect(fl).connect(g).connect(c.destination); s.start(t); s.stop(t + dur);
}

function tono(c, t, { f = 120, f2 = f, dur = .1, vol = .1, tipo = 'sine' } = {}) {
  const o = c.createOscillator(), g = c.createGain();
  o.type = tipo; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + .02);
}

export const sonar = {
  // sacar la caja de la balda: roce de plástico
  sacar() { const c = audio(); if (!c) return; const t = c.currentTime; golpe(c, t, { f: 3200, q: .6, dur: .16, vol: .05, tipo: 'highpass' }); },
  // abrir: el clac de las pestañas
  abrir() { const c = audio(); if (!c) return; const t = c.currentTime; golpe(c, t, { f: 2600, q: 3, dur: .03, vol: .32 }); golpe(c, t + .045, { f: 1500, q: 2, dur: .05, vol: .16 }); tono(c, t, { f: 180, f2: 90, dur: .08, vol: .07 }); },
  cerrar() { const c = audio(); if (!c) return; const t = c.currentTime; golpe(c, t, { f: 1800, q: 2, dur: .05, vol: .3 }); tono(c, t, { f: 140, f2: 70, dur: .09, vol: .08 }); },
  // soltar el disco del eje
  coger() { const c = audio(); if (!c) return; const t = c.currentTime; golpe(c, t, { f: 4200, q: 4, dur: .025, vol: .22 }); },
  // la consola traga el disco, el motor arranca y el lector busca
  leer() {
    const c = audio(); if (!c) return; const t = c.currentTime;
    golpe(c, t, { f: 900, q: .8, dur: .22, vol: .08, tipo: 'lowpass' });
    const o = c.createOscillator(), fl = c.createBiquadFilter(), g = c.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(40, t + .15); o.frequency.exponentialRampToValueAtTime(150, t + .9);
    fl.type = 'lowpass'; fl.frequency.value = 520;
    g.gain.setValueAtTime(.0001, t + .15); g.gain.exponentialRampToValueAtTime(.05, t + .35); g.gain.setValueAtTime(.05, t + .8); g.gain.exponentialRampToValueAtTime(.0001, t + 1.15);
    o.connect(fl).connect(g).connect(c.destination); o.start(t + .15); o.stop(t + 1.2);
    for (const k of [.45, .58, .66, .9]) golpe(c, t + k, { f: 3000, q: 5, dur: .015, vol: .1 });
  },
  // la tele: chasquido del tubo y el zumbido agudo que se va
  tele() { const c = audio(); if (!c) return; const t = c.currentTime; golpe(c, t, { f: 200, q: .7, dur: .08, vol: .2, tipo: 'lowpass' }); tono(c, t, { f: 7800, f2: 7600, dur: .5, vol: .008 }); },
  // el sello de la consola al arrancar
  arranque() { const c = audio(); if (!c) return; const t = c.currentTime; tono(c, t, { f: 523, dur: .5, vol: .05, tipo: 'triangle' }); tono(c, t + .09, { f: 784, dur: .6, vol: .04, tipo: 'triangle' }); tono(c, t + .18, { f: 1046, dur: .9, vol: .03, tipo: 'sine' }); },
  pagina() { const c = audio(); if (!c) return; const t = c.currentTime; golpe(c, t, { f: 5000, q: .5, dur: .14, vol: .035, tipo: 'highpass' }); },
  tecla() { const c = audio(); if (!c) return; const t = c.currentTime; golpe(c, t, { f: 3400, q: 6, dur: .018, vol: .1 }); },
};
