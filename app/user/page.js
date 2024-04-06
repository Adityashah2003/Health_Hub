'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const User = () => {
  const [allData, setAllData] = useState({});
  const router = useRouter();
  const [session, setSession] = useState()

  useEffect(() => {
    const fetchData = async ()=>{
      const res = await fetch('/api/auth/session');
      if(res.ok){
        const user = await res.json();
        console.log("User: ", user)
        setSession(user);
      }
      else{
        router.push('/auth/login');
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchUserData(){
      try {
        const response = await fetch('/api/user');
        if(response.ok){
          const data = await response.json();
          setAllData(data);
        }
        else{
          console.error('Failed to fetch user data.');
        }
      } catch (error) {
        console.error('An error occurred while fetching user data:', error);
      }
    }
    fetchUserData();
  }, [])
  
  if(!session){
    return <div className="p-24 text-center">Loading...</div>;
  }
  
  const userInfo = allData.customer_info;
  const orderHistory = allData.order_history;
  const allReviews = allData.user_reviews;

  return (
    <div className="min-h-screen flex items-center justify-center m-16" >
    <div className="p-8 rounded-lg shadow-lg w-full max-w-screen-xl bg-gray-100" style={{ backgroundColor: 'rgba(200, 200, 200, 0.9)', borderRadius: '10px' }}>
      <h1 className="text-4xl font-bold mb-4 text-black text-center">User Dashboard</h1>

      <div className="mb-16">
      <h2 className="text-xl font-semibold mb-4 text-black">User Information</h2>
          {userInfo &&
             <ul className="text-gray">
              <li>Username: {userInfo.username}</li>
              <li>Email: {userInfo.email}</li>
              <li>Delivery Address: {userInfo.delivery_addr}</li>
            </ul>
          }
        </div>

        <div className="mb-24">
          <h2 className="text-xl font-semibold mb-4 text-black">Order History</h2>
          <div className='grid grid-cols-4 gap-10'>
            {orderHistory && orderHistory.map((product, index)=>(
              <div key={index} className="text-gray mb-4 p-5 py-10 bg-white rounded-xl">
                <img
                  src={product.image1}
                  alt={product.name}
                  className="h-full w-full object-cover object-center rounded-lg"
                />
                <div className='flex justify-between px-2'>
                  <Link href={`/product/${product.productId}`} className='text-md font-semibold'>{product.name}</Link>
                  <p className='text-sm'>Rs. {product.price}</p>
                </div>
                <br/>
              </div>
            ))}
          </div>
        </div>
  
        <div>
        <h2 className="text-xl font-semibold mb-4 text-black">User Reviews</h2>
          {allReviews && allReviews.map((review, index) => (
            <div key={index} className="mb-4">
              <Link href={`/product/${review.productId}`} className='text-black'>{review.description}</Link>
              <p className='text-gray font-semibold'>Rating: {review.rating}/5</p>
              <br/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );  
};

export default User;
