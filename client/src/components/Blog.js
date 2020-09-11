import React from 'react'
const Blog = ({ blog }) => (
  <div>
    {blog.content} {blog.user}
  </div>
)

export default Blog
