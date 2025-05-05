const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const user = new mongoose.Schema(
    {
        id: String,
        email: String,
        password: String,
        pin: {
            type: String,
            default:""
        },
        approved: {
            type: Boolean,
            default: false
        },
        applied: {
            type: Boolean,
            default: false
        },
        rejected: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            default: ""
        },
        dob: {
            type: String,
            default: ""
        },
        aadhar: {
            type: String,
            default: ""
        },
        mobile: {
            type: String,
            default: ""
        },
        house: {
            type: String,
            default: ""
        },
        street: {
            type: String,
            default: ""
        },
        pincode: {
            type: String,
            default: ""
        },
        district: {
            type: String,
            default: ""
        },
        photograph: {
            type: String,
            default: ""
        },
        accountNumber: {
            type: String,
            default: ""
        },
        balance: {
            type: String,
            default: "0"
        },
        upi: {
            type: String,
            default: ""
        },
    }
)

user.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

user.methods.validateUserPassword = async function (userpassword) {
    return await bcrypt.compare(userpassword, this.password)
}

user.methods.createUserToken = function () {
    return jwt.sign(
        {
            name: this.name,
            id: this.id
        }, process.env.JWT_SECRET,
        // { expiresIn: "1h" }
    )
}

module.exports = mongoose.model('User', user)
