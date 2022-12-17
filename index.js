const { MongoClient, ServerApiVersion } = require('mongodb');
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
        
        app.get('/skills', async (req, res) => {
            const skills = await skillsCollection.find({}).toArray()
            res.send(skills)
        })

    } finally {}
}
run().catch(err=>console.error(err))


app.get('/', (req, res) => {
    res.send('Portfolio Server is running...')
}),

app.listen(port, () => {
    console.log(`portfolio server is running on ${port}`)
})