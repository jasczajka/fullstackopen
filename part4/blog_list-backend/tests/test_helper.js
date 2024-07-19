const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        "title": "cool_blog",
        "author": "miranda",
        "url": "test_url",
        "likes": 4
    },
    {
        "title": "cool_blog",
        "author": "johny",
        "url": "test_url",
        "likes": 3
    }
]

const nonExistingId = async () => {
    const blog = new Blog({title:'todelete',
         "author": "johny",
        "url": "test_url"
        })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogsInDb = async () => {
    return (await Blog.find()).map(blog => blog.toJSON())
}
const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const getValidJwtToken = async (api) => {
    const response = await api
        .post('/api/login')
        .send({
            username: 'root',
            password: 'salainen'
        })
}

module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb,
    usersInDb
}