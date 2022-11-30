const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { json, query } = require('express');
const port = process.env.PORT || 5000
const app = express()
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_SECRET);


// midleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.farjvzi.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        const productsColection = client.db("carmax").collection("products")
        const categoriesColection = client.db("carmax").collection("categories")
        const bookingsCollection = client.db("carmax").collection("bookings")
        const usersCollection = client.db("carmax").collection("users")

        app.get("/categories", async (req, res) => {
            const query = {}
            const categories = await categoriesColection.find(query).toArray()
            res.send(categories)
        })

        app.get("/category/:Category", async (req, res) => {
            const category = req.params.Category
            const query = {}
            const products = await productsColection.find(query).toArray()
            const remainingProducts = products.filter(product => product.Category === category)
            res.send(remainingProducts)
        })

        app.get("/products", async (req, res) => {
            const query = {}
            const products = await productsColection.find(query).toArray()
            res.send(products)
        })


        app.delete("/product/:id", async (req, res) => {
            const id = req.params.id
            const query = {
                _id: ObjectId(id)
            }
            const result = await productsColection.deleteOne(query)
            res.send(result)
        })

        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            const query = {
                buyerEmail: email
            }
            const bookings = await bookingsCollection.find(query).toArray()
            res.send(bookings)
        })


        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking)
            res.send(result)
        })

        app.get('/bookings/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const query = {
                _id: ObjectId(id)
            }
            const booking = await bookingsCollection.findOne(query);
            res.send(booking)
        })

        app.post('/create-payment-intent', async (req, res) => {
            const booking = req.body
            console.log(booking)
            const price = booking.resellPrice
            const amount = price * 100
            const paymentIntent = await stripe.paymentIntents.create({
                currency: "usd",
                amount: amount,
                "payment_method_types": [
                    "card"
                ]
            });
            res.send({
                clientSecret: paymentIntent.client_secret
            })
        })

        app.get("/users", async (req, res) => {
            const query = {}
            const users = await usersCollection.find(query).toArray()
            const exceptAdmin = users.filter(user => user.role !== "admin")
            res.send(exceptAdmin)
        })


        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })

        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.role === 'Seller' });
        })

        app.delete("/users/seller/:id", async (req, res) => {
            const id = req.params.id
            const query = {
                _id: ObjectId(id)
            }
            const result = await usersCollection.deleteOne(query)
            res.send(result)
        })

        app.put("/users/seller/verification/:id", async (req, res) => {
            const id = req.params.id
            const filter = {
                _id: ObjectId(id)
            }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    isVerified: true
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })

        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id
            const query = {
                _id: ObjectId(id)
            }
            const result = await usersCollection.deleteOne(query)
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await usersCollection.insertOne(users)
            res.send(result)
        })

        app.post('/addproduct', async (req, res) => {
            const product = req.body;
            const result = await productsColection.insertOne(product)
            res.send(result)
        })

        app.get("/dashboard/myproducts", async (req, res) => {
            const name = req.query.name
            const query = {}
            const products = await productsColection.find(query).toArray()
            const myProduct = products.filter(product => product.sellerNmae === name)
            res.send(myProduct)
        })

        app.get("/users/seller", async (req, res) => {
            const role = req.query.role;
            // console.log(role)
            const query = {
                role: role
            }
            const sellers = await usersCollection.find(query).toArray()
            res.send(sellers)
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