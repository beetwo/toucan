# B2 Issue Tracker

A geographic issue tracker with some real time functionality.

## Installation

### Prerequisites

- [Python 3](https://www.python.org/)
- [PostgreSQL](https://www.postgresql.org/) (>=9.4)
- [PostGIS](http://postgis.net/)
- [Redis](http://www.redis.io)
- [Node.js](https://nodejs.org)

### Dependencies

The backend assumes a working python environment with the packages listed in requirements.txt installed.

First create and activate a virtual environment by issuing the following commands in the project directory:

```
virtualenv b2it
source b2it/bin/activate
```

Then install the requirements into the virtual environment:

```
pip install -r requirements.txt
```

Under Linux it might be necessary to install additional dev-packages such as `libjpeg-dev`, `zlibc`, `python3.4-dev` and `libpg-dev` because the installation of some python dependencies involve the compilation of C-code.

### Set a secret key

```
cp issue_tracker/settings/secrets.example.py issue_tracker/settings/secrets.py
```

Open `issue_tracker/settings/secrets.py` and set `SECRET_KEY` to some string.

### Database

The application requires a PostgreSQL installation (>=9.4) with a database named `issues-tracker`. Configure the database connection by extending the `DATABASES` object in `issues_tracker/settings/__init__.py`:

```
DATABASES = {
  'default': {
    'ENGINE': 'django.contrib.gis.db.backends.postgis',
    'NAME': 'issues-tracker',
    'USER': 'postgres',
    'PASSWORD': 'postgres',
    'HOST': 'localhost',
    'PORT': 5434
  }
}
```

To create the database scheme run the migrations (requires PostgreSQL superuser rights to install the postgis extension):

```
./manage.py migrate
```

### Build Frontend

The frontend part of the code is to be found in the 'frontend' folder. To install the build tools and dependencies of the frontend issue the following command from within that folder:

```
npm install
```

Finally build the frontend assets

```
npm build-dev
```


## Development

### Frontend

Start the development server so that the frontend is automatically rebuilt when a file is modified.
In the ./frontend folder run the following command

```
npm run dev
```


For fearless frontend developers there is also the option to enable hot module replacement.
```
npm run hmr
```

This will start a server to do the static file hosting on 127.0.0.1:8080 and skip the django dev server for the built frontend files.


### Backend

Make sure you have activated the virtual environment:

```
source b2it/bin/activate
```

Make sure a Redis server is running and listening on port 6379.

Start the application server:

```
./manage.py runserver --settings=issue_tracker.settings.dev
```

You should be able to access the application now at http://localhost:8000.
