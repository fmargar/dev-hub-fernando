# Estado del portfolio (fmargar.es)

Relevo del 12/10/2026. Lo lee el siguiente chat para retomar sin el historial.

## Qué hay desplegado

- **fmargar.es sirve `b9c43c7`** de la rama `portfolio/ai-engineer-2026-10` (el 15303ed más
  el enlace al repo público de agentes). Comprobado desde fuera.
- Titular: **«Desarrollador Full Stack · IA en producción · agentes de IA»**. Nunca «AI
  Engineer» ni «ingeniero de IA»: Fernando no ha tenido ese puesto.
- 9 fichas en `/work/<slug>`: adivinadle, wardux, calculo-exacto (sin enlace: aún no está
  publicada), agentes-ia (enlaza `github.com/fmargar/equipo-de-agentes`, público),
  vision-local, homelab, uniformes-bahia, sistema-vados-marbella, marbella-facil (solo la web,
  nunca el repo). Español sin prefijo e inglés en `/en`; el alemán se retiró (`/de` → `/en`).
- Secciones de la portada con ids estables: `#proyectos`, `#experiencia`, `#habilidades`,
  `#contacto`. El README del perfil de GitHub enlaza a estas URL: no cambiarlas.
- CV: `public/cv/fernando-martinez-cv.pdf` = `~/docs/CV_Fernando_Maximo_Martinez_Garcia_web.pdf`
  (versión web **sin teléfono**). Si el CV cambia, copiar esa ruta y redesplegar.
