const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blogpost')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const helper = require('./test_helper')
const saltRounds = 10
let token = null
beforeAll(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('1234', saltRounds)
  const user = await new User({ username: 'Testuser', passwordHash }).save()

  const userForToken = { username: 'name', id: user.id }
  return (token = jwt.sign(userForToken, process.env.SECRET))
})

beforeEach(async () => {
  await Blog.deleteMany()
  await Blog.insertMany(helper.initialBlogs)
})
describe('4.8: HTTP GET tests', () => {
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
})
describe('4.9: identifier property test', () => {
  test('4.9: the identifier property of blogposts is named id, not _id or other', async () => {
    const response = await api.get('/api/blogs')
    response.body.map(blog => expect(blog.id).toBeDefined())
  })
})

describe('4.10: HTTP POST test', () => {
  test('4.10: HTTP POST to /api/blogs creates a new blogpost', async () => {
    const newBlog = {
      title: 'POSTtest',
      author: 'POSTtest author',
      url: 'POSTtesturl',
      likes: 1,
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain(newBlog.title)

    const urls = blogsAtEnd.map(blog => blog.url)
    expect(urls).toContain(newBlog.url)
  })
})
describe('4.11: HTTP POST missing likes test', () => {
  test('4.11: Verify that if likes property is missing from /api/blogs POST request, it defaults to 0', async () => {
    const newBlog = {
      title: 'Missing likes test',
      author: 'Missing likes test author',
      url: 'likestesturl'
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain(newBlog.title)

    const urls = blogsAtEnd.map(blog => blog.url)
    expect(urls).toContain(newBlog.url)

    const blog = blogsAtEnd.filter(blog =>
      blog.title==='Missing likes test' &&
      blog.author==='Missing likes test author' &&
      blog.url==='likestesturl')[0]
    //console.log(blog)
    expect(blog.likes).toBe(0)
  })
})

describe('4.12: HTTP POST missing title/url test', () => {
  test('4.12: Verify that if title property is missing from /api/blogs POST request, backend responds with 400 Bad Request', async () => {
    const newBlog = {
      author: 'Missing title test author',
      url: 'titletesturl',
      likes: 0
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('4.12: Verify that if url property is missing from /api/blogs POST request, backend responds with 400 Bad Request', async () => {
    const newBlog = {
      title: 'Missing url test title',
      author: 'Missing url test author',
      likes: 0
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('4.13: HTTP DELETE test', () => {
  test('4.13: Test deletion when blog to be deleted doesn`t exist', async () => {
    const blogsAtStart = await helper.blogsInDb()
    expect(blogsAtStart).toHaveLength(helper.initialBlogs.length)
    await api
      .delete('/api/blogs/63d6f98239949897104ea407')
      .set('Authorization', `bearer ${token}`)
      .expect(204)
    const blogsAfterDELETE = await helper.blogsInDb()
    expect(blogsAfterDELETE).toHaveLength(helper.initialBlogs.length)
  })

  test('4.13: Test deletion when blog to be deleted doesn`t exist, malformatted id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    expect(blogsAtStart).toHaveLength(helper.initialBlogs.length)
    await api
      .delete('/api/blogs/invalidid1234')
      .set('Authorization', `bearer ${token}`)
      .expect(400)
    const blogsAfterDELETE = await helper.blogsInDb()
    expect(blogsAfterDELETE).toHaveLength(helper.initialBlogs.length)
  })

  test('4.13: Test deletion when blog to be deleted exists', async () => {
    const newBlog = {
      title: 'DELETEtest',
      author: 'DELETEtest author',
      url: 'DELETEtesturl',
      likes: 1,
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const blogsAfterPOST = await helper.blogsInDb()
    expect(blogsAfterPOST).toHaveLength(helper.initialBlogs.length+1)

    const blog = blogsAfterPOST.filter(blog =>
      blog.title==='DELETEtest' &&
      blog.author==='DELETEtest author' &&
      blog.url==='DELETEtesturl')[0]

    await api
      .delete('/api/blogs/'+blog.id)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    const blogsAfterDELETE = await helper.blogsInDb()
    expect(blogsAfterDELETE).toHaveLength(helper.initialBlogs.length)
  })
})

describe('4.14: HTTP PUT test', () => {
  test('4.14: Test blog update with +1 like', async () => {
    const initialBlogs = await helper.blogsInDb()
    expect(initialBlogs).toHaveLength(helper.initialBlogs.length)
    const blog = initialBlogs[0]
    blog.likes +=1

    await api
      .put('/api/blogs/'+blog.id)
      .send(blog)
      .expect(204)

    const blogsAfterUpdate = await helper.blogsInDb()
    expect(blogsAfterUpdate).toHaveLength(helper.initialBlogs.length)
    const blog2 = blogsAfterUpdate.filter(cand =>
      cand.title===cand.title &&
      cand.author===cand.author &&
      cand.url===cand.url && cand.likes===blog.likes)
    expect(blog2).toHaveLength(1)
  })
})

describe('4.23: HTTP POST test', () => {
  test('4.23: HTTP POST to /api/blogs without token fails', async () => {
    const newBlog = {
      title: 'POSTtest',
      author: 'POSTtest author',
      url: 'POSTtesturl',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})