import React from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import {connect} from 'react-redux'
import {Container, Menu, Button, Input, Header, Form, List, Table, Label} from 'semantic-ui-react'

import {BrowserRouter as Router, Route, NavLink, Link} from 'react-router-dom'

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
    this.props.userInitialization()
    this.props.blogInitialization()

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

      
    } catch (exception) {
      this.props.setNotification('username or password incorrect', 2)
    }
  }

  logout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    this.props.setUser(null)
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

        <Form onSubmit={this.login}>
          <Form.Field>
            <label>Username</label>
            <Input
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleLoginFieldChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <Input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleLoginFieldChange}
            />
          </Form.Field>
          <Button type="submit">Log in</Button>
        </Form>
      </div>
    )

    const blogFrom = () => (
      <Togglable button={Button} buttonLabel="new blog">
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
      <Table>
        <Table.Body>
        {this.props.blogs
        .sort((a,b) => b.likes - a.likes)
        .map(blog =>
          <Table.Row key={blog._id}>
            <Table.Cell>
              <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
            </Table.Cell>
          </Table.Row>
        )}
        </Table.Body>
      </Table>
    )

    return (
      <Container>
      <div>
        <Router>
          <div>

          <Header as='h1'>blog app</Header>

          <Notification />

          {this.props.user === null ?
              loginForm() :
              <div>
                <Menu fluid inverted>
                  <Menu.Item as={NavLink} exact to='/'>blogs</Menu.Item>
                  <Menu.Item as={NavLink} exact to='/users'>users</Menu.Item>
                  <Menu.Item><div><Label color='pink'>{this.props.user.name}</Label> logged in <Button color='red' onClick={this.logout}>logout</Button></div></Menu.Item>
                </Menu>
                {blogFrom()}
                </div>}

        <Route exact path='/blogs/:id' render={({match}) => {
          const blog = this.props.blogs === null ? null : this.props.blogs.find(blog => blog._id === match.params.id)
          return (
            blog === undefined ? null : 
            <div>
              <Blog blog={blog}></Blog>
            </div>
          )
        }}/>

        <Route exact path='/users/:id' render={({match}) => {
            const user = this.props.users === null ? null : this.props.users.find(user => user.id === match.params.id)
            return (
              user === null ? null : <div>
              <Header as='h1'>{`${user.name}`}</Header>
              <Header as='h2'>Added blogs</Header>
              <Table color='blue' striped>
                <Table.Body>
                  {user.blogs.map(blog => 
                    <Table.Row key={blog._id}>
                    <Table.Cell>
                      <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
                    </Table.Cell>
                  </Table.Row>  
                  )}
                </Table.Body>
              </Table>
              </div>
            )
            }
          }
        />

          <Route path='/users' render={() =>
          this.props.users === null ? null : 
          <Table celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  User
                </Table.HeaderCell>
                <Table.HeaderCell>
                  blogs added
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.users.map(user => 
                <Table.Row key={user.name}>
                  <Table.Cell>
                    <Link to={`/users/${user.id}`}>{user.name}</Link>
                  </Table.Cell>
                  <Table.Cell>
                    {user.blogs.length}
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
          } />

          <Route exact path='/' render={() => 
          this.props.user === null ? null :
                <List>
                  {blogs()}
                </List>
                
          }/>
      
          </div>
         </Router>
      </div>
      </Container>
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
