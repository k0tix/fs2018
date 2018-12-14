const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User
    .find({})
    .populate('blogs')
    response.json(users.map(User.format))
})

usersRouter.get('/:id', async (request, response) => {
    const id = request.params.id
    const user = await User
    .find({_id: id})
    .populate('blogs')
    response.json(user.map(User.format))
})

usersRouter.post('/', async (request, response) => {
    try {
        const body = request.body

        const existingUser = await User.find({ username: body.username })

        if (existingUser.length > 0) {
            return response.status(400).json({ error: 'username must be unique' })
        } else if(body.password.length < 3) {
            return response.status(400).json({ error: 'password must be atleast 3 characters long'})
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            adult: body.adult === undefined ? true : body.adult,
            passwordHash
        })

        const savedUser = await user.save()

        response.json(savedUser)
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong...' })
    }
})

module.exports = usersRouter