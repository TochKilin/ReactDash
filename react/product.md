Product(id,category_id,prodduct_name,desription,quantity,price,image,status)

> php artisan make:model Product -m
> php artisan make:controller PoductController --api

- In migrate

public function up()
{
Schema::create('products',function(Blueprint $table){
$table->id();
$table->unsignedBigInteger('category_id');
$table->unsignedBigInteger('brand_id');
$table->string('product_name');
$table->text('description')->nullable();
$table->integer('quantity');
$table->decimal('price', 10, 2);
$table->string('image')->nullable();
$table->boolean('status')->default(1);
$table->timestamps();

$table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
$table->foreign('brand_id')->references('id')->on('brands')->onDelete('cascade');

});

}

- in Model
  protected $fillable = [
  'category_id',
  'brand_id',
  'product_name',
  'description',
  'quantity',
  'price',
  'image',
  'status'

]

- in controller

class ProductController extends Controller
{

// list all product
public function index()
{
return Product::with(['category','brand'])->get();
}

    //Store a new product
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'required|exists:brands,id',
            'product_name' => 'required|string',
            'description' => 'nullable|string',
            'quantity' => 'required|integer',
            'price' => 'required|numeric',
            'image' => 'nullable|image|max:2048'
            'status' => 'boolean'
        ]);

        $data = $request->all();
        if($request->hasFile('image')){
            $data['image'] = $request->file('image')->store('products','public');
        }
        $product = Product::create($data);
        return response()->json($product, 201);
    }

    // show a single product
    public function show(string $id)
    {
        //
        $product = Product::find($id);
        //return $product->load(['category','brand']);
        return response()->json([
            "data" =>  $product->load(['category','brand'])
        ]);
    }

    //update an existing product
    public function update(Request $request, Product $product)
    {
      $request->validate([
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'required|exists:brands,id',
            'product_name' => 'required|string',
            'description' => 'nullable|string',
            'quantity' => 'required|integer',
            'price' => 'required|numeric',
            'image' => 'nullable|image|max:2048'
      ]);

      $data = $request->all();
      if($requst->hasFile('image')){
        if($product->image){
          Storage::disk('public')->delete($product->image);
        }
        $data['image'] = $request->file('image')->store('products','public');
      }
    }


    // delete a product
    public function destroy(Product $product)
    {
      if($product->image){
        Storage::disk('public')->delete($product->image);
      }
      $product->delete();
      return response()->json(null, 204);
    }

}

- Relationship Category Product
  - in Category
    // one Category has many Products
    public function products()
    {
    return $this->hasMany(Product::class);
    }
  - in Brand
    //One Brand has many Products
    public function products()
    {
    return $this->hasMany(Product::class);
    }
  - in Product
    // one product belongs to one Category
    public function category()
    {
    return $this->belongTo(Category::class);
    }
    public function brand()
    {
    }
