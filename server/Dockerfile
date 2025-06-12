FROM node:20

# Установка рабочей директории в контейнере
WORKDIR /usr/src/app

# Копирование зависимостей и файлов проекта
COPY package*.json ./
COPY tsconfig.json ./
COPY . .

COPY package*.json tsconfig.json ./
RUN npm install

COPY . .
COPY .env .env
# Скомпилировать TypeScript в JS
RUN npm run build
# Открываем порт, на котором будет работать сервер
EXPOSE 5002

# Запускаем скомпилированный JS из папки dist (если tsconfig.json правильно настроен)
CMD ["node", "dist/index.js"]
