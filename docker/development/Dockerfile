FROM node:8
SHELL [ "/bin/bash", "-l", "-c" ]

WORKDIR /usr/local/app

RUN echo "deb http://archive.debian.org/debian stretch main" > /etc/apt/sources.list
RUN gpg --keyserver keyserver.ubuntu.com --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB

RUN apt-get update

RUN \curl -sSL https://get.rvm.io | bash -s stable --ruby
# RUN rvm install 2.5
# RUN rvm use 2.5

RUN gem install compass

RUN npm install -g grunt-cli bower

EXPOSE 9000
EXPOSE 35729

ENTRYPOINT ["tail", "-f", "/dev/null"]
