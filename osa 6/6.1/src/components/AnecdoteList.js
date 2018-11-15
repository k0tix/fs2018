import React from 'react'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'
import Filter from './Filter'
import {connect} from 'react-redux'

class AnecdoteList extends React.Component {
  handleVote = (anecdote) => {
    return () => {
      this.props.voteAnecdote(anecdote.id)
      this.props.setNotification(`you voted '${anecdote.content}'`)
      setTimeout(() => {
        this.props.removeNotification()
      }, 5000)
    }
  }


  render() {
    const anecdotes = this.props.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(this.props.filter.toLowerCase()))
    return (
      <div>
        <h2>Anecdotes</h2>
        <Filter></Filter>
        {anecdotes.sort((a, b) => b.votes - a.votes).map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={this.handleVote(anecdote)
              }>
                vote
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    anecdotes: state.anecdotes,
    notification: state.notification,
    filter: state.filter
  }
}

const ConnectedAnecdoteList = connect(
  mapStateToProps,
  {
    setNotification,
    removeNotification,
    voteAnecdote
  }
)(AnecdoteList)

export default ConnectedAnecdoteList
