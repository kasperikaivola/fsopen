const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany()
  await User.insertMany(helper.initialUsers)
  console.log(User.find({}))
})

describe('4.16: User Add test', () => {
  beforeEach(async () => {
    await User.deleteMany()
    await User.insertMany(helper.initialUsers)
  })
  test('Add user with proper name and password', async () => {
    const usersAtStart = await helper.usersInDb()
    expect(usersAtStart).toHaveLength(helper.initialUsers.length)
    const testuser = {
      'username': 'testuser1',
      'password':'pwd1234',
      'name': 'Test User1Proper',
    }
    await api
      .post('/api/users')
      .send(testuser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const usersAfterAdd = await helper.usersInDb()
    expect(usersAfterAdd).toHaveLength(helper.initialUsers.length+1)
  })
  test('4.16: Try to add user with too short (<3 characters) name and proper password', async () => {
    const usersAtStart = await helper.usersInDb()
    expect(usersAtStart).toHaveLength(helper.initialUsers.length)
    const testuser = {
      'username': 'te',
      'password':'pwd1234',
      'name': 'Test User1TooshortName',
    }
    await api
      .post('/api/users')
      .send(testuser)
      .expect(400)
    const usersAfterAdd = await helper.usersInDb()
    expect(usersAfterAdd).toHaveLength(helper.initialUsers.length)
  })
  test('4.16: Try to add user with proper name and too short (<3 characters) password', async () => {
    const usersAtStart = await helper.usersInDb()
    expect(usersAtStart).toHaveLength(helper.initialUsers.length)
    const testuser = {
      'username': 'testuser1',
      'password':'pw',
      'name': 'Test User1TooshortPwd',
    }
    await api
      .post('/api/users')
      .send(testuser)
      .expect(400)
    const usersAfterAdd = await helper.usersInDb()
    expect(usersAfterAdd).toHaveLength(helper.initialUsers.length)
  })
  test('4.16: Try to add user with name that is already in use', async () => {
    const usersAtStart = await helper.usersInDb()
    expect(usersAtStart).toHaveLength(helper.initialUsers.length)
    const testuser = {
      'username': 'testuser',
      'password':'pw2',
      'name': 'Test User2',
    }
    await api
      .post('/api/users')
      .send(testuser)
      .expect(400)
    const usersAfterAdd = await helper.usersInDb()
    expect(usersAfterAdd).toHaveLength(helper.initialUsers.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})