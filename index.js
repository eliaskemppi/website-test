const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))


let persons = [
    { id: 1, name: 'Arto Hellas', number: '040-123456' },
    { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
    { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]


const date = new Date().toString()

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(
        `<div>Phonebook has info for ${persons.length} people</div>
        <div>${date}</div>`
        )
  })

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

app.delete('/api/persons/:id',  (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  persons = persons.filter(x => x.id !== id)
  res.json(person)
})

app.post('/api/persons',  (req, res) => {
  const body = req.body
  console.log(body)
  const id = Math.floor(Math.random()*1000000)
  if (!body.name || !body.number) {
    return res.status(400).json({ 
      error: 'data missing' 
    })
  } else if (persons.find(x => x.name === body.name)) {
    return res.status(400).json({ 
      error: 'name must be unique'
    })
  }
  const addedPerson = {
    name: body.name,
    number: body.number,
    id: id
  }

  
  persons = persons.concat(addedPerson)
  res.json(addedPerson)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
