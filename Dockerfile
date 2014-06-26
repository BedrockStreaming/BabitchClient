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
RUN apt-get install -y --force-yes x11vnc openjdk-7-jre-headless google-chrome-stable xvfb nodejs xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic

ADD . /var/www/tmp
ADD ./docker/scripts /var/www/scripts

WORKDIR /var/www/tmp

RUN cp docker/config.js.dist app/scripts/config.js

RUN npm install
RUN ./node_modules/.bin/bower install --allow-root

# RUN ./node_modules/.bin/webdriver-manager update
RUN ./node_modules/.bin/grunt build

ADD docker/nginx-vhost.conf /etc/nginx/sites-available/default

RUN mv dist ../prod

WORKDIR /var/www

RUN rm -rf tmp

RUN echo "daemon off;" >> /etc/nginx/nginx.conf

RUN mkdir ~/.vnc

VOLUME ['/var/www/dev']

EXPOSE 21 80

ENV DISPLAY :99

ENV BABITCH_WS_URL http://127.0.0.1:8081/app_dev.php/v1
ENV BABITCH_LIVE_FAYE_URL http://faye-babitch.herokuapp.com/faye
ENV BABITCH_LIVE_FAYE_CHANNEL /test-channel-to-replace
ENV BABITCH_STATS_MIN_GAME_PLAYED 2

CMD ["prod"]

ENTRYPOINT ["/var/www/scripts/starter.sh"]
