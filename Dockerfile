FROM node:14-alpine
WORKDIR /app
ENV SVPORT 80
COPY . .
EXPOSE 80
CMD ["npm", "start"]
