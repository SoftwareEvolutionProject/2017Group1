FROM maven:3.5.0-jdk-8

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

#Install make
RUN apt-get update
RUN apt-get install -y -q --no-install-recommends make vim postgresql-client
RUN /var/lib/dpkg/info/ca-certificates-java.postinst configure
RUN  export PHANTOMJS_BIN=/usr/local/lib/node_modules/karma-phantomjs-launcher/node_modules/phantomjs/lib/phantom/bin/phantomjs


#Install node and npm
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 6.10.1

# Install nvm with node and npm
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# Set up our PATH correctly so we don't have to long-reference npm, node, &c.
ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

WORKDIR /usr/src/app

ENTRYPOINT bash 
