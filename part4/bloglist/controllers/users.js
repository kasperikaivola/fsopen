const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body
  const users = await User.find({})
  if(users.filter(u => u.username===username).length>0) {
    response.status(400).send({ error: 'Username already in use' })
    return
  }
  //console.log(username, password, name)
  try {
    const pwdlen = password.length
    if(pwdlen<3) {
      response.status(400).send({ error: 'Password must be at least 3 characters' })
      return
    }
  }
  catch (error) {
    response.status(400).send({ error: error })
    return
  }
  const saltRounds = 10
  const pwdHash = await bcrypt.hash(password, saltRounds)
  const user = new User({
    username,
    name,
    passwordHash: pwdHash,
  })
  try {
    const savedUser = await user.save()

    response.status(201).json(savedUser)
  }
  catch (error) {
    //console.log(error)
    response.status(400).send({ error: error.message })
  }
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

module.exports = usersRouter