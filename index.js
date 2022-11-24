const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000
const app = express()

// midleware
app.use(cors())
app.use(express.json())



app.get('', async (req, res) => {
    res.send("Carmax server is running")
})

app.listen(port, () => {
    console.log(`Carmax is running on port ${port}`)
})