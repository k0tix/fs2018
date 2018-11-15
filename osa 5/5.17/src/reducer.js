const initialState = {
    good: 0,
    ok: 0,
    bad: 0
}

const feedbackReducer = (state = initialState, action) => {
    console.log(action)
    const newState = {...state}

    switch (action.type) {
        case 'GOOD':
            newState.good += 1
            return newState
        case 'OK':
            newState.ok += 1
            return newState
        case 'BAD':
            newState.bad += 1
            return newState
        case 'ZERO':
            return initialState
    }
    return newState
}

export default feedbackReducer