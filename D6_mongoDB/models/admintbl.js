const mongoose = require('mongoose')

const addminSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    phone :{
        type: Number,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    image: {
        type: String,
        require :true
    }
})

const andim = mongoose.model('admin', addminSchema)

module.exports = andim