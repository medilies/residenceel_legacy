<?php
/**
 * Main file
 */

// all configs and constants loaded before any action :D
require_once '../app/config.php';
require_once '../app/bootstrap.php';
require_once '../app/vendor/autoload.php';

new Router;
