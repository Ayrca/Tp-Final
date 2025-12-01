# ======= Stage 1: Build =======
FROM node:20-alpine AS builder

# Carpeta de trabajo
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos todas las dependencias (dev + prod) para poder compilar
RUN npm install

# Copiamos todo el proyecto
COPY . .

# Compilamos la app NestJS
RUN npm run build

# ======= Stage 2: Production =======
FROM node:20-alpine

WORKDIR /app

# Copiamos solo dependencias de producción
COPY package*.json ./
RUN npm install --production

# Copiamos la carpeta dist generada en el build
COPY --from=builder /app/dist ./dist

# Copiamos archivos necesarios para runtime
COPY --from=builder /app/.env ./   
COPY --from=builder /app/prisma ./     

# Exponemos el puerto
EXPOSE 8080

# Comando para ejecutar la app con tu main.ts
CMD ["node", "dist/main.js"]
