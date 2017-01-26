ADMINS = [
    ('Sean', 'sean@brickwall.at'),
]
MANAGERS = ADMINS

SECRET_KEY = '1pm3%d3*=q#e4j3(v(o9+(a+*8ju1f5kxlw&g4h)yd3u%uu8f^'


NEXMO = {
  'key': '55e9fa43',
  'secret': '5537eda1'
}

RAVEN_DSN = 'https://1605c6ba7a9a4343863509b87cbb1034:f8e19960f72a435dbeaaaf1ccd5a48c3@sentry.brickwall.at/6'

OPBEAT = {
  'ORGANIZATION_ID': 'af2402d0c17c4c5487c73ddc26691ae1',
  'APP_ID': '665f356411',
  'SECRET_TOKEN': 'f5d22e2d879813223cfc88431e2e762fb32d45b9',
}

ALLOWED_HOSTS = [
    '127.0.0.1',
]

ANYMAIL = {
    "MAILGUN_API_KEY": "key-de114b88b5d49724150f96dbaa8c73d4",
    "MAILGUN_SENDER_DOMAIN": 'mg.brickwall.at',
}
