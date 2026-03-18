FROM node:22-alpine AS build-stage
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build --configuration=production

FROM nginx:stable-alpine

COPY --from=build-stage /app/dist/intern-hub-shell-app/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.d/40-generate-env.sh /docker-entrypoint.d/40-generate-env.sh
RUN chmod +x /docker-entrypoint.d/40-generate-env.sh

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
