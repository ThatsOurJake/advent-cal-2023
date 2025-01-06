FROM node:22-alpine AS build

WORKDIR /build
COPY . .
RUN npm install
ENV NODE_ENV="production"
RUN npm run build


FROM --platform=linux/amd64 node:22-alpine AS prod_modules
WORKDIR /prod_modules
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install --omit=dev



FROM --platform=linux/amd64 node:22-alpine
ARG BUILD_DATE
ENV BUILD_DATE=$BUILD_DATE
ENV NODE_ENV="production"

WORKDIR /app
COPY --from=build /build/.next /app/.next
COPY --from=build /build/next.config.js /app/next.config.js
COPY --from=build /build/public /app/public
COPY --from=prod_modules /prod_modules/package.json /app/package.json
COPY --from=prod_modules /prod_modules/node_modules /app/node_modules
EXPOSE 3000
CMD ["npm", "start"]
