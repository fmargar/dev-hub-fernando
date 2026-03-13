# Etapa 1: Instalación de dependencias
FROM node:20-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# Etapa 2: Construcción de la aplicación
FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Desactivamos el envío de telemetría y subimos el límite de memoria
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# Etapa 3: Ejecución
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copiamos lo necesario para ejecutar la app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Next.js corre por defecto en el puerto 3000
CMD ["npm", "start"]