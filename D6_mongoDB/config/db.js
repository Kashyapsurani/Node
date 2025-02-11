const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/");
const db = mongoose.connection;

db.once('open', (error) => {
    if (error) {
        console.log(`Error: ${error}`);
        return false;
    }
    console.log('Connected to MongoDB');
});

module.exports = mongoose;