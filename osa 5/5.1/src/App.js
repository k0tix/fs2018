import React from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      title: '',
      author: '',
      url: '',
      error: null,
      notification: '',
      username: '',
      password: '',
      user: null
    }
  }

  componentDidMount() {
    blogService.getAll().then(blogs =>
      this.setState({ blogs })
    )

    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({ user })
      blogService.setToken(user.token)
    }
  }

  handleLoginFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleBlogFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  login = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)

      this.setState({
        username: '',
        password: '',
        user
      })
    } catch (exception) {
      this.setState({
        notification: 'username or password incorrect'
      })
      setTimeout(() => {
        this.setState({ notification: '' })
      }, 2500)
    }
  }

  logout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    this.setState({ user: null })
  }

  createBlog = async (event) => {
    event.preventDefault()
    try {
      const blog = await blogService.create({
        title: this.state.title,
        author: this.state.author,
        url: this.state.url
      })

      this.setState({
        title: '',
        author: '',
        url: '',
        notification: `blog "${blog.title}" was succesfully added`,
        blogs: await blogService.getAll()
      })
      setTimeout(() => {
        this.setState({notification: ''})
      }, 2500)

    } catch (exception) {
      console.log(exception)
      this.setState({
        notification: 'something went wrong'
      })
      setTimeout(() => {
        this.setState({notification: ''})
      }, 2500)
    }

  }

  render() {
    const loginForm = () => (
      <div className="loginForm">
        <h2>Log in to application</h2>

        <form onSubmit={this.login}>
          <div>
            username:
            <input
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleLoginFieldChange}
            />
          </div>
          <div>
            password:
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleLoginFieldChange}
            />
          </div>
          <button type="submit">Log in</button>
        </form>
      </div>
    )

    const blogFrom = () => (
      <Togglable buttonLabel="new blog">
        <BlogForm 
          onSubmit={this.createBlog}
          title={this.state.title}
          author={this.state.author}
          url={this.state.url}
          handleChange={this.handleBlogFieldChange}
          />
      </Togglable>
    )

    const blogs = () => (
      <div>
        {this.state.blogs
        .sort((a,b) => b.likes - a.likes)
        .map(blog =>
          <Blog blog={blog} key={blog._id} />
        )}
      </div>
    )

    return (
      <div>
        <h1>blogs</h1>
        <Notification notification={this.state.notification} />
        {this.state.user === null ?
          loginForm() :
          <div>
            <p>{this.state.user.name} logged in <button onClick={this.logout}>logout</button></p>
            {blogFrom()}
            <p></p>
            {blogs()}
          </div>}
      </div>
    )


  }
}

export default App;
