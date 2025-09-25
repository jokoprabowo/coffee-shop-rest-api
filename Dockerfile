FROM node:22-alpine as development
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine as production
ENV NODE_ENV=production
RUN apk add --no-cache bash
WORKDIR /app
COPY wait-for-it.sh .
RUN chmod +x ./wait-for-it.sh
COPY package*.json .
RUN npm ci --omit=dev
COPY --from=development /app/dist ./dist
COPY --from=development /app/migrations ./migrations
EXPOSE 3000
CMD ["npm", "start"]