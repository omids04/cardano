FROM node:14-alpine
WORKDIR /app
ENV SVPORT 80
COPY package.json package.json
RUN npm install
COPY src src
EXPOSE 80
CMD ["npm", "start"]
