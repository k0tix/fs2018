import userService from '../services/users'

const INIT = 'INIT_USERS'
const LOGIN = 'LOGIN_USER'

const reducer = (state = {user: null, users: null}, action) => {
    switch(action.type) {
        case INIT:
            return Object.assign({}, state, {
                users: action.data
            })
        case LOGIN:
            return Object.assign({}, state, {
                user: action.user
            })
        default:
            return state
    }
}

export const userInitialization = () => {
    return async (dispatch) => {
        const users = await userService.getAll()
        dispatch({
            type: INIT,
            data: users
        })
    }
}

export const setUser = (user) => {
    return (dispatch) => {
        dispatch({
            type: LOGIN,
            user
        })
    }
}

export default reducer