# ======= Stage 1: Build =======
FROM node:20-alpine AS builder

# Instalamos dependencias necesarias para build
WORKDIR /app
COPY package*.json ./
RUN npm install

# Copiamos todo el proyecto
COPY . .

# Construimos la app
RUN npm run build

# ======= Stage 2: Production =======
FROM node:20-alpine

# Carpeta de trabajo
WORKDIR /app

# Copiamos solo las dependencias de producción
COPY package*.json ./
RUN npm install --production

# Copiamos la carpeta 'dist' desde el build
COPY --from=builder /app/dist ./dist

# Copiamos archivos necesarios para ejecución (si tienes env, etc.)
COPY --from=builder /app/package*.json ./

# Exponemos el puerto (Railway asigna process.env.PORT)
EXPOSE 8080

# Comando para iniciar la app
CMD ["node", "dist/main.js"]
