'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation';


// const CartItem = ({ product, removeFromCart }) => (
//   <li key={product.id} className="flex py-6">
//     <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
//       <img
//         src={product.image1}
//         alt={product.name}
//         className="h-full w-full object-cover object-center"
//       />
//     </div>

//     <div className="ml-4 flex flex-1 flex-col">
//       <div>
//         <div className="flex justify-between text-base font-medium text-gray-900">
//           <h3>
//             <a href={`/product/${product.productId}`}>{product.name}</a>
//           </h3>
//           <p className="ml-4">{product.price}</p>
//         </div>
//       </div>
//       <div className="flex flex-1 items-end justify-between text-sm">
//         <p className="text-gray-500">Qty {product.quantity}</p>

//         <div className="flex">
//           <button
//             type="button"
//             className="font-medium text-indigo-600 hover:text-indigo-500"
//             onClick={() => removeFromCart(product.productId)}
//           >
//             Remove
//           </button>
//         </div>
//       </div>
//     </div>
//   </li>
// );

const Cart = ({ setOpen, open }) => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  // Function to remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const response = await fetch('/api/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId }),
      });

      if (response.ok) {
        // If item removed successfully, update cart items
        const updatedCart = cartItems.filter((item) => item.productId !== productId);
        setCartItems(updatedCart);

        const total = updatedCart.reduce((acc, product) => acc + product.price * product.quantity, 0);
        setSubtotal(total);
      } else {
        console.error('Failed to remove item from cart.');
      }
    } catch (error) {
      console.error('An error occurred while removing item from cart:', error);
    }
  };

  useEffect(() => {
    async function fetchCartData() {
      try {
        const response = await fetch('/api/cart');

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


  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">Shopping cart</Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul role="list" className="-my-6 divide-y divide-gray-200">
                          {cartItems.map((product) => (
                          <li key={product.id} className="flex py-6">
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
                                  <h3>
                                    <a href={`/product/${product.productId}`}>{product.name}</a>
                                  </h3>
                                  <p className="ml-4">{product.price}</p>
                                </div>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <p className="text-gray-500">Qty {product.quantity}</p>
  
                                <div className="flex">
                                  <button
                                    type="button"
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                    onClick={() => removeFromCart(product.productId)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>Rs.{subtotal}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                      <div className="mt-6">
                        <a
                          href="/checkout"
                          className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                          Checkout
                        </a>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or
                          <button
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                            onClick={() => setOpen(false)}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}


const Nav = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [session, setSession] = useState(null)

  useEffect(() => {
    const fetchData = async()=>{
      const res = await fetch('/api/auth/session');
      if(res.ok){
        const user = await res.json();
        setSession(user);
      }
    }
    fetchData();
  }, [router]);

  console.log(session);
  

  const handleLogout = async()=>{
    try {
      const response = await fetch('/api/auth/logout')
      if(response.ok){
        console.log("Logged Out successfully")
        router.push('/auth/login')
      }
    } catch (error) {
      console.log("Internal server error")
    }
  }
  
  return (
    <nav className="w-full bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <p className="text-xl font-bold">Health Hub</p>
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/user" className="hover:text-gray-300 border px-3 py-1 rounded-full">
              <p>User Profile</p>
            </Link>
            {session===null ? 
              (
                <>
                  <Link href="/auth/login" className="hover:text-gray-300 ">
                    <p>Sign in</p>
                  </Link>
                  <Link href="/auth/register" className="hover:text-gray-300">
                    <p>Register</p>
                  </Link>
                </>
              ): (
                <>
                  <button onClick={handleLogout} className="hover:text-gray-300">
                    <p>Logout</p>
                  </button>
                </>
              )
            }
            <button onClick={() => setOpen((prev) => !prev)} className="border px-3 py-1 rounded-full hover:text-gray-300">
              Cart
            </button>
        </div>
      </div>
      {setOpen && <Cart setOpen={setOpen} open={open}/>}
    </nav>
    
    )
}

export default Nav