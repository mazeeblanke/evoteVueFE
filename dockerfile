FROM node

WORKDIR /evote

ADD . .

RUN apt-get update -y && apt-get install -y python2.7 python-pip

RUN npm install

ENV PATH node_modules/.bin:$PATH


CMD ["vue-cli-service", "serve"]
