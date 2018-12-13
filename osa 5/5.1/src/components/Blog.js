import React from 'react'
import blogService from '../services/blogs'
import {likeBlog} from '../reducers/blogReducer'
import {connect} from 'react-redux'

class Blog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      deleted: false
    }
  }

  toggleVisibility = () => {
    this.setState({ visible: !this.state.visible })
  }

  like = (blog) =>  () => {
    this.props.likeBlog(blog)
  }

  delete = (blog) => {
    return async () => {
      if (window.confirm(`delete '${blog.title}' by ${blog.author}?`)) {
        await blogService.remove(blog)
        this.setState({ deleted: true })
      }
    }
  }

  render() {
    const showWhenVisible = { display: this.state.visible ? '' : 'none' }

    const blogStyle = {
      backgroundColor: 'lightgrey',
      borderLeft: '6px solid blue',
      paddingLeft: 10,
      margin: 1,
      fontFamily: 'Arial, Helvetica, sans-serif'
    }

    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    let showIfCretor


    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)

      showIfCretor = { display: user.username === this.props.blog.user.username ? '' : 'none' }
    }

    if (!this.state.deleted) {
      return (
        <div style={blogStyle}>
          <div>
            <h3 className="title" onClick={this.toggleVisibility}>{this.props.blog.title} {this.props.blog.author}</h3>
          </div>
          <div className="info" style={showWhenVisible}>
            <a href={`http://${this.props.blog.url}`}>{this.props.blog.url}</a> <br></br>
            {this.props.blog.likes} likes <button onClick={this.like(this.props.blog)}>like</button> <br></br>
            added by {this.props.blog.user.name} <br></br>
            <button style={showIfCretor} onClick={this.delete(this.props.blog)}>delete</button>
          </div>
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }


  }
}

export default connect(null, {likeBlog})(Blog)