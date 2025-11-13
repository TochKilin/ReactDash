

province (id , name , code , distand_from_city, status)

>php artisan make:model Province -m
    - model Province
    - create_province_table.php

>php artisan migrate

>php artisan make:controller ProvinceController --api

        - index
        - store
        - show
        - update
        - destroy

- api.php
   Route::apiResource('provinces', ProvinceController::class);