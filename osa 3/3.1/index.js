const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

morgan.token('body', (req, res) => { return JSON.stringify(req.body) })

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.json(persons.map(Person.format))
        }).catch(error => {
            console.log(error)
            res.status(400).send({ error: 'bad request' })
        })
})

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            res.json(Person.format(person))
        }).catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.get('/info', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.send(`puhelinluettelossa on ${persons.length} henkilön tiedot \n ${Date()}`)
        }).catch(error => {
            console.log(error)
        })
})

app.delete('/api/persons/:id', (req, res) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(response => {
            res.status(204).end()
        }).catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.post('/api/persons/', (req, res) => {
    const body = req.body

    if (body.name === undefined) {
        return res.status(400).json({ error: 'name cannot be undefined' })
    } else if (body.number === undefined) {
        return res.status(400).json({ error: 'number cannot be undefined' })
    }

    Person.find({ name: body.name }).then(response => {
        if (response.length > 0) {
            res.status(400).send({ error: 'Name not unique' })
        } else {
            const person = new Person({
                name: body.name,
                number: body.number
            })

            person
                .save()
                .then(savedPerson => {
                    res.json(Person.format(savedPerson))
                }).catch(error => {
                    console.log(error)
                })
        }
    })


})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person
        .findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(Person.format(updatedPerson))
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})