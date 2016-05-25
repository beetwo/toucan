# B2 Issue Tracker

A geographic issue tracker with some real time functionality.

## Getting started

### Backend

The backend assumes a working python environment with the packages listed in requirements.txt installed.

The following commands should get you started
```
virtualenv b2it
source b2it/bin/activate
pip install -r requirements.txt
```

The settings in issue_tracker/settings/ currently assume a postgresql database 
backend (because we make use of JSON fields types) and a running redis 
server.

```
./manage.py runserver --settings=issue_tracker.settings.dev
```


### Frontend

The frontend part of the code is to be found in the 'frontend' folder.
For development a
 
```
webpack --watch
```

executed in that folder should suffice. When running the runserver command above 
with the development settings the files generated in this step should 
be picked up automatically 