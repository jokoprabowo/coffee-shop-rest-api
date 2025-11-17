FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npx turbo run build --filter=@project/api...

FROM node:22-alpine AS runner
RUN apk add --no-cache bash
WORKDIR /app
COPY package*.json .
COPY --from=build /app/services/api/package.json ./services/api/package.json
COPY --from=build /app/services/api/dist ./services/api/dist
COPY --from=build /app/services/api/migrations ./services/api/migrations
COPY --from=build /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
RUN npm ci --omit=dev
WORKDIR /app/services/api
ENV NODE_ENV=production
COPY wait-for-it.sh .
RUN chmod +x ./wait-for-it.sh
EXPOSE 3000
CMD ["npm", "run", "start"]
# FROM node:22-alpine AS development
# WORKDIR /app
# COPY api/package*.json .
# RUN npm install
# COPY api/ .
# RUN npm run build

# FROM node:22-alpine AS production
# RUN apk add --no-cache bash
# WORKDIR /app
# COPY wait-for-it.sh .
# RUN chmod +x ./wait-for-it.sh
# COPY api/package*.json .
# RUN npm ci --omit=dev
# COPY --from=development /app/dist ./dist
# COPY --from=development /app/migrations ./migrations
# EXPOSE 3000
# CMD ["sh", "-c", "./wait-for-it.sh db:5432 -- npm run start:docker"]