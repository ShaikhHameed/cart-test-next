'use client';
import { useEffect, useState } from "react";

export default function Home() {
  const [products,setProducts] = useState(null);
  const [filteredProducts,setFilteredProducts] = useState(null);

  useEffect(()=>{
    const fetchProducts = async ()=>{
      const getProducts = await fetch('https://dummyjson.com/carts', {method:'GET'});
      const data = await getProducts.json();
      setProducts(data);
      setFilteredProducts(data);
    }
    fetchProducts();
  },[])

  const sortProducts = (e)=>{
    const sortCarts = filteredProducts.carts.map((cart)=>{
      const sortProducts = [...cart.products];

      switch(e){
        case 'priceLowtoHigh': sortProducts.sort((a,b)=>a.price-b.price); break;
        case 'priceHightoLow': sortProducts.sort((a,b)=>b.price-a.price); break;
        case 'QuantityLowtoHigh': sortProducts.sort((a,b)=>a.quantity-b.quantity); break;
        case 'QuantityHightoLow': sortProducts.sort((a,b)=>b.quantity-a.quantity); break;
        default: break;
      }

      return {
        ...cart,products:sortProducts
      }

    

    })

    setFilteredProducts({cart:sortCarts}) 
  }

  const searchProducts = (name)=>{
      if(!name){
        setFilteredProducts(products);
        return;
      }
      
      const filteredCarts = products.carts.map((cart)=>{
        const filteredGetProducts = cart.products.filter((product)=>{return product.title.toLowerCase().includes(name.toLowerCase())});
        return{
          ...cart,
          products:filteredGetProducts,
        }
      }).filter((a)=>a.products.length>0);

      setFilteredProducts({carts:filteredCarts});
  }

  return (
    <>
      <div className="container mx-auto py-10">
      <div className="grid grid-cols-5">
        <div className="col-span-2">
          <input type='search' className="w-full p-1 px-4 rounded-md active:outline-none focus:outline-none focus:border-gray-600 border border-gray-300 " onChange={(e)=>{searchProducts(e.target.value)}} />
        </div>
        <div ></div>  
        <div ></div>
        <div>
          <select onChange={(e)=>sortProducts(e.target.value)} className="w-full p-1 px-4 rounded-md active:outline-none focus:outline-none focus:border-gray-600 border border-gray-300 ">
            <option value='' selected disabled>Sort By..</option> 
            <option value='priceLowtoHigh'>Sort Price Low to High</option>
            <option value='priceHightoLow'>Sort Price High to Low</option>
            <option value='QuantityLowtoHigh'>Sort Quantity Low to High</option>
            <option value='QuantityHightoLow'>Sort Quantity High to Low</option>
          </select>
        </div>
      </div>
      
      {filteredProducts && filteredProducts.carts.map((cart,index)=>(
        <div className="p-4 rounded-md bg-gray-100 border border-gray-300 my-4" key={index}>
          <span className="bg-green-100 p-2 text-sm font-semibold rounded-md border border-green-200">User ID: {cart.id}</span>
          <div className="flex flex-wrap flex-row gap-4 mt-4">
            <span className="bg-gr  ay-300 p-2 text-sm font-semibold rounded-md border border-gray-400">Total Products: {cart.totalProducts}</span>
            <span className="bg-gray-300 p-2 text-sm font-semibold rounded-md border border-gray-400">Total Quantity: {cart.totalQuantity}</span>
            <span className="bg-gray-300 p-2 text-sm font-semibold rounded-md border border-gray-400">Total Discounts: {cart.discountedTotal}</span>
            <span className="bg-gray-300 p-2 text-sm font-semibold rounded-md border border-gray-400">Total: {cart.total}</span>
          </div>

          <table className="w-full mt-4">
            <thead>
              <tr>
                <td>Id</td>
                <td>Thumbnail</td>
                <td>Title</td>
                <td>Price</td>
                <td>Quantity</td>
              </tr>
            </thead>
            <tbody>

            {cart.products && cart.products.map((product,index)=>(
              <tr key={index}>
                <td>{product.id}</td>
                <td><img height={'100px'} width={'100px'} loading="lazy" src={product.thumbnail} /></td>
                <td>{product.title}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      ))}
      </div>
    </>
  );
}
