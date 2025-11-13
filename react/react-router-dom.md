npm install react-router-dom
configure

>php -v
>composer -v


//run web
cd .\web-react
npm run dev



//plugin react icon
find react icon
npm install react icon

//installl laravel
> composer create-project laravel/laravel laravel-api

run project
cd laravel-api
php artisan serve

build rest api in laravel mysql react
    -connection to mysql in .env file
        -create new database laraveldb-g1 in phpmyadmin
        -in .env
        DB_CONNECTION=mysql
        DB_HOST=127.0.0.1
        DB_PORT=3306
        DB_DATABASE=laraveldb-g1
        DB_USERNAME=root
        DB_PASSWORD=

        -php artisan migrate
    -basic route
    php artisan install:api // case new project no route/api.php

    use Illuminate\support\Facades\Route;
    Route::get('/greeting',function (){
        return'Hello';
    });

    we need to know get,post,put,delete http method
     -param,body
    basic route
        Role (id name code description state created_at,created_at)
    use 
    -controller
       > php artisan make:controller RoleControler --api //use build api
    -model | ORM(Object Relational Mapping) class<-->DB Eloquent
        > php artisan make:model Role -m
        - add column name in App\Model Role
        > php artisan migrate:status
        -add new column:
            >php artisan make:migration add_test_column_table_roles --table=roles

    -ORM
    -CRUD