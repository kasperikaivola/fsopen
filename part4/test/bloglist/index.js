require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
//const mongoose = require('mongoose')
const Blogpost = require('./models/contact')
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
morgan.token('content', function (req) {
  var obj = {}
  obj.name=req.body.name
  obj.number=req.body.number
  return JSON.stringify(obj)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
//const url = process.env.MONGODB_URI

app.get('/info', (request, response) => {
  Blogpost.find({}).then(bloglist => {
    response.send(`Bloglist has info for ${bloglist.length} blog posts</br> ${new Date()}`)
  })
})

app.get('/api/blogs', (request, response) => {
  //response.json(phonebook)
  Blogpost.find({}).then(bloglist => {
    response.json(bloglist)
  })
})

app.get('/api/blogs/:id', (request, response, next) => {
  /*const id = Number(request.params.id)
    const person = phonebook.find(p => p.id === id)
    if(person) response.json(person)
    else response.status(404).end()*/
  Blogpost.findById(request.params.id)
    .then(contact => {
      if(contact) response.json(contact)
      else {
        //console.log(error)
        response.status(404).send
        //throw new Error('InvalidIDError')
      }
    })
    .catch(error => next(error))
})

app.delete('/api/blogs/:id', (request, response, next) => {
  /*const id = Number(request.params.id)
    phonebook = phonebook.filter(p => p.id !== id)
    response.status(204).end()*/
  Blogpost.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/blogs', (request, response, next) => {
  //const id = Math.floor(Math.random()*1000000)
  const body = request.body
  //body.id = id
  const person = new Blogpost({
    //id: id,
    name: body.name,
    number: body.number
  })
  person.save().then(savedBlogpost => {
    response.status(201).json(savedBlogpost)
  })
    .catch(error => next(error))
    /*if(!body.name) return response.status(400).json({error: 'name missing'})
    if(!body.number) return response.status(400).json({error: 'number missing'})
    if(phonebook.some(p => p.name === body.name)) return response.status(400).json({error: 'person already exists'})
    phonebook = phonebook.concat(body)
    response.json(body)*/
})

app.put('/api/blogs/:id', (request, response, next) => {
  const body = request.body
  const person = new Blogpost({
    name: body.name,
    number: body.number,
    _id: body.id
  })
  Blogpost.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error,request,response,next) => { //error handler middleware
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  /*else {
    return response.status(400).send({error: error.message})
  }*/
  next(error)
}

app.use(errorHandler) //error handler should be taken into use last
const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server 4.1 running on port ${port}`)
})