FROM node:alpine

# Create app directory
WORKDIR /app

# Bundle app source, don't use ADD
COPY . .

EXPOSE 8080

CMD ["node", "index.js"]
