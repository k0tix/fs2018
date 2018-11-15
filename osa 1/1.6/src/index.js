import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            good: 0,
            neutral: 0,
            bad: 0
        }
    }

    render() {
        const addReview = (type) => {
            return () => {
                this.setState({
                    [type]: this.state[type] + 1
                })
            }
        }
        return (
            <div>
                <h1>anna palautetta</h1>

                <Button buttonPress={addReview('good')} name='hyvä' />
                <Button buttonPress={addReview('neutral')} name='neutraali' />
                <Button buttonPress={addReview('bad')} name='huono' />

                <h2>statistiikka</h2>

                <Statistics good={this.state.good} neutral={this.state.neutral} bad={this.state.bad} />
            </div>
        )
    }
}

const Button = ({ name, buttonPress }) => {
    return (

        <button onClick={buttonPress}> {name} </button>

    )
}

const Statistics = ({ good, neutral, bad }) => {
    if (good + neutral + bad === 0) {
        return (
            <div>
                <p>yhtään palautetta ei ole annettu</p>
            </div>
        )
    } else {
        return (
            <table>
                <tbody>
                    <Statistic name='hyvä' value={good} />
                    <Statistic name='neutraali' value={neutral} />
                    <Statistic name='huono' value={bad} />
                    <Statistic name='keskiarvo' value={((good + bad * -1) / (good + neutral + bad)).toFixed(2)} />
                    <Statistic name='positiivisia' value={((good / (good + neutral + bad)) * 100).toFixed(2) + '%'} />
                </tbody>
            </table>
        )
    }
}

const Statistic = ({ name, value }) => {
    return (
        <tr>
            <td>{name}</td>
            <td>{value}</td>
        </tr>
    )
}


ReactDOM.render(<App />, document.getElementById('root'));