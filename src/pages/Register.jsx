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
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl border border-gray-200">
          <h2 className="text-4xl font-bold text-center text-indigo-700 mb-6 tracking-tight">
            Register
          </h2>
    
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={userData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm shadow-sm"
              />
            </div>
    
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={userData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm shadow-sm"
              />
            </div>
    
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={passwordVisible ? 'text' : 'password'}
                  required
                  value={userData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm shadow-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-indigo-600 hover:underline"
                >
                  {passwordVisible ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
    
            <div>
              <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phonenumber"
                name="phonenumber"
                type="tel"
                required
                value={userData.phonenumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm shadow-sm"
              />
            </div>
    
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                required
                value={userData.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm shadow-sm"
              />
            </div>
    
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow transition duration-200"
            >
              Register
            </button>
          </form>
    
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600 font-semibold hover:underline">
              Login here
            </a>
          </div>
        </div>
      </div>
    
  );
};

export default RegisterPage;