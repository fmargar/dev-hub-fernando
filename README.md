# Dev-Hub Fernando

Este es un portafolio profesional y laboratorio de herramientas construido con [Next.js](https://nextjs.org).

## Despliegue en Ubuntu Server

Este proyecto está configurado para ejecutarse en un servidor Ubuntu propio usando Docker.

### Requisitos
- Docker y Docker Compose

### Pasos para el despliegue
1. Clona el repositorio.
2. Construye y levanta el contenedor:
   ```bash
   docker compose up -d --build
   ```

El proyecto estará disponible en el puerto 80 (o el configurado en `docker-compose.yml`).

## Herramientas Incluidas
- **Video Crunch**: Compresión de video local con FFmpeg.wasm.
- **Background Remover**: Eliminación de fondos de imágenes.
- **Image Forge**: Procesamiento de imágenes.
- **Herramientas de Desarrollo**: Formateador JSON, Generador de snippets.
