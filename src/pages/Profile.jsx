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
  const [editingPost, setEditingPost] = useState(null);
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
    setIsEditModalOpen(true); 
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
        Authorization: `Bearer ${token}`, 
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
      toast.success( 'Post deleted successfully');
      
      setUserPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Something went wrong');
    }
  };




  return (
    <div className="bg-gray-50 min-h-screen flex justify-center ">
      <div className="w-full ">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
          <div className="h-50 bg-blue-600 w-full relative">
            <img
              src={bacground}
              alt="Header Background"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="px-8 pb-6 relative">
            {/* Profile Picture */}
            <div className="absolute -top-16 left-8">
              <div className="flex items-center justify-center w-36 h-36 rounded-full border-4 border-white overflow-hidden bg-blue-100">
                <h1 className="text-8xl font-bold text-white">{User.username.charAt(0).toUpperCase()}</h1>
              </div>

            </div>

            <div className="flex justify-between items-center pt-20 pb-2">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{User.username}</h1>
                <p className="text-gray-600">{User.email}</p>
                <p className="text-gray-500 text-sm">{User.country}</p>
              </div>
            </div>


          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Column  */}
          <div className="flex-1">
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

          {/* Right Column */}
          <div className="w-full md:w-72">
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