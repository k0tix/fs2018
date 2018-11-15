let token = null

const blogs = [
    {
        _id: "5b7b1bebec360e0986953f69",
        title: "www.youtube.com",
        author: "Mika",
        url: "www.youtube.com",
        likes: 49,
        user: {
          _id: "5b7b1b8eec360e0986953f67",
          username: "koti",
          name: "Pekka Pekkanen"
        }
      },
      {
        _id: "5b7b1bebec36ty86953f69",
        title: "www.youtube.com",
        author: "Pekka",
        url: "www.wikipedia.com",
        likes: 33,
        user: {
          _id: "5b7b1b8eec360e0986953f67",
          username: "koti",
          name: "Pekka Pekkanen"
        }
      },
      {
        _id: "5b7b3debfa41400c0bb63bcd",
        title: "uus blogi",
        author: "Matti",
        url: "www.github.com",
        likes: 8,
        user: {
          _id: "5b7b1baeec360e0986953f68",
          username: "ketale",
          name: "Mikko Makkanen"
        }
      }
]

const getAll = () => {
    return Promise.resolve(blogs)
}

const setToken = (newToken) => {
    token = newToken
}

export default {getAll, blogs, setToken}