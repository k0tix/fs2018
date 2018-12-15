import React from 'react'
import blogService from '../services/blogs'
import {likeBlog} from '../reducers/blogReducer'
import {connect} from 'react-redux'
import {Button, Label, Item, Header} from 'semantic-ui-react'

class Blog extends React.Component {
      constructor(props) {
            super(props)
            this.state = {
                  deleted: false
            }
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

        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        let showIfCretor


        if (loggedUserJSON) {
              const user = JSON.parse(loggedUserJSON)

              showIfCretor = { display: user.username === this.props.blog.user.username ? '' : 'none' }
        }

        if (!this.state.deleted) {
              return (
                    <div>
                          <Item style={{padding: '2em', margin: '2em', border: 'solid', borderRadius: '7px', borderColor: 'lightgrey'}}>
                                <Item.Content>
                                      <Item.Header><Header as='h2'>{this.props.blog.title}</Header></Item.Header>
                                      <Item.Meta>{this.props.blog.author}</Item.Meta>
                                      <Item.Description style={{margin: '1em'}}>
                                            <Label as='a' href={`http://${this.props.blog.url}`}> {this.props.blog.url} </Label>
                                            <div>{this.props.blog.likes} likes <Button primary onClick={this.like(this.props.blog)}>like</Button>
              added by {this.props.blog.user.name}</div>
              
                                            <Button color='red' style={showIfCretor} onClick={this.delete(this.props.blog)}>delete</Button>
                                      </Item.Description>
                                </Item.Content>
                          </Item>
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