FROM node:carbon as frontend

WORKDIR /code/
COPY ./frontend/package.json frontend/yarn.lock ./
RUN yarn install
COPY ./frontend ./
RUN yarn build

FROM python:3.6
ENV PYTHONUNBUFFERED 1
VOLUME /toucan
WORKDIR /toucan
COPY Pipfile* ./
RUN ["pip", "install", "pipenv"]
RUN ["pipenv", "install", "--system"]
COPY ./ ./

# copy built frontend files to toucan container
COPY --from=frontend /code/production /toucan/frontend/production

WORKDIR /toucan

