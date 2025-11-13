

category (id name decription status parent_id)

> php artisan make:model Category -mcr
> php artisan make:controller CategoryController api//not    work
> php artisan make:conctroller CategoryController --api
   -m: Creare a migration file for thr employees table (located in database/migrateions).

   -c: Create a controller (in app/Http/Controller) named EmployyeController.

   -r: Indicates that the controller will be a resource controller, with all CRUD methods (index, store, show, update, destroy,) 
   Route::apiResource('categorys', categoryController::class);


   storage/logs/laravel.log