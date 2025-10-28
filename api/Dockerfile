FROM node:22-alpine AS development
WORKDIR /app
COPY api/package*.json .
RUN npm install
COPY api/ .
RUN npm run build

FROM node:22-alpine AS production
RUN apk add --no-cache bash
WORKDIR /app
COPY wait-for-it.sh .
RUN chmod +x ./wait-for-it.sh
COPY api/package*.json .
RUN npm ci --omit=dev
COPY --from=development /app/dist ./dist
COPY --from=development /app/migrations ./migrations
EXPOSE 3000
CMD ["sh", "-c", "./wait-for-it.sh db:5432 -- npm run start:docker"]