<?php

use App\Providers\AppServiceProvider;
use App\Providers\FortifyServiceProvider;
use ZohoMail\LaravelZeptoMail\LaravelDriverServiceProvider;

return [
    AppServiceProvider::class,
    FortifyServiceProvider::class,
    LaravelDriverServiceProvider::class,
];
