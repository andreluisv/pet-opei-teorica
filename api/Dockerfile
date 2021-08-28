FROM node:14.17.5

LABEL version="1.0"
LABEL description="This is the base docker image for the OPEI Teorica backend react app."
LABEL maintainer = ["alpvj@cin.ufpe.br"]

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install

COPY . .

EXPOSE 3333

CMD ["npm", "start"]