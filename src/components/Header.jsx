import React, { useState, useRef, useEffect } from 'react';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const token = sessionStorage.getItem('token');
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setDropdownOpen(false);
    window.location.href = '/';
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-900">BlogVerse</h1>
        <div className="flex items-center space-x-6 text-sm font-medium relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-900 hover:bg-blue-200">
            <User className="w-5 h-5" />
          </button>

          {/* Dropdown  */}
          {dropdownOpen && (
            <div className="absolute top-14 right-0 w-40 bg-white shadow-lg rounded-md py-2 z-50">


              {token ?
                <>

                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-100">
                    LogOut
                  </button>

                </>
                : <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">
                  Sign Up
                </Link>}

            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
