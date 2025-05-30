import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { RiShareForwardFill, RiThumbUpFill, RiChat1Fill } from "react-icons/ri";
import TopPost from "../components/TopPost";
import { getAllPostsAPI, LikePostsAPI, topPostsAPI } from "../Services/AllAPI";
import SERVERURL from "../Services/ServerURL";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [topPosts, setTopPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const currentUserId = JSON.parse(sessionStorage.getItem('user'))?._id;

  useEffect(() => {
    fetchPosts();
    fetchTopPost();
  }, []);

  const fetchPosts = async () => {
    try {
      const postsData = await getAllPostsAPI();
      setPosts(postsData.data || []);  // protect if API returns undefined
      console.log("Posts fetched:", postsData.data);

    } catch (error) {
      setError('Failed to fetch posts');
    }
  };

  const fetchTopPost = async () => {
    try {
      const result = await topPostsAPI();
      if (result.status === 200) {
        setTopPosts(result.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const likePost = async (id) => {
    try {
      const result = await LikePostsAPI(id);
      console.log(result);
      
      // if (result.status === 200) {
      //   const updatedPost = result.data.post;  // full post
      //   setPosts((prevPosts) =>
      //     prevPosts.map((post) =>
      //       post?._id === updatedPost._id ? updatedPost : post
      //     )
      //   );
        
      //   console.log("Post liked/unliked:", updatedPost);
      // }
    } catch (err) {
      console.log(err);
    }
  };


  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post?.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "" || post?.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const currentPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  return (
    <div className="bg-gray-50 text-gray-900 font-sans">
      <Header />

      <main className="mx-auto p-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        <aside className="md:col-span-1 space-y-8">
          <div>
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search..." className="w-full p-2 border rounded" />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Categories</h2>
            <ul className="text-sm divide-y divide-gray-200">
              {['General', 'Lifestyle', 'Travel', 'Food', 'Education', 'Culture', 'Creativity', 'Music', 'Humor'].map((item, index) => (
                <li
                  key={index}
                  onClick={() => setSelectedCategory(item)}
                  className={`py-2 cursor-pointer hover:text-blue-600 ${selectedCategory === item ? "font-semibold text-blue-600" : ""}`}
                >
                  {item}
                </li>
              ))}
            </ul>
            <button onClick={() => { setSearchQuery(""); setSelectedCategory(""); }} className="mt-2 px-4 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200">
              Clear Filters
            </button>
          </div>

          <TopPost topPsots={topPosts} />
        </aside>

        {/* Blog Posts Grid */}
        <div className="md:col-span-2 ps-10">
          <div className="grid grid-cols-1 gap-16">
            {currentPosts.length > 0 ? (
              currentPosts.map((post, index) => (
                post ? ( // Protect map if post is undefined
                  <div key={index} className="flex flex-col md:flex-row gap-8 w-250">
                    <div className="md:w-1/2">
                      <div className="flex items-center gap-2 font-bold text-slate-500 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden bg-blue-100">
                          <h1 className="text-2xl font-bold text-white">
                            {post.author?.username
                              ? post.author.username.charAt(0).toUpperCase()
                              : 'D'}
                          </h1>
                        </div>
                        <span>{post.author?.username || "Deleted User"}</span>
                      </div>

                      <Link to="#" className="block overflow-hidden rounded-2xl">
                        <img
                          src={`${SERVERURL}/uploads/${post?.image}`} // Safe
                          alt={post?.title}
                          width={800}
                          height={600}
                          className="w-full h-auto object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </Link>

                      <div className="flex items-center mt-3 space-x-2">
                        <button
                          onClick={() => likePost(post._id)}
                          className={`flex items-center space-x-1 ${Array.isArray(post.likes) && post.likes.includes(currentUserId)
                              ? 'text-blue-600'
                              : 'text-gray-500 hover:text-blue-600'
                            }`}
                        >
                          {Array.isArray(post.likes) && post.likes.includes(currentUserId)
 ? (
                            <RiThumbUpFill />
                          ) : (
                            <RiThumbUpFill className="opacity-50" />
                          )}
                        </button>
                        <span className="text-gray-500">{Array.isArray(post.likes) ? post.likes.length : 0}</span>
                      </div>
                    </div>

                    <div className="md:w-1/2">
                      <h2 className="text-4xl font-bold mt-13 mb-2 text-slate-800">{post?.title}</h2>
                      <div className="text-xs text-slate-500 mb-1">
                        <span className="text-gray-400">{post?.category}</span> •{' '}
                        <span className="text-gray-400">
                          {post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <p className="text-lg text-gray-800">{post?.content}</p>
                    </div>
                  </div>
                ) : null
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-2xl m-auto text-blue-800">
                <p>No posts found!</p>
                <span>Be the first person to speak about this topic. Add your thoughts!</span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Pagination */}
      <div className="max-w-7xl mx-auto px-4 pb-10 flex justify-center space-x-2">
        {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`w-8 h-8 flex items-center justify-center rounded border hover:bg-blue-100 ${currentPage === index + 1 ? 'bg-blue-600 text-white' : ''
              }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredPosts.length / postsPerPage)}
          className="w-8 h-8 flex items-center justify-center rounded border hover:bg-blue-100"
        >
          &gt;
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
