const express = require('express')
const router = express.Router()
const {displayMethod, displayUrl} = require('./middlewares')

router.use(displayMethod)
router.use(displayUrl)

router.get('/', (req, res) => {
    res.send('books root page')
})

router.get('/buy', (req, res)=>{
    res.send('buy books page')
})

router.get('/buy/:id', (req, res)=>{
    res.send(`buy books by id page with params ${req.params.id}`)
})

module.exports = router