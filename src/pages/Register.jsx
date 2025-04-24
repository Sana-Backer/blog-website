import React, { useState } from 'react';
import { registerAPI } from '../Services/AllAPI';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
const RegisterPage = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    phonenumber: '',
    country: ''
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.username && userData.email && userData.password && userData.phonenumber && userData.country) {
      // api call
      try {
        const result = await registerAPI(userData)
        console.log(result);
        if (result.status === 200) {
          toast.success(`Login Successfull!!`);
          setUserData({ username: "", email: "", password: "", phonenumber: "", country: "" });
          navigate('/')
          sessionStorage.setItem('user', JSON.stringify(result.data.newUser));
          sessionStorage.setItem('token', result.data.token);
        }
        else {
          if (result.response.status === 406) {
            toast.error(result.response.data);
            setUserData({ username: "", email: "", password: "", phonenumber: "", country: "" })
          }
        }
      } catch (err) {
        console.log(err);
        toast.error("Registration failed. Please try again.");
      }
    } else {
      toast.warning('Please fill the form completely');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">Register</h2>
        
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={userData.username}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={userData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                id="password"
                name="password"
                type={passwordVisible ? 'text' : 'password'}
                required
                value={userData.password}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md py-2 px-3 pr-10 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  {passwordVisible ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              id="phonenumber"
              name="phonenumber"
              type="tel"
              required
              value={userData.phonenumber}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
            <input
              id="country"
              name="country"
              type="text"
              required
              value={userData.country}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;