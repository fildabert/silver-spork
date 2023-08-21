FROM node:16.16.0

# Install required tools and libraries
RUN apt-get update && apt-get install -y wget cabextract fontconfig

# Create a directory to store fonts
RUN mkdir -p /usr/share/fonts/truetype/arial

# Download Arial font files
RUN wget -O /usr/share/fonts/truetype/arial/arial32.exe https://downloads.sourceforge.net/project/corefonts/the%20fonts/final/arial32.exe

# Extract font from the downloaded file
RUN cabextract -d /usr/share/fonts/truetype/arial /usr/share/fonts/truetype/arial/arial32.exe

# Update font cache
RUN fc-cache -f -v

WORKDIR /usr/src/app

# RUN apt-get update && apt-get -y install ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils

# RUN apt-get install chromium -y

# ENV DEBUG="puppeteer:*"

RUN apt-get update \
    && apt-get install -y chromium \
    libxss1 \
    --no-install-recommends

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium


COPY package-lock.json /usr/src/app/package-lock.json
COPY package.json /usr/src/app/package.json

RUN npm install


COPY . /usr/src/app/
EXPOSE 3000-3010
