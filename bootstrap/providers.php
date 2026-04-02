<?php

use App\Providers\AppServiceProvider;
use App\Providers\FortifyServiceProvider;
use App\Providers\TenancyServiceProvider;
use ZohoMail\LaravelZeptoMail\LaravelDriverServiceProvider;

return [
    AppServiceProvider::class,
    FortifyServiceProvider::class,
    TenancyServiceProvider::class,
    LaravelDriverServiceProvider::class,
];
