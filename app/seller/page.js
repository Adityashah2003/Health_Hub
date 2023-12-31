'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Seller = () => {
  const [productName, setProductName] = useState('');
  const [productID, setProductID] = useState('');
  const [categoryID, setCategoryID] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [quantity, setQuantity] = useState('');

  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/seller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productName,
          productID,
          categoryID,
          price,
          description,
          imageLink 
        }),
      });

      if (response.ok) {
        alert('Product Added successful');
        router.push('/');
      } else if (response.status === 500) {
        alert('Failed....try again');
      }
    } catch (error) {
      console.error(error);
      alert('Internal Server Error');
    }

    console.log('Form submitted with the following data:', {
      productName,
      productID,
      categoryID,
      price,
      description,
      imageLink,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url('/mainBg.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
    <div className="p-8 rounded-lg shadow-lg w-full max-w-md bg-gray-100" style={{ backgroundColor: 'rgba(200, 200, 200, 0.9)', borderRadius: '10px' }}>
      <h1 className="text-2xl font-semibold mb-4 text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, color: '#888' }}>Seller Form</h1>
     <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Product Name:</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="border p-2 rounded w-full focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Product ID:</label>
            <input
              type="number"
              value={productID}
              onChange={(e) => setProductID(e.target.value)}
              className="border p-2 rounded w-full focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Category ID:</label>
            <input
              type="number"
              value={categoryID}
              onChange={(e) => setCategoryID(e.target.value)}
              className="border p-2 rounded w-full focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border p-2 rounded w-full focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border p-2 rounded w-full focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded w-full focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Image Link:</label>
            <input
              type="text"
              value={imageLink}
              onChange={(e) => setImageLink(e.target.value)}
              className="border p-2 rounded w-full focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Submit
          </button>
        </form>
        <br />
        <button
          onClick={handleGoBack}
          className="bg-gray-500 text-white p-2 rounded w-full hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Seller;