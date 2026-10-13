FROM node:20-alpine
WORKDIR /app
# node_modules lives in a Docker volume, not in the mounted repo
RUN mkdir -p /app/node_modules && chown -R node:node /app
USER node
EXPOSE 5173 4173
# Install deps if missing, then start the dev server on all interfaces
CMD ["sh", "-c", "npm install --no-audit --no-fund && npm run dev -- --host 0.0.0.0"]
