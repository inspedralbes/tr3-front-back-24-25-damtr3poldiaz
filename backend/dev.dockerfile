# Utilizamos una imagen oficial de Node.js
FROM node:18-alpine

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app/back

# Instalamos nodemon globalmente
RUN npm install -g nodemon

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias del proyecto
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto de la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación en modo desarrollo
CMD ["npm", "run", "dev"]
