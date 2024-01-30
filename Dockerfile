FROM python:3.11-slim-buster
FROM node:16

COPY ./requirements.txt .
COPY ./package.json .

RUN pip install -r requirements.txt
RUN npm install .
RUN npm run build

COPY . .