- Formulario de contacto: `lib/contact-delivery.ts`. Guarda cada mensaje en
  `~/servicios/portfolio/mensajes/contacto.jsonl` y avisa al móvil por avisos-api (emisor
  `portfolio`). Resend solo si algún día hay clave. Probado de verdad dos veces (avisos #1045 y #1046).
- API pública con límites (`lib/api-guard.ts`, con tests): contact, remove-bg y nba.

## Prohibido en el portfolio

Microsoft Rewards, farmeo, cuentas o bots de Rewards (el orquestador se describe genérico);
los vídeos de TikTok/YouTube y su canal; IPs de Tailscale, puertos o cualquier dato de la red
interna; el repo de Marbella Fácil; enlazar repos privados (Adivinadle, Cálculo Exacto). Wardux
**sí** se puede nombrar desde el 12/10.

## Cómo se despliega (ya no es el stack 3 de Portainer)

Producción es un docker compose del clon `~/dev/dev-hub-fernando-legacy`, proyecto
`dev-hub-fernando`. El `.env` de ese directorio (600, fuera de git) lleva `AVISOS_URL` y
`AVISOS_CLAVE`.

```bash
cd ~/dev/dev-hub-fernando-legacy
nice -n 10 taskset -c 0-3 docker build -t dev-hub-fernando-portfolio:$(git rev-parse --short HEAD) .
docker run -d --name portfolio-prueba -p 127.0.0.1:3099:3000 dev-hub-fernando-portfolio:<commit>  # probar
docker rm -f portfolio-prueba
docker tag dev-hub-fernando-portfolio:latest dev-hub-fernando-portfolio:<commit-actual>-desplegada
docker tag dev-hub-fernando-portfolio:<commit> dev-hub-fernando-portfolio:latest
docker compose -p dev-hub-fernando up -d --no-build
```

Vuelta atrás: retaguear una de estas como `:latest` y repetir el último paso.
`:anterior-20261012` (portfolio de antes del 12/10), `:54a049e-desplegada`,
`:8bf3f54-desplegada`, `:15303ed`.

No usar `docker compose` en `~/dev/dev-hub-fernando`: es otro proyecto, el contenedor
`mi-portfolio-dev` (3070), con el rediseño espacial viejo de `master`.

## Pendiente

1. **Diseño:** Fernando dijo que el actual (cobalto) parece «genérico hecho con IA». Hay dos
   direcciones en `docs/direcciones-diseno/`, publicadas con capturas en
   http://100.93.209.52:4300/portfolio/ (`/mnt/datos/simulaciones/salida/portfolio/`):
   - **A · Sala de control:** grafito con rejilla, el panel de los agentes como pieza única,
     cuatro colores muy distintos (azul, rojo, verde, amarillo), Bricolage Grotesque y el CV
     en amarillo.
   - **B · Cartel:** rojo saturado con trama de semitono, nombre gigante en Archivo ancho,
     banda negra con el titular y sombra dorada, capturas de Adivinadle y Wardux por capas, y
     «La IA propone. Una persona decide.» con la tarjeta de aprobación.
   - **C · Mezcla (12/10, la pidió Fernando: «B más chulo, A más clean, el rojo cansa»):** base
     grafito con rejilla de A; de B, el nombre gigante en Archivo ancho, la banda roja del titular
     con sombra dorada y las capturas por capas, pero el rojo solo en una losa detrás de ellas.
     Debajo, «La IA propone. Una persona decide.» con el panel de agentes de A.
     Fernando: «queda raro». Crítica con impeccable: dos mundos pegados (cartel impreso sobre
     panel técnico), cuatro inclinaciones distintas, sombras duras de disfraz, pegatina.
   - **D · Escaparate (12/10, la propuesta vigente):** un solo mundo, web de producto oscura al
     listón de PRODUCT.md (Linear, Stripe). Nombre en Archivo ancho a 6rem centrado, las tres
     capturas (Wardux, Adivinadle y Adivinadle en el móvil) en un único plano inclinado con la
     luz de los cuatro colores detrás, y debajo «Lo que tengo en producción»: tarjetas por
     proyecto, cada una con su color y su captura saliendo por abajo (Adivinadle ancha, Wardux,
     Equipo de agentes con el tablero, LLM en el ERP con el flujo de aprobación).
     Fernando: «no está mal pero queda raro»; quiere interactividad al hacer scroll.
   - **E · Servidor por capas (12/10, la vigente):** D con el héroe cambiado. A la derecha, el
     servidor cerrado se abre pieza a pieza con el scroll (GSAP ScrollTrigger, sección fijada
     260 % de pantalla) y cada pieza lleva una etiqueta verdadera de la infraestructura
     (Cloudflare, vigilancia, agentes, Docker, PostgreSQL, copias, despliegue, Ubuntu; nada
     del farmeo). Imagen de ChatGPT (`codex exec`, generación de imágenes) recortada en 8 capas
     con SAM 2 (`servidor/recortar_piezas.py` + `cajas.json`; entorno en
     `~/herramientas/segmentar/.venv`): cada píxel va a la pieza con más confianza, así que
     abierto reconstruye la imagen original exacta. Titular nuevo: «Desarrollador Full Stack.
     Construyo y pongo en marcha software con un equipo de agentes de IA» (Fernando: «IA a
     producción» asusta, suena a enchufarle una IA a su sistema).
     Siguiente opción si la quiere más cinematográfica: Higgsfield (de pago: vídeo con
     Seedance → fotogramas → scroll). Lo decide Fernando por el dinero.
     Fernando: «funciona muy mal», se aparca el scroll. Quiere diseños «mucho más guays».
   - **Ronda del 12/10 tarde** (impeccable `concept-seed`, clave 046653b4; se descartan los
     mundos «de época» que ya rechazó): **F · Cartas** (cada proyecto, una carta coleccionable
     con lámina holográfica que sigue al puntero; mano en abanico en la portada), **G · Ciudad**
     (manzana en pixel art isométrico generada con ChatGPT, `ciudad/ciudad.webp`; cada edificio
     es un proyecto con su ficha al pasar: local de juegos = Adivinadle, torre de prensa =
     Wardux, robot del tejado = agentes, centro de datos = servidor, fábrica con la mano del
     visto bueno = LLM en el ERP) y **H · Cartel profundo** (la B con rojo #c9231a y texto
     crema, para que no deslumbre). Esperando a que Fernando elija.

   Regenerar las capturas: `cd docs/direcciones-diseno && node cap.mjs [nombre…]` (y `node cap-scroll.mjs e-servidor 0 1 2.6` para fotos a distintas alturas del scroll). Publicar en :4300 cambiando `../../public/media/` por `media/` (Playwright de
   `~/dev/ms-rewards-bot-propio/node_modules`). Cuando elija, llevar la dirección a toda la
   web (`app/globals.css`, `components/home/HomeView.tsx`, fuentes en `lib/fonts.ts`), sacar
   capturas a 390 y 1440 de portada, una ficha y /experience, y desplegar. El contenido y la
   accesibilidad no pueden empeorar.
2. **Escaneo con claude-security del portfolio:** no se lanzó, porque el plugin exige que
   Fernando confirme con sus palabras que acepta el tiempo y los tokens. Hay una sesión de
   Seguridad dedicada (session_01Nkjgb3yM8FrVXSFv94csnT).
3. `master` sigue teniendo el rediseño espacial. Cuando el diseño quede cerrado, decidir si
   `master` pasa a ser esta rama (merge `-s ours` para conservar la historia).
4. Laboratorio de herramientas (`/tools`): sin tocar; sigue en el menú.
