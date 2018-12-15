const text = null

const SET = 'SET_NOTIFICATION'
const REMOVE = 'REMOVE_NOTIFICATION'

const reducer = (store = text, action) => {
      switch(action.type) {
      case SET:
            return action.text
      case REMOVE:
            return null
      default:
            return store
      }

}

export const setNotification = (text, time) => {
      return async(dispatch) => {
            dispatch({
                  type: SET,
                  text
            })
            setTimeout(() => {
                  dispatch({
                        type: REMOVE
                  })
            }, time * 1000)
      }
}


export default reducer