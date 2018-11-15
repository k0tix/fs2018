import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import feedbackReducer from './reducer'

const store = createStore(feedbackReducer)

const Statistics = () => {
  const state = store.getState()
  const ratings = state.good + state.neutral + state.bad

  if (ratings === 0) {
    return (
      <div>
        <h2>statistics</h2>
        <div>no feedback given yet :(</div>
      </div>
    )
  }

  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <tr>
            <td>good</td>
            <td>{state.good}</td>
          </tr>
          <tr>
            <td>neutral</td>
            <td>{state.neutral}</td>
          </tr>
          <tr>
            <td>bad</td>
            <td>{state.bad}</td>
          </tr>
          <tr>
            <td>average</td>
            <td>{((state.good + (state.bad * -1)) / (state.good + state.neutral + state.bad)).toFixed(2)}</td>
          </tr>
          <tr>
            <td>positives</td>
            <td>{(state.good / (state.bad + state.good + state.neutral) * 100).toFixed(2)}%</td>
          </tr>
        </tbody>
      </table>

      <button onClick={e => store.dispatch({type: 'ZERO'})}>reset feedback</button>
    </div>
  )
}

class App extends React.Component {
  render() {
    return (
      <div>
        <h2>give feedback</h2>
        <button onClick={e => store.dispatch({type : 'GOOD'})}>good</button>
        <button onClick={e => store.dispatch({type : 'OK'})}>neutral</button>
        <button onClick={e => store.dispatch({type : 'BAD'})}>bad</button>
        <Statistics />
      </div>
    );
  }
}


const renderApp = () => {
    ReactDOM.render(<App />, document.getElementById('root'));
}

renderApp()
store.subscribe(renderApp)



