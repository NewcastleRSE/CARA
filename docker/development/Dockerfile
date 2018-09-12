FROM node:8

WORKDIR /usr/local/app

RUN apt-get update
RUN apt-get install ruby-full -y
RUN gem update --system
RUN gem install compass

RUN npm install -g grunt-cli bower

EXPOSE 9000

ENTRYPOINT ["tail", "-f", "/dev/null"]
