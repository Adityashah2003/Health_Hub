'use client'
import { useEffect, useState } from 'react';

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products'); // Assuming you create a new API route named 'products'
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Failed to fetch products.');
        }
      } catch (error) {
        console.error('An error occurred while fetching products:', error);
      }
    }

    fetchProducts();
  }, []);

  if(!products){
    return <div>Loading...</div>
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Our Products</h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.p_id} className="group relative border p-5 rounded-xl">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img
                  src={product.image1}
                  alt={product.p_name}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-900 font-semibold">
                    <a href={`/product/${product.p_id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.p_name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                  <p className="mt-3 text-sm text-gray-700">{`Rs ${product.price}`}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}