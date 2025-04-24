import React, { useState } from 'react';
import { addPostAPI } from '../Services/AllAPI';
import toast from 'react-hot-toast';

const AddPost = ({getUserPost}) => {
    const [isOpen, setIsOpen] = useState(false); // Modal open state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'title') setTitle(value);
        if (name === 'content') setContent(value);
        if (name === 'category') setCategory(value);
    };

    // Handle image upload
    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    // Handle post submission
    const handlePost = async (e) => {
        e.preventDefault();
    
        if (!title || !content || !category) {
            alert('Please fill in all fields');
            return;
        }
    
        setLoading(true);
        setError(null);
    
        // Get the logged-in user ID from sessionStorage
        const user = JSON.parse(sessionStorage.getItem('user'));
        const author = user?._id;
    
        if (!author) {
            setError("User not found. Please login again.");
            setLoading(false);
            return;
        }
    
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('category', category);
        formData.append('author', author);  // Add author to formData
        if (image) formData.append('image', image);
    
        try {
            const response = await addPostAPI(formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
    
            if (response.status === 201) {
                toast.success('Post created successfully!');
                getUserPost()
                setTitle('');
                setContent('');
                setCategory('');
                setImage(null);
                setIsOpen(false); 
            }
        } catch (err) {
            console.error("Post Error:", err);
            setError('Failed to create post');
        } finally {
            setLoading(false);
        }
    };    

    return (
        <div className="flex flex-col items-center justify-center py-8">
            {/* Add Post Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium shadow-md"
            >
                + Add Post
            </button>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
                       
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                        >
                            ✖
                        </button>

                        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Create a New Post</h2>

                        
                        <form onSubmit={handlePost} encType="multipart/form-data">
                           
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Content */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Content</label>
                                <textarea
                                    name="content"
                                    value={content}
                                    onChange={handleInputChange}
                                    required
                                    rows="4"
                                    className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Category */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    name="category"
                                    value={category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a category</option>
                                    <option value="General">General</option>
                                    <option value="lifestyle">Lifestyle</option>
                                    <option value="travel">Travel</option>
                                    <option value="Education">Education</option>
                                   
                                    <option value="Culture">Culture</option>
                                    <option value="Creativity">Creativity</option>
                                    <option value="Music">Music</option>
                                    <option value="Humor">Humor</option>
                                    
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleFileChange}
                                    className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none"
                                />
                            </div>

                            
                            <button
                                type="submit"
                                className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
                                disabled={loading}
                            >
                                {loading ? 'Posting...' : 'Post'}
                            </button>
                        </form>

                    </div>
                </div>
            )}
        </div>
    );
};

export default AddPost;
