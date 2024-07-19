const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce( (accumulator, currentValue) => accumulator + currentValue.likes, 0)
}

const favoriteBlog = (blogs) => {
    const maxLikes = Math.max(...(blogs.map(blog => blog.likes)))
    const favoriteBlog =  blogs.find(blog => blog.likes == maxLikes)
    return {
        title: favoriteBlog.title,
        author: favoriteBlog.author,
        likes: favoriteBlog.likes
    }
}

const mostBlogs = (blogs) => {
    const authorsBlogCount = []
    blogs.forEach(blog => { 
        const index = authorsBlogCount.findIndex(authorCount => authorCount.author === blog.author)
        if( index === -1){
            authorsBlogCount.push({
                author: blog.author,
                blogs: 1
            })
        }
        else{
            authorsBlogCount[index].blogs += 1
        }
    })
    const mostProlificAuthor = authorsBlogCount.sort((a, b) => {
        if(a.count < b.count){
            return -1
        }
        if (a.count > b.count){
            return 1;
        }
        return 0
    })
    [authorsBlogCount.length-1]
    return {author, blogs} = mostProlificAuthor
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}