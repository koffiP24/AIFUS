FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate && npx prisma generate --schema prisma/schema.mysql.prisma

COPY src ./src
COPY scripts ./scripts

EXPOSE 5000

CMD ["npm", "start"]
