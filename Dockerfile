FROM stackbrew/ubuntu:saucy

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update -y
RUN apt-get install -y git nginx software-properties-common python-software-properties python g++ make bzip2
RUN apt-add-repository ppa:chris-lea/node.js
RUN apt-get update -y
RUN apt-get install -y nodejs

ADD . /var/www

WORKDIR /var/www

RUN npm install
RUN npm install grunt
RUN npm install -g bower grunt-cli
RUN bower install --allow-root

RUN cp app/scripts/config.js.dist app/scripts/config.js
RUN grunt build

ADD docker/nginx-vhost.conf /etc/nginx/sites-available/default

CMD ["-g", "daemon off;"]
ENTRYPOINT ["/usr/sbin/nginx"]