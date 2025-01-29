const express = require('express')
const port = 3000
const app = express()

app.set('view engine','ejs')

app.get('/', (req, res) => {
    return res.render('index')
})

app.get('/about', (req, res) => {
    return res.render('about')
})

app.get('/contact', (req, res) => {
    return res.render('contact')
})

app.listen(port, (error) => {
    if (error) {
        console.log('server error')
        return false
    }
    console.log('server runing on '+port)
})