const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, nonExistingId, blogsInDb, usersInDb, initialUsers } = require('./test_helper')


beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = initialBlogs.map(b => new Blog(b))
    await Promise.all(blogObjects.map(b => b.save()))
})



describe('when there is initially some blogs saved', async () => {
    test('all blogs are returned as json by GET /api/blogs', async () => {
        const blogsInDatabase = await blogsInDb()

        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.length).toBe(blogsInDatabase.length)

        const returnedTitles = response.body.map(b => b.title)
        blogsInDatabase.forEach(blog => {
            expect(returnedTitles).toContain(blog.title)
        })
    })
})

describe('addition of new blog', async () => {
    test('a valid blog can be added by POST /api/blogs', async () => {
        const newBlog = {
            title: "Testing blog",
            author: "Pekka Mikkonen",
            url: "https://youtube.com/",
            likes: 0
        }

        const blogsBefore = await blogsInDb()

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAfter = await blogsInDb()

        expect(blogsAfter.length).toBe(blogsBefore.length + 1)
        expect(blogsAfter).toContainEqual(newBlog)
    })

    test('a blog added without likes value will have 0 likes by POST /api/blogs', async () => {
        const newBlog = {
            title: "New test Blog",
            author: "Jimmy the tester",
            url: "https://google.com/"
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAfter = await blogsInDb()

        expect(blogsAfter[blogsAfter.length - 1].likes).toBe(0)
    })

    test('a blog added without title and url will return statuscode 400 and is not added by POST /api/blogs', async () => {
        const newBlog = {
            author: "Malformed author"
        }

        const blogsBefore = await blogsInDb()

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAfter = await blogsInDb()

        expect(blogsAfter.length).toBe(blogsBefore.length)
    })
})

describe('deletion of a blog', async () => {
    let addedBlog

    beforeAll(async () => {
        addedBlog = new Blog({
            title: 'Delete Blog Test',
            author: 'The blog tester',
            likes: 20
        })

        await addedBlog.save()
    })

    test('a blog can be removed with valid id', async () => {
        const blogsAtStart = await blogsInDb()

        await api
            .delete(`/api/blogs/${addedBlog._id}`)
            .expect(204)

        const blogsAfterOperation = await blogsInDb()

        const titles = blogsAfterOperation.map(b => b.title)

        expect(titles).not.toContain(addedBlog.title)
        expect(blogsAfterOperation.length).toBe(blogsAtStart.length - 1)
    })
})

describe('editing a blog', async () => {
    let addedBlog

    beforeAll(async () => {
        addedBlog = new Blog({
            title: 'Editing a blog',
            author: 'The blog tester',
            likes: 20
        })

        await addedBlog.save()
    })
    test('a valid blog can be edited', async () => {
        const blogsAtStart = await blogsInDb()

        const blog = {
            title: 'Editing a blog',
            author: 'The Blog tester',
            url: 'http://youtube.com',
            likes: 130
        }

        await api
            .put(`/api/blogs/${addedBlog._id}`)
            .send(blog)

        const blogsAfterOperation = await blogsInDb()

        expect(blogsAfterOperation[blogsAfterOperation.length - 1].likes).toBe(130)
        expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
    })
})

describe('when there is initially some users saved', async () => {
    beforeAll(async () => {
        await User.remove({})
        const userObjects = initialUsers.map(u => new User(u))
        await Promise.all(userObjects.map(u => u.save()))
    })

    test('GET /api/users returns user list as json', async () => {
        const usersInDatabase = await usersInDb()

        const response = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.length).toBe(usersInDatabase.length)
    })

    test('POST /api/users succeeds with a new username', async () => {
        const usersBeforeOperation = await usersInDb()

        const newUser = {
            username: 'miikka',
            name: 'Miikka Tammisto',
            password: 'SALAINEN'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length + 1)
        const usernames = usersAfterOperation.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('POST /api/users fails with proper statuscode and message if username is already taken', async () => {
        const usersBeforeOperation = await usersInDb()

        const newUser = {
            username: 'root',
            name: 'Pekka Pekkanen',
            password: 'letmein'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })

    test('POST /api/users fails with proper statuscode and message when password is too short', async () => {
        const usersBeforeOperation = await usersInDb()

        const newUser = {
            username: 'asdamon',
            name: 'Asd Asdamon',
            password: 'as'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })
})

afterAll(() => {
    server.close()
})