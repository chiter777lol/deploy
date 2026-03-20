FROM node:18

WORKDIR /app

# Копируем package.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код бэкенда
COPY . .

# Создаем папку для uploads, если её нет
RUN mkdir -p uploads

EXPOSE 5001

CMD ["node", "server.js"]
