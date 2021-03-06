import React from 'react'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import Filter from './Filter'
import {connect} from 'react-redux'
import anecdoteService from '../services/anecdotes'

class AnecdoteList extends React.Component {

  handleVote = (anecdote) => {
    return async () => {

      const newAnecdote = {
        content: anecdote.content,
        votes: anecdote.votes+1,
        id: anecdote.id
      }

      this.props.voteAnecdote(newAnecdote.id, newAnecdote)
      this.props.setNotification(`you voted '${newAnecdote.content}'`, 5)
    }
  }


  render() {
    return (
      <div>
    <h2>Anecdotes</h2>
        <Filter></Filter>
        {this.props.visibleAnecdotes.sort((a, b) => b.votes - a.votes).map(anecdote =>
          <div key={anecdote.id}>
            <div>  
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={this.handleVote(anecdote)}>
                vote
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
}

const anecdotesToShow = (anecdotes, filter) => {
  return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
}

const mapStateToProps = (state) => {
  return {
    visibleAnecdotes: anecdotesToShow(state.anecdotes, state.filter)
  }
}

const ConnectedAnecdoteList = connect(
  mapStateToProps,
  {
    setNotification,
    voteAnecdote
  }
)(AnecdoteList)

export default ConnectedAnecdoteList
