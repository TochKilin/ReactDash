Brand
name
code
from_country
image
status

> php artisan make:model Brand -m
> php artisan make:controller BrandController --api

- File Storage Configuration
  1. Ensure your application is set up to handle file upload: in the .env file, set FILESYSTEM_DISK to public: FILESYSTEM_DISK-public
  2. Run the command to create a symbolic link for public storage:
     > php artisan storage:link
     - This command will make the storage/app/public directory accessible from the public/storage URL.
