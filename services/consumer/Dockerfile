
FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npx turbo run build --filter=@project/consumer...

FROM node:22-alpine AS runner
RUN apk add --no-cache bash
WORKDIR /app
COPY package*.json .
COPY --from=build /app/services/consumer/package.json ./services/consumer/package.json
COPY --from=build /app/services/consumer/dist ./services/consumer/dist
COPY --from=build /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
RUN npm ci --omit=dev
WORKDIR /app/services/consumer
ENV NODE_ENV=production
COPY wait-for-it.sh .
RUN chmod +x ./wait-for-it.sh
CMD ["npm", "run", "start"]