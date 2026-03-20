FROM node:lts

WORKDIR /app

# Em modo de desenvolvimento com volumes (bind mount),
# a instalação local (Windows) pode conflitar com os binários do Linux (ex: Prisma, bcrypt).
# Faremos o npm install no startup command do compose para garantir binários corretos,
# mas copiamos o package aqui caso queiram construir a imagem isoladamente.
COPY package*.json ./
COPY turbo.json ./

COPY packages ./packages
COPY apps ./apps

RUN npm install

EXPOSE 3000

# O comando real será sobrescrito pelo docker-compose.yml para dev
CMD ["npm", "run", "dev"]
