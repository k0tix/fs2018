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

export const setNotification = (text) => {
    return {
        type: SET,
        text
    }
}

export const removeNotification = () => {
    return {
        type: REMOVE
    }
}

export default reducer