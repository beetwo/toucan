# Change this to a nice long string
SECRET_KEY = 'verySecretKey'

ADMINS = [
    ('<name>', '<admin email address>'),
]

MANAGERS = ADMINS

# Emails are at least used for user auth flow
EMAIL_HOST = ''
EMAIL_HOST_USER = ''
EMAIL_HOST_PASSWORD = ''
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True


DEFAULT_FROM_EMAIL = 'do-not-reply@example.com'

# a list of values that represent your FQDNs
ALLOWED_HOSTS = [
    '127.0.0.1',  # replace this with your real domain name
]

ANYMAIL = {
    # (exact settings here depend on your ESP...)
    "MAILGUN_API_KEY": "<your Mailgun key>",
    "MAILGUN_SENDER_DOMAIN": 'mg.example.com',  # your Mailgun domain, if needed
}

# NEXMO = {
#   'key': 'key',
#   'secret': 'secret'
# }
#
# RAVEN_DSN = 'sentry dsn url'
#

