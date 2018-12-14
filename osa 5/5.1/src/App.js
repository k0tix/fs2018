import React from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import {connect} from 'react-redux'

import {BrowserRouter as Router} from 'react-router-dom'

import {setNotification} from './reducers/notificationReducer'
import {createBlog, blogInitialization} from './reducers/blogReducer'
import {userInitialization, setUser} from './reducers/userReducer'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      author: '',
      url: '',
      error: null,
      username: '',
      password: ''
    }
  }

  componentDidMount() {
    this.props.blogInitialization()
    this.props.userInitialization()

    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      this.props.setUser(user)
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

      this.props.setUser(user)

      this.setState({
        username: '',
        password: '',
      })

      this.props.setNotification('login successful', 2)
      
    } catch (exception) {
      this.props.setNotification('username or password incorrect', 2)
    }
  }

  logout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    this.props.setUser(null)
    this.props.setNotification('logged out', 2)
  }

  createBlog = async (event) => {
    event.preventDefault()
    try {
      const blog = {
        title: this.state.title,
        author: this.state.author,
        url: this.state.url
      }

      this.props.createBlog(blog)

      this.setState({
        title: '',
        author: '',
        url: ''
      })

      this.props.setNotification(`blog "${blog.title}" was succesfully added`, 2)

    } catch (exception) {
      console.log(exception)
      this.props.setNotification('something went wrong', 2)
      
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
        {this.props.blogs
        .sort((a,b) => b.likes - a.likes)
        .map(blog =>
          <Blog blog={blog} key={blog._id} />
        )}
      </div>
    )

    return (
      <div>
        <Router>
          <div>
        <h1>blogs</h1>
        <Notification />
        {this.props.user === null ?
          loginForm() :
          <div>
            <p>{this.props.user.name} logged in <button onClick={this.logout}>logout</button></p>
            {blogFrom()}
            <p></p>
            {blogs()}
          </div>}
          </div>
         </Router>
      </div>
    )


  }
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs,
    users: state.users.users,
    user: state.users.user
  }
}

export default connect(mapStateToProps, {setNotification, createBlog, blogInitialization, userInitialization, setUser})(App)
