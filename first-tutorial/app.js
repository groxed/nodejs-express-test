const express = require('express')
const port = 3000
const path = require('path')
const books = require('./booksRouter')
const {sendReqTime} = require('./middlewares')

const app = express()
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/books', books)
app.use(sendReqTime)
app.use((err, req, res, next)=>{
    console.log(err.stack)
    res.status(500).send('error occurred')
})

app.get('/', (req, res) => {
    res.send("hello world!")
})

app.get('/test-middleware', (req, res)=>{
    res.send(`request time is ${req.requestTime} <br />`)
})

app.post('/', (req,res)=>{
    res.send("post request")
})

app.put('/user', (req,res)=>{
    res.send("put request at /user")
})

app.delete('/user', (req,res)=>{
    res.send("delete request at /user")
})

app.listen(port, () => { 
    console.log(`listening on port ${port}`)
})
