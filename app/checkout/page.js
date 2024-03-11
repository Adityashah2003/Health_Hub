'use client'
  import React, { useState, useEffect } from 'react';
  import Del from '@/components/Del';

  const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
      async function fetchCartData() {
        try {
          const response = await fetch('/api/checkout');
  
          if (response.ok) {
            const data = await response.json();
            setCartItems(data);
  
            const total = data.reduce((acc, product) => acc + product.price * product.quantity, 0);
            setSubtotal(total);
          } else {
            console.error('Failed to fetch cart data.');
          }
        } catch (error) {
          console.error('An error occurred while fetching cart data:', error);
        }
      }
  
      fetchCartData();
    }, []);
  
    const handlePlaceOrder = async () => {
      try {
        const response = await fetch('/api/placeorder');        
  
        if (response.ok) {
          setOrderPlaced(true);
          console.log("Order placed successfully.");
          // Call handleFetchDeliveryDetails after order is placed
          handleFetchDeliveryDetails();
        } else {
          console.error('Failed to place the order.');
        }
      } catch (error) {
        console.error('An error occurred while placing the order:', error);
      }
    };
  
    const handleFetchDeliveryDetails = async () => {
      try {
        const response = await fetch('/api/delivery', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const orderDetails = await response.json();
          setOrderDetails(orderDetails); // Store order details in state
          setIsModalOpen(true);  // Store order details in state
          console.log('Order details fetched successfully.');
        } else {
          console.error('Failed to fetch order details.');
        }
      } catch (error) {
        console.error('An error occurred while fetching order details:', error);
      }
    };
    const closeModal = () => {
      setIsModalOpen(false);
    };
  
    return (
      <div>
        <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="flex items-start justify-between">
              <h1 className="text-lg font-medium text-gray-900">Shopping cart</h1>
            </div>
            <div className="mt-8">
              <div className="flow-root">
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {cartItems.map((product) => (
                    <li key={product.p_id} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={product.image1}
                          alt={product.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
  
                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{product.name}</h3>
                            <p className="ml-4">{product.price}</p>
                          </div>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <p className="text-gray-500">Qty {product.quantity}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          {orderPlaced ? (
        <>
          <p className="text-green-600 text-lg font-medium">Order Placed Successfully!</p>
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Order Details</h2>
            {orderDetails && (
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-gray-800">Check Delivery and Payment details
                </p>
                
              </div>
            )}
          </div>
          {isModalOpen && (
            <Del isOpen={isModalOpen} closeModal={closeModal} orderDetails={orderDetails} />
          )}
        </>
      ) : (
              <>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>Rs. {subtotal.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                  <button
                    onClick={handlePlaceOrder}
                    className="flex justify-center w-half px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 bg-black"
                  >
                    Place order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default CartPage;