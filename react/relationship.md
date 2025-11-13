1-1 Relationship

user
name
email
password

profile
user_id(FK)
phone
address
image
type

    /////tupe(sytem | GENERATE)

> php artisan make:model User -m
> php artisan make:model Profile -m

> php artisan make:controller AuthController --api

- Migration
  +----user_table.php
  public function up()
  {
  Schema::create('user', function(Blueprint $table){
  $table->id();
  $table->string('name');
  $table->string('email')->unique();
  $table->string('password');
  $table->timestamps();
  });
  }

  +profle.php
  public function up(): void
  {
  Schema::create('profiles', function (Blueprint $table) {
  $table->id();
  $table->bigInteger('user_id')->unique(); //one-to-one relationship
  $table->string('phone')->nullable();
  $table->string('address')->nullable();
  $table->string('image')->nullable();
  $table->string('type')->nullable(); //e.g., 'SYSTEM', 'GENERAL'
  $table->timestamps();

            //Forign Key constraint
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            // cascade
            $table->timestamps();
        });

  }

+Model/profile.php
class Profile extends Model
{
use HasFacory;
protected $fillable = [
'user_id',
'phone',
'address',
'image',
'type',
]
// one-to-one relationship with user
public function user()
{
return $this->belongsTo(User::class);
}
}
