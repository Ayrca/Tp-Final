# Usamos Node.js ligero
FROM node:20-alpine

# Carpeta de trabajo
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias (solo producción)
RUN npm install --production

# Copiamos el resto del proyecto
COPY . .

# Construimos el proyecto NestJS
RUN npm run build

# Exponemos el puerto (Railway usa process.env.PORT)
EXPOSE 8080

# Comando para arrancar la app
CMD ["node", "dist/main.js"]
