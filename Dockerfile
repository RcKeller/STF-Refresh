FROM node
MAINTAINER Ryan Keller <rykeller@uw.edu>

# Scaffolding directories, setting this as the app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy package manifest and install, which installs new packages if necessary.
# quiet mode improves build time at no cost.
COPY package.json /usr/src/app
RUN npm install --quiet
COPY . /usr/src/app

EXPOSE 8000
EXPOSE 443
