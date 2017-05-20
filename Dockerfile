FROM node
MAINTAINER Ryan Keller <rykeller@uw.edu>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install --quiet
COPY . /usr/src/app

EXPOSE 8000
CMD ["npm", "run", "bs"]
