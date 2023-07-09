const blogpostRouter = require('express').Router()
const Blogpost = require('../models/blogpost')
//const User = require('../models/user')
//const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogpostRouter.get('/', async (request, response) => {
  /*Blogpost.find({}).then(blogposts => {
    response.json(blogposts)
  })*/
  const blogs = await Blogpost.find({}).populate('user')
  response.json(blogs)
})

blogpostRouter.get('/:id', async (request, response, next) => {
  /*Blogpost.findById(request.params.id)
    .then(blogpost => {
      if (blogpost) {
        response.json(blogpost)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))*/
  try {
    const blog = await Blogpost.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  }
  catch(exception) {
    next(exception)
  }
})

/*const getTokenFrom = request => {
  const authorization = request.get('authorization')
  console.log(authorization)
  if (authorization && authorization.startsWith('bearer ')) {
    return authorization.replace('bearer ', '')
  }
  return null
}*/

blogpostRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  const body = request.body
  /*const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }*/
  //const user = await User.findById(decodedToken.id)
  //const user = await User.findById(body.userId)
  const blogpost = new Blogpost({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes | 0,
    user: request.user
  })
  if(typeof blogpost.title === 'undefined' || typeof blogpost.url === 'undefined') {
    response.status(400).end()
  }
  if(blogpost.title.length === 0 || blogpost.url.length === 0 || blogpost.author.length === 0) {
    response.status(400).end()
  }
  /*blogpost.save()
    .then(savedNote => {
      response.status(201).json(savedNote)
    })
    .catch(error => next(error))*/
  else {

    try {
      const savedBlog = await blogpost.save()
      request.user.blogs = request.user.blogs.concat(savedBlog._id)
      await request.user.save()
      response.status(201).json(savedBlog)
    }
    catch(exception) {
      //console.log(exception)
      next(exception)
    }
  }
})

blogpostRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  /*Blogpost.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))*/
  /*const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }*/
  //const user = await User.findById(decodedToken.id)
  const blog = await Blogpost.findById(request.params.id)
  try {
    if(blog===null) {
      return response.status(204).end()
    }
    if(blog.user._id.toString() !== request.user.id) {
      return response.status(403).json({ error: 'unauthorized delete' })
    }
  }
  catch(exception) {
    console.log(exception)
    return response.status(403).json({ error: 'unauthorized delete' })
  }
  try {
    await Blogpost.findByIdAndRemove(request.params.id)
    //console.log(user.blogs)
    //user.blogs = user.blogs.filter(blog => blog.id!==request.params.id)
    request.user.blogs.pull(request.params.id)
    await request.user.save()
    response.status(204).end()
  }
  catch(exception) {
    next(exception)
  }
})

blogpostRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  const blogpost = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  /*Blogpost.findByIdAndUpdate(request.params.id, blogpost)
    .then(updatedBlogpost => {
      response.json(updatedBlogpost)
    })
    .catch(error => next(error))*/
  try {
    const updatedBlog = await Blogpost.findByIdAndUpdate(request.params.id, blogpost)
    response.status(204).json(updatedBlog)
  }
  catch(exception) {
    next(exception)
  }
})

module.exports = blogpostRouter