 'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import backgroundImage from 'public/Bg.jpg';

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!forgotPassword) {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password, role }),
        });

        if (response.ok) {
          alert('Login successful');
          if (role === 'seller') {
            router.push('/seller');
          } else {
            router.push('/');
          }
        } else if (response.status === 401) {
          alert('Login failed...try again');
        } else if (response.status === 401) {
          alert('Role not recognized');
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred during login.');
      }
    } else {
      try {
        const response = await fetch('/api/auth/changepass', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, newPassword }),
        });

        if (response.ok) {
          alert('Password change successful');
          setForgotPassword(false);
        } else {
          alert('Failed to change password');
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while changing password');
      }
    }
  };

  const handleForgotPassword = () => {
    setForgotPassword(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: "url('/Bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
     <div className="p-8 rounded shadow-lg w-full max-w-md bg-gray-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '10px' }}>
        <h1 className="text-2xl font-semibold mb-4 text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, color:'#888'}}>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-4 text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, color:'#888' }}>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="border p-2 rounded w-full focus:outline-none focus:border-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-4 text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, color:'#888' }}>Password:</label>
            <input
              type="password"
              value={forgotPassword ? newPassword : password}
              onChange={(e) => (forgotPassword ? setNewPassword(e.target.value) : setPassword(e.target.value))}
              placeholder={forgotPassword ? 'New Password' : 'Password'}
              className="border p-2 rounded w-full focus:outline-none focus:border-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-4 text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, color:'#888' }}>Role:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border p-2 rounded w-full focus:outline-none focus:border-white"
            >
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            {forgotPassword ? 'Submit New Password' : 'Log In'}
          </button>
          {!forgotPassword && (
            <button
              onClick={handleForgotPassword}
              className="bg-gray-300 text-gray-700 p-2 rounded w-full mt-2 hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
            >
              Forgot Password?
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
