import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: 0
        }
    }

    randomAnecdote = () => {
        this.setState({ selected: Math.floor(Math.random() * anecdotes.length) })
    }

    voteCurrent = () => {
        const copy = [...points]
        copy[this.state.selected] += 1
        points = copy
        this.forceUpdate()
    }

    render() {
        return (
            <div>
                <Anecdote index={this.state.selected} />
                <Button handleClick={this.voteCurrent} text='vote' />
                <Button handleClick={this.randomAnecdote} text='next anecdote' />

                <h2>anecdote with most votes:</h2>

                <Anecdote index={points.indexOf(Math.max.apply(Math, points))} />
            </div>
        )
    }
}

const Anecdote = ({ index }) => {
    return (
        <div>
            <p>{anecdotes[index]}</p>
            <p>has {points[index]} votes </p>
        </div>
    )
}

const Button = ({ handleClick, text }) => {
    return (
        <button onClick={handleClick}>{text}</button>
    )
}

const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

var points = anecdotes.map(anecdotes => 0)

ReactDOM.render(
    <App anecdotes={anecdotes} />,
    document.getElementById('root')
)
