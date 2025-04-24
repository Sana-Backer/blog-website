import React, { useEffect, useState } from 'react';
import { deletePostAPI, editPostAPI, getUserPostsAPI } from '../Services/AllAPI';
import AddPost from '../components/AddPost';
import SERVERURL from '../Services/ServerURL';
import { HiOutlineHeart, HiOutlineChatAlt, HiOutlineShare, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import SimilarProfiles from '../components/SimilarProfiles';
import bacground from '../assets/bggg.jpg';
import { RiThumbUpFill } from 'react-icons/ri';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('Posts');
  const [userPosts, setUserPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null); // post being edited
  const [editFormData, setEditFormData] = useState({
    title: '',
    content: '',
    category: '',
    imageFile: null,
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const tabs = ['Posts', 'Add Post'];
  const User = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    getUserPost();
  }, []);

  const getUserPost = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };
      const response = await getUserPostsAPI(User._id, headers);
      console.log("User posts:", response.data);
      if (response.status === 200) {
        setUserPosts(response.data);
      }
    } catch (error) {
      console.log("Error fetching user posts:", error);
    }
  };


  const handleEdit = (post) => {
    console.log("Editing post:", post);
    setEditingPost(post);
    setEditFormData({
      title: post.title || '',
      content: post.content || '',
      category: post.category || '',
      imageFile: null,
    });
    setIsEditModalOpen(true); // Open the modal
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    setEditFormData((prev) => ({ ...prev, imageFile: file }));
  };

  const handleSaveEdit = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const headers = {
        Authorization: `Bearer ${token}`, // your auth token
      };

      const updatedData = new FormData();
      updatedData.append('title', editFormData.title);
      updatedData.append('content', editFormData.content);
      updatedData.append('category', editFormData.category);
      if (editFormData.imageFile) {
        updatedData.append('image', editFormData.imageFile);
      }

      const res = await editPostAPI(editingPost._id, updatedData, headers);

      // Update UI
      const updatedPosts = userPosts.map((p) =>
        p._id === editingPost._id ? res.data.post : p
      );
      setUserPosts(updatedPosts);
      setIsEditModalOpen(false);
      setEditingPost(null);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  // delete post
  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const token = sessionStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const res = await deletePostAPI(postId, headers);
      console.log(res.message);
      toast.success(res.message || 'Post deleted successfully');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Something went wrong');
    }
  };




  return (
    <div className="bg-gray-50 min-h-screen flex justify-center ">
      <div className="w-full ">
        {/* Main Profile Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
          <div className="h-50 bg-blue-600 w-full relative">
            <img
              src={bacground}
              alt="Header Background"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile Info Section */}
          <div className="px-8 pb-6 relative">
            {/* Profile Picture */}
            <div className="absolute -top-16 left-8">
              <div className="flex items-center justify-center w-36 h-36 rounded-full border-4 border-white overflow-hidden bg-blue-100">
                <h1 className="text-8xl font-bold text-white">{User.username.charAt(0).toUpperCase()}</h1>
              </div>

            </div>

            {/* Profile Header with Action Button */}
            <div className="flex justify-between items-center pt-20 pb-2">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{User.username}</h1>
                <p className="text-gray-600">{User.email}</p>
                <p className="text-gray-500 text-sm">{User.country}</p>
              </div>
            </div>


          </div>
        </div>

        {/* Two-Column Layout for Content */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Column - Main Content */}
          <div className="flex-1">
            {/* Content Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-4">
              <div className="flex">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    className={`py-4 px-6 font-medium relative transition-colors ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 min-h-73">
                {activeTab === 'Posts' && (

                  userPosts.map(post => (
                    <div key={post.id} className="border-b border-gray-100 pb-6 mb-6 last:border-0 last:mb-0 last:pb-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start">
                          <h1 className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white text-2xl font-bold mr-4 shadow-md">
                            {post.author?.username?.charAt(0).toUpperCase()}
                          </h1>

                          <div>
                            <p className="font-medium text-gray-800">{post.author?.username}</p>
                            <p className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex space-x-2 text-gray-500">
                          <button onClick={() => handleEdit(post)} title="Edit">
                            <HiOutlinePencil className="w-5 h-5 hover:text-blue-600" />
                          </button>
                          <button onClick={() => handleDelete(post._id)} title="Delete">
                            <HiOutlineTrash className="w-5 h-5 hover:text-red-600" />
                          </button>
                        </div>
                      </div>

                      <div className='grid grid-cols-2 gap-4'>
                        {post.image && (
                          <div className="mb-4">
                            <img
                              src={`${SERVERURL}/uploads/${post.image}`}
                              alt="Post content"
                              className="w-150 rounded-md"
                            />
                           
                          </div>
                        )}
                         <div>
                           <h1 className='text-2xl font-bold mb-2'>{post.title}</h1>
                          <p className="text-gray-800 mb-4">
                            {post.content}
                          </p>
                         </div>
                      </div>

                      <div className="flex items-center space-x-6 text-gray-500">
                        <div className="flex items-center mt-3 space-x-2">
                          <button
                            onClick={() => likePost(post._id)}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                          >
                            <RiThumbUpFill />

                          </button>
                          <span className="text-gray-500">{post.likes}</span>
                        </div>


                        <button className="flex items-center space-x-1">
                          <HiOutlineChatAlt className="h-5 w-5" />
                          <span>{post.comments}</span>
                        </button>

                        <button className="flex items-center space-x-1">
                          <HiOutlineShare className="h-5 w-5" />
                          <span>{post.shares}</span>
                        </button>
                      </div>
                    </div>
                  ))

                )}

                {activeTab === 'Add Post' && (
                  <AddPost getUserPost={getUserPost} />
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="w-full md:w-72">


            {/* Connect Card */}
            {/* <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
              <h2 className="font-bold text-gray-800 mb-3">Connect</h2>
              <div className="space-y-3">
                <a href="#" className="flex items-center text-gray-600 hover:text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>about.me/adriann</span>
                </a>
                <a href="#" className="flex items-center text-gray-600 hover:text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>
                <a href="#" className="flex items-center text-gray-600 hover:text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </a>
                <a href="#" className="flex items-center text-gray-600 hover:text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.162 5.656a8.384 8.384 0 01-2.402.658A4.196 4.196 0 0021.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 00-7.126 3.814 11.874 11.874 0 01-8.62-4.37 4.168 4.168 0 00-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 01-1.894-.523v.052a4.185 4.185 0 003.355 4.101 4.21 4.21 0 01-1.89.072A4.185 4.185 0 007.97 16.65a8.394 8.394 0 01-6.191 1.732 11.83 11.83 0 006.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 002.087-2.165z"/>
                  </svg>
                  <span>Twitter</span>
                </a>
              </div>
            </div> */}

            {/* Similar Profiles Card */}
            <SimilarProfiles />
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-[400px]">
            <h2 className="text-xl font-bold mb-4">Edit Post</h2>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={editFormData.title}
              onChange={handleEditInputChange}
              className="w-full p-2 border mb-2"
            />
            <textarea
              name="content"
              placeholder="Content"
              value={editFormData.content}
              onChange={handleEditInputChange}
              className="w-full p-2 border mb-2"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={editFormData.category}
              onChange={handleEditInputChange}
              className="w-full p-2 border mb-2"
            />
            <input
              type="file"
              name="image"
              onChange={handleEditImageChange}
              className="mb-2"
            />
            <div className="flex justify-between">
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-600">Cancel</button>
              <button onClick={handleSaveEdit} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;