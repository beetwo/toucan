## Local Installation

*This guide assumes a working knowledge of command line usage and familiarity with python tooling*

### Prerequisites for a local installation.

- [Python 3](https://www.python.org/)
- [Pipenv](https://pipenv.readthedocs.io/en/latest/)
- [PostgreSQL](https://www.postgresql.org/) (>=9.4)
- [PostGIS](http://postgis.net/)
- [Redis](http://www.redis.io)
- [Node.js](https://nodejs.org)

### Backend Dependencies

To install the required packages change into the project directory and execute 
```
pipenv install
```

This command creates the virtual environment and installs all dependencies. To 
activate the created environment type:

```
pipenv shell
```

Under Linux it might be necessary to install additional dev-packages
such as `libjpeg-dev`, `zlibc`, `python-dev` and `libpg-dev` through your 
distributions package manager. 


### Set a secret key

```
cp toucan_conf/settings/secrets.example.py toucan_conf/settings/secrets.py
```

Open `toucan_conf/settings/secrets.py` and set `SECRET_KEY` to some string.

### Load the default categories

While not required it is strongly suggested to add some default 
categories for your installation. These can be added to/changed/deleted 
from the administrative interface. 

```
./manage.py loaddata toucan/fixtures/issueTypes.json
```
### Database

The application requires a PostgreSQL installation (>=9.4) with a 
database named `toucan`. Configure the database connection by extending 
the `DATABASES` object in `issues_tracker/settings/__init__.py`:

```
DATABASES = {
  'default': {
    'ENGINE': 'django.contrib.gis.db.backends.postgis',
    'NAME': 'toucan',
    'USER': 'postgres',
    'PASSWORD': 'postgres',
    'HOST': 'localhost',
    'PORT': 5434
  }
}
```

To create the database scheme run the migrations (this might require 
PostgreSQL superuser rights to install the postgis extension):

```
./manage.py migrate
```

### Build Frontend

The frontend part of the code is to be found in the 'frontend' folder. 
To install the build tools and dependencies of the frontend issue the 
following commands from within that folder.

Note: use either the yarn or the npm commands, both should result in 
the same packages being installed.

```
npm install
```
or
```
yarn install
```

Finally build the frontend assets

```
npm run build-dev
```
or
```
yarn build-dev
```


## Development

### Frontend

Start the development server so that the frontend is automatically 
rebuilt when a file is modified.
In the ./frontend folder run the following command

```
npm run dev
```

or

```
yarn dev
```


For fearless frontend developers there is also the option to enable hot 
module replacement.
```
npm run hmr
```

or

```
yarn hmr
```

This will start a server to do the static file hosting on 
127.0.0.1:8080 and skip the django dev server for the built frontend 
files.


### Frontend Maps

By default the [openstreetmaps service](https://www.openstreetmap.org) 
is used as the tile source for the mapping components.

If you intend to use mapbox tiles during development create a 
```.env``` file inside the frontend folder and add a line similar to 
this one to it:

```
MAPBOX_API_KEY=<mapbox-api-key>
```

The API key can be found inside your mapbox account's settings.

### Backend

Make sure you have activated the virtual environment:

```
source env/bin/activate
```

Make sure a Redis server is running and listening on port 6379.

Start the application server with development settings:

```
./manage.py runserver --settings=toucan_conf.settings.dev
```

You should be able to access the application now at 
http://127.0.0.1:8000.
