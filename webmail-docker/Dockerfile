FROM roundcube/roundcubemail:latest

# Inject SMTP2GO credentials into Roundcube's effective configuration.
# Credentials remain environment variables and are never committed to Git.
COPY 90-smtp2go.php /var/roundcube/config/90-smtp2go.php
