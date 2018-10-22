FROM node:carbon as frontend

WORKDIR /code/
COPY ./frontend/package.json frontend/yarn.lock ./
RUN yarn install
COPY ./frontend ./
RUN yarn build

FROM python:3.6
ENV PYTHONUNBUFFERED 1

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y libpq-dev binutils libproj-dev gdal-bin && \
    apt-get autoremove && \
    apt-get autoclean


VOLUME /toucan
WORKDIR /toucan
COPY Pipfile* ./
RUN ["pip", "install", "pipenv"]
RUN ["pipenv", "install", "--system"]

COPY ./ .
RUN ["python", "manage.py", "collectstatic", "--no-input"]

# copy built frontend files to toucan container
COPY --from=frontend /code/production /toucan/frontend/production

WORKDIR /toucan

