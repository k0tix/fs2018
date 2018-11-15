const filter = ''

const SET = 'SET_FILTER'

const reducer = (store = filter, action) => {
    switch(action.type) {
        case SET:
            return action.filter
        default:
            return store
    }

}

export const setFilter = (filter) => {
    return {
        type: SET,
        filter
    }
}

export default reducer