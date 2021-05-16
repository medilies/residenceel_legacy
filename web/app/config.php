<?php
// E_ERROR | E_WARNING | E_PARSE | E_NOTICE | E_DEPRECATED ...
// error_reporting(0);
// error_reporting(E_ALL & ~E_NOTICE); // default in php.ini
error_reporting(E_ALL);

session_start();

// for includes
define('PROJECT_ROOT', dirname(__DIR__));
// for redirect and href ...
// !!! if URL_ROOT changes .htaccess file must be edited
$URL_ROOT = '';
$SITE_NAME = get_site_name() . $URL_ROOT;
$APP_NAME = 'Gestionnaire des maisons';

date_default_timezone_set('Africa/Algiers');

// webpages language for SEO
$LANG = 'fr';

// fomated as "controller/method" + every controller MUST have an index() method
$DEFAULT_URL = "pages/index";

function get_site_name()
{
    return $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['SERVER_NAME'] . ':' . $_SERVER["SERVER_PORT"];
}
