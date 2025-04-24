import React from 'react'

const TopPost = ({ topPsots }) => {

  return (
    <>
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">Top Posts</h2>
        <div className="space-y-4">
          {
            topPsots.map((post, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-slate-800 text-white flex items-center justify-center font-bold rounded">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium text-slate-800 line-clamp-2">{post.title}</h3>
                  <div className="text-xs text-slate-500 mt-1">
                    <span>{post.category}</span> • <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}

export default TopPost