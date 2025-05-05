const mongoose = require('mongoose')


const upi = new mongoose.Schema(
    {
        id: String,
        photograph:String,
        name:String,
        accountNumber: String,
        upi: String
    }
)


module.exports = mongoose.model('Upi', upi)
