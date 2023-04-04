require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('build'))

const errorHandler = (error, request, response, next) => {
  console.error(`error: ${error.message}`)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

const persons = []

const date = new Date().toString()

app.get('/api/persons', (req, res) => {
  Person.find({}).then(person => {
    res.json(person)
  })
})

app.get('/info', (req, res) => {
  Person.count({}).then(personCount => {
    res.send(
        `<div>Phonebook has info for ${personCount} people</div>
        <div>${date}</div>`
        )
  })
  })

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
        if (person) {
          response.json(person)
        } else {
          response.status(404).end()
        }        
      })
      .catch(error => next(error))
  })

app.delete('/api/persons/:id',  (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(202).end()
    })
    .catch(error => next(error))

})

app.post('/api/persons',  (req, res, next) => {
  const body = req.body

  console.log(body)

  const id = Math.floor(Math.random()*1000000)

  /*if (!body.name || !body.number) {
    return res.status(400).json({ 
      error: 'data missing' 
    })
  } else if (persons.find(x => x.name === body.name)) {
    return res.status(400).json({ 
      error: 'name must be unique'
    })
  }*/
  
  const person = new Person({
    name: body.name,
    number: body.number
  })
  
  person.save()
    .then(result => {
      res.json(result)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
