import blogService from '../services/blogs'

const CREATE = 'CREATE_BLOG'
const INIT = 'INIT_BLOGS'
const LIKE = 'LIKE_BLOG'

const reducer = (store = [], action) => {
    switch(action.type) {
        case CREATE:
            return [...store, action.newBlog]
        case INIT:
            return action.data
        case LIKE:
            const old = store.filter(a => a._id !== action.newBlog._id)
            return [...old, action.newBlog]
        default:
            return store
    }
}

export const blogInitialization = () => {
    return async (dispatch) => {
        const blogs = await blogService.getAll()
        dispatch({
            type: INIT,
            data: blogs
        })
    }
}

export const createBlog = (content) => {
    return async (dispatch) => {
        const newBlog = await blogService.create(content)
        dispatch({
            type: CREATE,
            newBlog
        })
    }
}

export const likeBlog = (blog) => {
    return async (dispatch) => {
        const newBlog = {...blog}
        newBlog.likes = newBlog.likes+1
        await blogService.update(newBlog)
        dispatch({
            type: LIKE,
            newBlog
        })

    }
}

export default reducer