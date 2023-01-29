const blogpostRouter = require('express').Router()
const Blogpost = require('../models/blogpost')

blogpostRouter.get('/', async (request, response) => {
  /*Blogpost.find({}).then(blogposts => {
    response.json(blogposts)
  })*/
  const blogs = await Blogpost.find({})
  response.json(blogs)
})

blogpostRouter.get('/:id', (request, response, next) => {
  Blogpost.findById(request.params.id)
    .then(blogpost => {
      if (blogpost) {
        response.json(blogpost)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogpostRouter.post('/', (request, response, next) => {
  const body = request.body
  const blogpost = new Blogpost({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes | 0
  })

  blogpost.save()
    .then(savedNote => {
      response.status(201).json(savedNote)
    })
    .catch(error => next(error))
})

blogpostRouter.delete('/:id', (request, response, next) => {
  Blogpost.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

blogpostRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const blogpost = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  Blogpost.findByIdAndUpdate(request.params.id, blogpost)
    .then(updatedBlogpost => {
      response.json(updatedBlogpost)
    })
    .catch(error => next(error))
})

module.exports = blogpostRouter