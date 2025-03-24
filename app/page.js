'use client';
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://dummyjson.com/carts');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Sort products based on selected criteria
  const sortProducts = (criteria) => {
    if (!filteredProducts) return;

    const sortedCarts = filteredProducts.carts.map((cart) => {
      const sortedProducts = [...cart.products];

      switch (criteria) {
        case 'priceLowtoHigh':
          sortedProducts.sort((a, b) => a.price - b.price);
          break;
        case 'priceHightoLow':
          sortedProducts.sort((a, b) => b.price - a.price);
          break;
        case 'QuantityLowtoHigh':
          sortedProducts.sort((a, b) => a.quantity - b.quantity);
          break;
        case 'QuantityHightoLow':
          sortedProducts.sort((a, b) => b.quantity - a.quantity);
          break;
        default:
          break;
      }

      return { ...cart, products: sortedProducts };
    });

    setFilteredProducts({ carts: sortedCarts });
  };

  // Search products by title
  const searchProducts = (name) => {
    if (!name.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filteredCarts = products.carts
      .map((cart) => {
        const matchingProducts = cart.products.filter((product) =>
          product.title.toLowerCase().includes(name.toLowerCase())
        );
        return { ...cart, products: matchingProducts };
      })
      .filter((cart) => cart.products.length > 0);

    setFilteredProducts({ carts: filteredCarts });
  };

  return (
    <div className="container mx-auto py-10">
      {/* Search and Sort Controls */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="col-span-2">
          <input
            type="search"
            placeholder="Search products"
            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:border-gray-600"
            onChange={(e) => searchProducts(e.target.value)}
          />
        </div>
        <div className="col-span-3 flex justify-end">
          <select
            onChange={(e) => sortProducts(e.target.value)}
            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:border-gray-600"
            defaultValue=""
          >
            <option value="" disabled>
              Sort By...
            </option>
            <option value="priceLowtoHigh">Price: Low to High</option>
            <option value="priceHightoLow">Price: High to Low</option>
            <option value="QuantityLowtoHigh">Quantity: Low to High</option>
            <option value="QuantityHightoLow">Quantity: High to Low</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && <h4 className="my-5 text-2xl text-center">Loading...</h4>}

      {/* Display Products */}
      {filteredProducts?.carts?.length > 0 ? (
        filteredProducts.carts.map((cart, index) => (
          <div
            className="p-4 rounded-md bg-gray-100 border border-gray-300 mb-6"
            key={index}
          >
            <span className="bg-green-100 p-2 text-sm font-semibold rounded-md border border-green-200">
              User ID: {cart.userId}
            </span>

            <div className="flex flex-wrap gap-4 mt-4">
              <span className="bg-gray-300 p-2 text-sm font-semibold rounded-md border border-gray-400">
                Total Products: {cart.totalProducts}
              </span>
              <span className="bg-gray-300 p-2 text-sm font-semibold rounded-md border border-gray-400">
                Total Quantity: {cart.totalQuantity}
              </span>
              <span className="bg-gray-300 p-2 text-sm font-semibold rounded-md border border-gray-400">
                Total Discounts: ${cart.discountedTotal}
              </span>
              <span className="bg-gray-300 p-2 text-sm font-semibold rounded-md border border-gray-400">
                Total: ${cart.total}
              </span>
            </div>

            {/* Products Table */}
            <table className="w-full mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Thumbnail</th>
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Price</th>
                  <th className="p-2 text-left">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {cart.products.map((product, productIndex) => (
                  <tr key={productIndex} >
                    <td className="p-2">{product.id}</td>
                    <td className="p-2">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        height={100}
                        width={100}
                        loading="lazy"
                        className="rounded"
                      />
                    </td>
                    <td className="p-2">{product.title}</td>
                    <td className="p-2">${product.price}</td>
                    <td className="p-2">{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        !loading && (
          <h4 className="my-5 text-2xl text-center">No Products Found</h4>
        )
      )}
    </div>
  );
}
