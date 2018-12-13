import React from 'react'
import {connect} from 'react-redux'

const style = {
  border: 'solid',
  padding: 10,
  borderWidth: 1
}

const Notification = (props) => {
  if(props.notification === null) {
    return null
  }

  return(
    <div style={style}>
      {props.notification}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification
  }
}

const ConnectedNotification = connect(
  mapStateToProps
)(Notification)

export default ConnectedNotification