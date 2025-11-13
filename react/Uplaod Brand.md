Brand
name
code
from_country
image
status

> php artisan make:model Brand -m
> php artisan make:controller BrandController --api

- File Storage Contfiguration

  1. Ensure your application in set up to handle file upload: inthe .evn file,set the FILESYSTEM_DISk to public:
     FILESYSTEM_DISk=public

  2. Run the command to ceate the storage:
     > php artisan storage:link
     > this command will the storage/app/public directory accessible from the public/storage URL.

==================Handle the image uplo======

======create the brand
//create the brand
$brand = Brand::create([
'name' => $request->name,
'code' => $request->code,
'from_country' => $request->from_country,
'image' => $imagePath,
'status' => $request->status,
]);

public function up(): void
{
Schema::create('brands', function (Blueprint $table) {
$table->id();
$table->string('name');
$table->string('code')->unique();
$table->string('from_country');
$table->string('image')->null();
$table->enum('status',['active','inactive'])->default('active');
$table->timestamps();
});
}

> php artisan migrate
> add route
