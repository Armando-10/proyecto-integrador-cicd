FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

# Se copian primero los manifiestos para aprovechar la cache de capas
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY src ./src

# Ejecutar sin privilegios de root
USER node
ENV PORT=3000
EXPOSE 3000
CMD ["node", "src/server.js"]
