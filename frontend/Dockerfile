# frontend/Dockerfile

FROM node:16-alpine as build

# Устанавливаем рабочую директорию
WORKDIR /var/www/front

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем основные зависимости
RUN npm install

# Копируем все файлы приложения
COPY . ./

# Собираем приложение
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
