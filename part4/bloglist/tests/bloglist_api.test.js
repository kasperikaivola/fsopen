const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blogpost')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('4.8: blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('4.8: there are 5 blogposts', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(5)
})

test('4.8: the first blogpost`s author is `coolauthor`', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].author).toBe('coolauthor')
})

test('4.9: the identifier property of blogposts is named id, not _id or other', async () => {
  const response = await api.get('/api/blogs')
  response.body.map(blog => expect(blog.id).toBeDefined())
})

test('4.10: HTTP POST to /api/blogs creates a new blogpost', async () => {
  const newBlog = {
    title: 'POSTtest',
    author: 'POSTtest author',
    url: 'POSTtesturl',
    likes: 1,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)

  const contents = blogsAtEnd.map(blog => blog.title)
  expect(contents).toContain(newBlog.title)
})

afterAll(() => {
  mongoose.connection.close()
})