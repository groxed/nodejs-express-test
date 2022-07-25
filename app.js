const express = require('express')
const port = 3000
const path = require('path')

const app = express()
app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.send("hello world!")
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
