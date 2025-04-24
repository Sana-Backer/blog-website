import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { loginAPI } from '../Services/AllAPI'; // You should have this API function set up

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginData;

    if (email && password) {
      try {
        const result = await loginAPI(loginData);
        console.log(result);

        if (result.status === 200) {
          toast.success(`Welcome back, ${result.data.user.username}!`);
          setLoginData({ email: '', password: '' });
          navigate('/'); 
          sessionStorage.setItem('user', JSON.stringify(result.data.user));
            sessionStorage.setItem('token', result.data.token);
        } else {
          toast.error(result.response.data);
        }
      } catch (err) {
        toast.error("Login failed. Please try again.");
      }
    } else {
      toast.warning('Please fill in all fields');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={loginData.email}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <input
                id="password"
                name="password"
                type={passwordVisible ? 'text' : 'password'}
                required
                value={loginData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute inset-y-0 right-2 text-sm text-indigo-500"
              >
                {passwordVisible ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-medium transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
