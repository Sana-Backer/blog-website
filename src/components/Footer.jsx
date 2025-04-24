import React from 'react'

const Footer = () => {
  return (
    <>
             <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-6 text-sm text-gray-600">
          <div>
            <h3 className="text-blue-900 font-bold text-xl mb-2">BlogVerse</h3>
            <p>© 2025 blogverse </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">About us</h4>
            <ul className="space-y-1">
              <li>Aonoan mattis</li>
              <li>Vestibulum ante</li>
              <li>Sapien etiam</li>
              <li>Morbi eget leo</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Services</h4>
            <ul className="space-y-1">
              <li>Vestibulum diam</li>
              <li>Phasellus sapien eros</li>
              <li>Finibus bibendum nulla</li>
              <li>Duis tristique turpis</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contact us</h4>
            <p>blogverse@gmail.com</p>
            <p>+91 9087654321</p>
            <div className="flex space-x-2 mt-2">
              <span className="w-6 h-6 bg-gray-300 rounded-full"></span>
              <span className="w-6 h-6 bg-gray-300 rounded-full"></span>
              <span className="w-6 h-6 bg-gray-300 rounded-full"></span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer