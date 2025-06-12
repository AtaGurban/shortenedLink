FROM node:20

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm install

COPY . .
COPY .env .env
# Скомпилировать TypeScript в JS
RUN npm run build

# Запускаем скомпилированный JS из папки dist (если tsconfig.json правильно настроен)
CMD ["node", "dist/index.js"]
