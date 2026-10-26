FROM node:24-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ARG VITE_GOOGLE_MAPS_API_KEY
ARG VITE_ENABLE_GOOGLE_AUTOCOMPLETE=true
ARG VITE_GOOGLE_MAP_ID
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY
ENV VITE_ENABLE_GOOGLE_AUTOCOMPLETE=$VITE_ENABLE_GOOGLE_AUTOCOMPLETE
ENV VITE_GOOGLE_MAP_ID=$VITE_GOOGLE_MAP_ID
RUN npm run build

FROM node:24-alpine
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/ ./
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist
RUN mkdir -p uploads && chown -R node:node /app
USER node
ENV NODE_ENV=production
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
