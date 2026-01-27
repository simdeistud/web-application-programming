FROM ubuntu:24.04

# Install Node.js
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /src/server

COPY /src/server/package.json .
RUN npm install

COPY . .

EXPOSE 3000
CMD ["node", "app.js"]