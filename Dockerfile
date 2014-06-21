FROM stackbrew/ubuntu:saucy

ENV DEBIAN_FRONTEND noninteractive

MAINTAINER Kenny DITS "kenny.dits@m6.fr"
MAINTAINER Jérémy JOURDIN "jjourdin.externe@m6.fr"

RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install -y wget git nginx software-properties-common python-software-properties python g++ make bzip2
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
RUN apt-add-repository ppa:chris-lea/node.js
RUN apt-get update -y
RUN apt-get install -y screen x11vnc openjdk-7-jre-headless google-chrome-stable xvfb nodejs xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic

ADD . /var/www

WORKDIR /var/www

RUN cp app/scripts/config.js.dist app/scripts/config.js

RUN npm install
RUN ./node_modules/.bin/bower install --allow-root

RUN ./node_modules/.bin/grunt build

ADD docker/nginx-vhost.conf /etc/nginx/sites-available/default

RUN echo "daemon off;" >> /etc/nginx/nginx.conf

RUN mkdir ~/.vnc

EXPOSE 80 5999

ENV DISPLAY :99

CMD ["prod"]

ENTRYPOINT ["/var/www/docker/starter.sh"]
