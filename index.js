const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 7000
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