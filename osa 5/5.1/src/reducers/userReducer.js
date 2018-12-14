import userService from '../services/users'

const INIT = 'INIT_USERS'
const LOGIN = 'LOGIN_USER'

const reducer = (store = {user: null, users: null}, action) => {

    const newStore = store

    switch(action.type) {
        case INIT:
            newStore.users = action.users
            return newStore
        case LOGIN:
            newStore.user = action.user
            return newStore
        default:
            return store
    }
}

export const userInitialization = () => {
    return async (dispatch) => {
        const users = await userService.getAll()
        dispatch({
            type: INIT,
            users
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