# Usamos Node.js ligero
FROM node:20-alpine

# Establecemos carpeta de trabajo
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias de desarrollo necesarias para build
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Construimos el proyecto NestJS
RUN npm run build

# Exponemos el puerto que usará la app (Railway define PORT)
EXPOSE 3000

# Definimos variables de entorno
ENV NODE_ENV=production

# Comando para arrancar la app
CMD ["node", "dist/main.js"]