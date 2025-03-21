const mongoose =require('mongoose')



const CourseShcema= new mongoose.Schema({
    title:String,
    description:String,
    instructor:String,
    rating :Number,
    price:Number

})

module.exports = mongoose.model("Courese", CourseShcema)
