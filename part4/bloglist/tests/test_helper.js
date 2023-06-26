const Blog = require('../models/blogpost')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const saltRounds = 10
const initialBlogs = [
  {
    'title': 'cooltitle',
    'author': 'coolauthor',
    'url': 'coolurl',
    'likes': 66
  },
  {
    'title': 'cooltitle2',
    'author': 'coolauthor2',
    'url': 'coolurl2',
    'likes': 77
  },
  {
    'title': 'cooltitle2',
    'author': 'coolauthor2',
    'url': 'coolurl2',
    'likes': 77
  },
  {
    'title': 'cooltitle3',
    'author': 'coolauthor3',
    'url': 'coolurl3',
    'likes': 99
  },
  {
    'title': 'cooltitle3',
    'author': 'coolauthor3',
    'url': 'coolurl3',
    'likes': 88
  }
]

const initialUsers = [
  {
    'username': 'testuser',
    'password': 'asdf1234',
    'name': 'User Name',
  },
  {
    'username': 'asdfuser',
    'password': 'cool1234',
    'name': 'Tester User',
  }
]

const signToken = (user) =>
  jwt.sign(
    {
      username: user.username,
      id: user._id,
    },
    process.env.SECRET,
    { expiresIn: 60 * 60 }
  )


const authHeader = (user) => ({
  Authorization: `bearer ${signToken(user)}`,
})

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'author', url: 'url', likes:0 })
  await blog.save()
  await blog.remove()
  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, initialUsers, nonExistingId, blogsInDb, usersInDb, authHeader
}