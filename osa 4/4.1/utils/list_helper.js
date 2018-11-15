const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.map(blog => blog.likes).reduce((a, b) => a + b, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((previous, current) => (previous.likes > current.likes) ? previous : current)
}

const mostBlogs = (blogs) => {
    let frequency = {}
    let max = 0
    let result
    for (i in blogs) {
        frequency[blogs[i].author] = (frequency[blogs[i].author] || 0) + 1
        if (frequency[blogs[i].author] > max) {
            max = frequency[blogs[i].author]
            result = {
                author: blogs[i].author,
                blogs: max
            }
        }
    }

    return result
}

const mostLikes = (blogs) => {
    let frequency = {}
    let max = 0
    let result
    for(i in blogs) {
        frequency[blogs[i].author] = (frequency[blogs[i].author] || 0) + blogs[i].likes
        if(frequency[blogs[i].author] > max) {
            max = frequency[blogs[i].author]
            result = {
                author: blogs[i].author,
                likes: max
            }
        }
    }

    return result
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}