const Blog = require('../models/blogpost')

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

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}