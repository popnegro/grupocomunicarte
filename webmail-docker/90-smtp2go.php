<?php
/**
 * Custom Roundcube SMTP2GO configuration.
 * SMTP credentials must be provided by the hosting environment.
 */
$config['smtp_server'] = 'tls://mail.smtp2go.com';
$config['smtp_port'] = 2525;
$config['smtp_user'] = getenv('SMTP_USERNAME') ?: '';
$config['smtp_pass'] = getenv('SMTP_PASSWORD') ?: '';
