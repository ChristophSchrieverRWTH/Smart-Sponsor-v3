FROM node:lts

RUN npm install --global truffle
RUN npm install --global ganache-cli
WORKDIR /app
COPY . .


# COPY client/package*.json ./
# RUN npm ci

# WORKDIR /app

# COPY contracts/ contracts/
# COPY truffle-config.js ./
# RUN truffle compile

# COPY . .