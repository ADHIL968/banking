const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB)
        console.log('connected to db')
    } catch (error) {
        return console.log('error in db')
    }
}

module.exports = connectDB