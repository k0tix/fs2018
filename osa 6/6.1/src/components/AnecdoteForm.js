import React from 'react'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer';
import { connect } from 'react-redux'

class AnecdoteForm extends React.Component {
  handleSubmit = async (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    e.target.anecdote.value = ''
    this.props.createAnecdote(content)

    this.props.setNotification(`you created new anecdote: '${content}'`, 5)

    
  }
  render() {
    return (
      <div>
        <h2>create new</h2>
        <form onSubmit={this.handleSubmit}>
          <div><input name='anecdote' /></div>
          <button>create</button>
        </form>
      </div>
    )
  }
}

const ConnectedAnecdoteForm = connect(
  null,
  {
    createAnecdote,
    setNotification
  }
)(AnecdoteForm)

export default ConnectedAnecdoteForm
