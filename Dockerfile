FROM node:20-alpine AS build
WORKDIR /app
ADD package*.json /app
RUN npm ci --also=dev
COPY . /app/
RUN npm run build

FROM node:20
WORKDIR /app
ADD package*.json /app
RUN npm ci --prod
COPY --from=build /app/out/ /app/out/
CMD node /app/out/index.js > /out.log 2>&1
