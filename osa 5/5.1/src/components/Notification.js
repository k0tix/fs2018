import React from 'react'
import {connect} from 'react-redux'
import {Message} from 'semantic-ui-react'

const style = {
  padding: 10
}

const Notification = (props) => {
  if(props.notification === null) {
    return null
  }

  return(
    <div style={style}>
      <Message color='teal' header={props.notification} />
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