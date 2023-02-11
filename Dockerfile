# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY yarn.lock ./

# Install app dependencies
RUN curl -o- -L https://yarnpkg.com/install.sh | bash
RUN yarn

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN yarn build

RUN yarn spikk-cli seed:constants
RUN yarn spikk-cli seed:super-admin

# Start the server using the production build
CMD [ "node", "dist/main.js" ]