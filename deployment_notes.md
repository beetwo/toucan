# Toucan on Digital Ocean

- get a droplet
- log in to the droplet
- run `apt-get update && apt-get upgrade && apt-get dist-upgrade`

- I had problems with resolving the apt repository hostnames, this fixed it
  `chmod o+r /etc/resolv.conf `

postgresql
postgis
redis-server
git
build-essential
python3-dev
python3-venv
uwsgi-emperor
uwsgi-plugin-python3
nginx

