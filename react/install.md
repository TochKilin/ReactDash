Role (name, code ,description, status) CRUD Rest API
  - index
  - create
  - show
  - update
  - delete

  > php artisan make:controler RoleControler --api
  > php artisan make:model Role -m
        App\Models\Role
        - protected $fillable = [
                'name',
                'code',
                'description',
                'status',
                'test'
            ];

        - in migrate file role_table
            Schema::create('roles', function (Blueprint $table) {
                //asign field name, data type , null, not null , default , datetime , bool, PK FK relate
                $table->id();
                $table->string("name")->nullable(false);
                $table->string("code");
                $table->text("description");
                $table->boolean("status");
                //$table->boolean("test");
                $table->timestamps();
            });

> php artisan migrate

       - defind route api.php

       //localhost:8000/api/role,metod get
        //role
        Route::get("role",[RoleControler::class,'index']);
        Route::post("role",[RoleControler::class,'store']);
        Route::get("role/{id}",[RoleControler::class,'show']);
        Route::put("role/{id}",[RoleControler::class,'update']);
        Route::delete("role/{id}",[RoleControler::class,'destroy']);

        - RoleControler
            - index
            - create
            - show
            - update
            - delete



