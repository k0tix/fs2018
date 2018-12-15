import React from 'react'
import blogService from '../services/blogs'
import {likeBlog} from '../reducers/blogReducer'
import {setNotification} from '../reducers/notificationReducer'
import {connect} from 'react-redux'
import {Button, Label, Item, Header, Comment} from 'semantic-ui-react'

class Blog extends React.Component {
      constructor(props) {
            super(props)
            this.state = {
                  deleted: false,
                  comment: ''
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

  handleCommentFieldChange = (event) => {
        this.setState({ comment: event.target.value })
  }

  createComment = async (event) => {
        event.preventDefault()
        try {
              const comment = this.state.comment
              await blogService.comment(comment, this.props.blog._id)

              this.setState({
                    comment: ''
              })

              this.props.setNotification('comment was succesfully added', 2)

        } catch (exception) {
              console.log(exception)
              this.props.setNotification('something went wrong', 2)
      
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

                                            <Comment.Group>
                                                  <Header as='h3' dividing>
                                                Comments
                                                  </Header>

                                                  {this.props.blog.comments === undefined ? null : 
                                                        this.props.blog.comments.map(comment => 
                                                              <Comment key={comment}>
                                                                    <Comment.Content>
                                                                          <Comment.Author as='a'>Anonymous</Comment.Author>
                                                                          <Comment.Metadata>
                                                                                <div>ehkä joskus pari päivää sitte</div>
                                                                          </Comment.Metadata>
                                                                          <Comment.Text>{comment}</Comment.Text>
                                                                          <Comment.Actions>
                                                                                <Comment.Action>Reply</Comment.Action>
                                                                          </Comment.Actions>
                                                                    </Comment.Content>
                                                              </Comment>
                                                        )
                                                  }
                                            </Comment.Group>
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

export default connect(null, {likeBlog, setNotification})(Blog)