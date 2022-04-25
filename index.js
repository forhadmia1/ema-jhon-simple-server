const express = require('express');
const cors = require('cors')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.netu2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const productsCollection = client.db('emajhon').collection('Products')

        app.get('/product', async (req, res) => {
            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)
            const cursor = productsCollection.find({})
            const result = await cursor.skip(page * size).limit(size).toArray();
            res.send(result)
        })

        //data count 
        app.get('/productcount', async (req, res) => {
            const query = {}
            const cursor = productsCollection.find(query)
            const count = await productsCollection.estimatedDocumentCount();
            res.send({ count })
        })
        //get products by post mehod 
        app.post('/productsbykeys', async (req, res) => {
            const keys = req.body;
            const ids = keys.map(key => ObjectId(key))
            const query = { _id: { $in: ids } }
            const cursor = productsCollection.find(query)
            const result = await cursor.toArray();
            res.send(result)
        })






    } finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('hello server is running')
})

app.listen(port, () => {
    console.log('listening port is', port)
})