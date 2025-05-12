const mongoose = require('mongoose')


const transaction = new mongoose.Schema(
    {
        id: String,
        senderAccount: String,
        senderUpi: String,
        recieverAccount: String,
        recieverUpi: String,
        amount: String,
        date: String,
        mode:String
    }
)


module.exports = mongoose.model('Transaction', transaction)
