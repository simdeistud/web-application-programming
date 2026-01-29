FROM node:latest 
RUN mkdir -p /usr/src/exam-project 
WORKDIR /usr/src/exam-project 
RUN npm install -g nodemon 
COPY ./app/package.json /usr/src/exam-project 
RUN npm install
COPY ./app /usr/src/exam-project 
EXPOSE 3000