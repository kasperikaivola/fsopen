import React from 'react'
import PropTypes from 'prop-types'
import Blog from './Blog'

const Blogs = ({ blogs, addLike, removeBlog, user }) => {
  blogs = blogs.sort((b1,b2) => b2.likes - b1.likes)

  const validateOwner = (blog, user) => {
    //console.log(blog.user.username)
    //console.log(user.username)
    if (user !== null && blog.user.username === user.username) {
      return true
    }
    else {
      return false
    }
    //return true
  }

  return (
    <div>
      {blogs.map(b =>
        <div key={b.id}>
          <Blog key={b.title}
            title={b.title}
            author={b.author}
            url={b.url}
            likes={b.likes}
            user={b.user.name}
            addLike={() => addLike(b)}
            removeBlog={() => removeBlog(b)}
            validateOwner={validateOwner(b, user)} />
        </div>
      )}
    </div>
  )
}

Blogs.propTypes = {
  blogs: PropTypes.array.isRequired,
  addLike: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  user: PropTypes.shape({
    token: PropTypes.string,
    username: PropTypes.string,
    name: PropTypes.string,
  })
}

export default Blogs