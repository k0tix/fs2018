import React from 'react'
import {connect} from 'react-redux'
import {setFilter} from '../reducers/filterReducer'


class Filter extends React.Component {
    handleChange = (event) => {
      // input-kentän arvo muuttujassa event.target.value
      event.preventDefault()
      this.props.setFilter(event.target.value)
    }
    render() {
      const style = {
        marginBottom: 10
      }
  
      return (
        <div style={style}>
          filter <input onChange={this.handleChange}/>
        </div>
      )
    }
  }

  const mapStateToProps = (state) => {
    return {
      filter: state.filter
    }
  }
  
  const ConnectedFilter = connect(
    mapStateToProps,
    {setFilter}
  )(Filter)

  export default ConnectedFilter