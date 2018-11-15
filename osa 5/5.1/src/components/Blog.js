import React from 'react'
import blogService from '../services/blogs'

class Blog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      blog: props.blog,
      deleted: false
    }
  }

  toggleVisibility = () => {
    this.setState({ visible: !this.state.visible })
  }

  like = (blog) => {
    return async () => {
      const newBlog = { ...blog }
      newBlog.likes = newBlog.likes + 1
      await blogService.update(newBlog)
      this.setState({ blog: newBlog })
    }
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
      showIfCretor = { display: user.username === this.state.blog.user.username ? '' : 'none' }
    }

    if (!this.state.deleted) {
      return (
        <div style={blogStyle}>
          <div>
            <h3 className="title" onClick={this.toggleVisibility}>{this.state.blog.title} {this.state.blog.author}</h3>
          </div>
          <div className="info" style={showWhenVisible}>
            <a href={`http://${this.state.blog.url}`}>{this.state.blog.url}</a> <br></br>
            {this.state.blog.likes} likes <button onClick={this.like(this.state.blog)}>like</button> <br></br>
            added by {this.state.blog.user.name} <br></br>
            <button style={showIfCretor} onClick={this.delete(this.state.blog)}>delete</button>
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

export default Blog