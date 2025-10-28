FROM node:22-alpine AS development
WORKDIR /app
COPY consumer/package*.json .
RUN npm install
COPY consumer/ .
RUN npm run build

FROM node:22-alpine AS production
RUN apk add --no-cache bash
WORKDIR /app
COPY wait-for-it.sh .
RUN chmod +x ./wait-for-it.sh
COPY consumer/package*.json .
RUN npm ci --omit=dev
COPY --from=development /app/dist ./dist
CMD ["sh", "-c", "./wait-for-it.sh db:5432 -- npm run start:pm2"]