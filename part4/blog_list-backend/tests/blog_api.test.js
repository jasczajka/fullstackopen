const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const User = require('../models/user')

const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')

const app = require('../app')

const api = supertest(app)
//app, supertest(api), mongoose, assert, helper




describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany()
        const blogArray = helper.initialBlogs
            .map(blog => new Blog(blog))
        const blogPromises = blogArray.map(blog => blog.save())
        await Promise.all(blogPromises)
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        assert.deepStrictEqual(response.body.length, helper.initialBlogs.length)
    })
    test('id property of a blog is returnad as \'id\' and not \'_id\'', async () => {
        const response = await api
            .get('/api/blogs')
        assert(response.body[0].hasOwnProperty('id'))
        assert(!response.body[0].hasOwnProperty('_id'))
    })

    describe('viewing a specific blog', () => {
        test('succeeds with a valid id', async () => {
            const blogsAtStart = await helper.blogsInDb()
            
            const blogToView = blogsAtStart[0]
            
            const resultBlog = await api
                .get(`/api/blogs/${blogToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.deepStrictEqual(resultBlog.body, blogToView)

        })
        
        test('fails with 404 if note does not exist', async () => {
            const nonExistingId = await helper.nonExistingId()

            const resultBlog = await api
                .get(`/api/blogs/${nonExistingId}`)
                .expect(404)
            
        })
    })

})

describe('addition of a new note',  () => { 

    test('succeeds with a valid blog', async () => {
        const newBlog = {
            "title": "cool_blog",
            "author": "johny",
            "url": "test_url",
            "likes": 3
        }

        const blogsBefore = await helper.blogsInDb()
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAfter = await helper.blogsInDb()

        assert.deepStrictEqual(blogsBefore.length + 1, blogsAfter.length)

    })

    test('when posting a blog without likes, it defaults to zero', async () => {
        const blogToInsert  = {
            "title": "cool_blog",
            "author": "johny",
            "url": "test_url"
        }

        const newBlog = (await api
            .post('/api/blogs')
            .send(blogToInsert)
            .expect(201)
            .expect('Content-Type', /application\/json/)
            ).body
        
        assert.deepStrictEqual(newBlog.likes, '0')


    })

    test('fails with 400 if data is invalid', async () => {
        const blogNoUrl = {
            "title": "cool_blog",
            "author": "johny",
        }

        await api
            .post('/api/blogs')
            .send(blogNoUrl)
            .expect(400)


        const blogNoTitle = {
            "author": "johny",
            "url": "test_url"
        }

        

        await api
            .post('/api/blogs')
            .send(blogNoTitle)
            .expect(400)

    })

})
describe('deletion of a blog', () => {
    test('suceeds with a 204 if id is valid', async () => {
        const blogsBefore = await helper.blogsInDb()

        const blogToDelete = blogsBefore[0]
        console.log(blogToDelete)
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
        
        const blogsAfter = await helper.blogsInDb()

        assert.strictEqual(blogsBefore.length - 1, blogsAfter.length)
    })
})
describe('updating a blog updates', () => {
    test('suceeds and updates if id is valid', async () => {
        const blogsBefore = await helper.blogsInDb()

        
        let blogToUpdate = blogsBefore[0]
        const authorBefore = blogToUpdate.author
        const id = blogToUpdate.id


        blogToUpdate.author = 'changed author'
        delete blogToUpdate.id

        const updatedBlog = (
                await api
                    .put(`/api/blogs/${id}`)
                    .send(blogToUpdate)
                    .expect(200)
                )   
            .body

        assert.deepEqual('changed author', updatedBlog.author)



    })
})


describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany()
  
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
        
        await user.save()

    })
    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()
  
        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }
  
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    
        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }
    
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})


after(async () => {mongoose.connection.close()})