const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const bank = new mongoose.Schema(
    {
        id: String,
        email: String,
        password: String,
    }
)

bank.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

bank.methods.validateBankPassword = async function (userpassword) {
    return await bcrypt.compare(userpassword, this.password)
}

bank.methods.createUserToken = function () {
    return jwt.sign(
        {
            email: this.email,
            id: this.id
        }, process.env.JWT_SECRET
    )
}

module.exports = mongoose.model('Bank', bank)
