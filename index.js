const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;
require('dotenv').config()

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1uor19o.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const skillsCollection = client.db('portfolio').collection('skills')
        const projectCollection = client.db('portfolio').collection('projects')
        const blogsCollection = client.db('portfolio').collection('blogs')

        app.get('/skills', async (req, res) => {
            const skills = await skillsCollection.find({}).toArray()
            res.send(skills)
        })

        // projects
        app.get('/projects', async (req, res) => {
            const projects = await projectCollection.find({}).toArray()
            res.send(projects)
        })

        app.post('/projects', async (req, res) => {
            const project = req.body
            const result = await projectCollection.insertOne(project)
            res.send(result)
        })
        app.delete('/projects/:name', async (req, res) => {
            const name = req.params.name
            const filter = {name:name}
            const result = await projectCollection.deleteOne(filter)
            res.send(result)
        })

        // blogs
        app.post('/blogs', async (req, res) => {
            const blog = req.body
            const result = await blogsCollection.insertOne(blog)
            res.send(result)
        })
        app.get('/blogs', async (req, res) => {
            const result = await blogsCollection.find({}).toArray()
            res.send(result)
        })
        app.get('/blogs/:name', async (req, res) => {
            const name = req.params.name
            const query = { title: name }
            const result = await blogsCollection.findOne(query)
            res.send(result)
        })
        app.put('/blogs/:id', async (req, res) => {
            const id = req.params.id
            const blog = req.body
            const { title, body, tags, date } = blog
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            if (blog.img) {
                const updatedDoc = {
                    $set: {
                        title, body, tags, date, img: blog.img
                    }
                }
                const result = await blogsCollection.updateOne(filter, updatedDoc, options)
                res.send(result)
            }
            else {
                const updatedDoc = {
                    $set: {
                        title, body, tags, date
                    }
                }
                const result = await blogsCollection.updateOne(filter, updatedDoc, options)
                res.send(result)
                
            }
        })
        app.delete('/blogs/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const result = await blogsCollection.deleteOne(filter)
            res.send(result)
        })



    } finally { }
}
run().catch(err => console.error(err))


app.get('/', (req, res) => {
    res.send('Portfolio Server is running...')
}),

    app.listen(port, () => {
        console.log(`portfolio server is running on ${port}`)
    })