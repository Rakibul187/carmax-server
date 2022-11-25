const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { json } = require('express');
const port = process.env.PORT || 5000
const app = express()
require("dotenv").config()

// midleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.farjvzi.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        const productsColection = client.db("carmax").collection("products")
        const categoriesColection = client.db("carmax").collection("categories")

        app.get("/categories", async (req, res) => {
            const query = {}
            const categories = await categoriesColection.find(query).toArray()
            res.send(categories)
        })

        app.get("/category/:Category", async (req, res) => {
            const category = req.params.Category
            const query = {
                Category: category
            }
            const products = await productsColection.find(query).toArray()
            res.send(products)
        })

        app.get("/products", async (req, res) => {
            const query = {}
            const products = await productsColection.find(query).toArray()
            res.send(products)
        })
    }
    finally {

    }
}
run().catch(console.log)


app.get('', async (req, res) => {
    res.send("Carmax server is running")
})

app.listen(port, () => {
    console.log(`Carmax is running on port ${port}`)
})