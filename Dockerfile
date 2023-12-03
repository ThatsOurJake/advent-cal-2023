FROM node:20-alpine as build
WORKDIR /build
COPY . .
RUN npm install
ENV NODE_ENV="production"
RUN npm run build



FROM node:20-alpine as prod_modules
WORKDIR /prod_modules
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install --omit=dev



FROM node:20-alpine
ENV NODE_ENV="production"
WORKDIR /app
COPY --from=build /build/.next /app/.next
COPY --from=build /build/public /app/public
COPY --from=prod_modules /prod_modules/package.json /app/package.json
COPY --from=prod_modules /prod_modules/node_modules /app/node_modules
EXPOSE 3000
CMD npm start
