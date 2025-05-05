const cloudinary = require('cloudinary').v2
const User = require('../model/User')
const Upi = require('../model/Upi')
const Transaction = require('../model/Transaction')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const dayjs = require('dayjs')
const QRCode = require('qrcode')

// exports.getCreateAccount = (req, res) => {
//     return res.render('user/create-account')
// }
exports.createAccount = async (req, res) => {
    try {
        const finder = await User.findOne({ id: req.user.id })
        const uploadResult = await cloudinary.uploader.upload(req.files.photograph.tempFilePath)
        finder.name = req.body.name.toLowerCase()
        finder.aadhar = req.body.aadhar
        finder.mobile = req.body.mobile
        finder.dob = req.body.dob
        finder.house = req.body.house.toLowerCase()
        finder.street = req.body.street.toLowerCase()
        finder.pincode = req.body.pincode
        finder.district = req.body.district.toLowerCase()
        finder.photograph = uploadResult.url
        finder.applied = true
        finder.pin = req.body.pin
        await finder.save()
        return res.redirect('/')
    } catch (error) {
        console.log(error)
        return res.redirect('/error')
    }
}

exports.getHome = async (req, res) => {
    try {
        const finder = await User.findOne({ id: req.user.id })
        if (!finder.approved) {
            return res.clearCookie('userToken').render('user/create-account', { applied: finder.applied, rejected: finder.rejected })
        }
        const url = req.protocol + '://' + req.get('host') + '/sendmoney/' + finder.accountNumber + '/send'
        console.log(url)
        QRCode.toDataURL(url, (err, qrCodeUrl) => {
            if (err) {
                return res.redirect('/error')
            }
            var a = qrCodeUrl
            return res.render('user/home', { finder, a })
        })
    } catch (error) {
        console.log(error)
        return res.redirect('/login')
    }
}

exports.getSendMoney = async (req, res) => {
    try {
        const finder = await User.findOne({ id: req.user.id })
        const upi = await Upi.find({ accountNumber: { $ne: finder.accountNumber } })
        return res.render('user/send-money', { finder, upi })
    } catch (error) {
        console.log(error)
        return res.redirect('/error')
    }
}

exports.getSelectedUpi = async (req, res) => {
    try {
        const finder = await User.findOne({ id: req.user.id })
        const reciever = await User.findOne({ accountNumber: req.params.accountNumber })
        if (reciever.accountNumber == finder.accountNumber) {
            return res.redirect('/error')
        }
        reciever.name = reciever.name.toUpperCase()
        const transaction = await Transaction.find({ $or: [{ senderAccount: reciever.accountNumber, recieverAccount: finder.accountNumber }, { recieverAccount: reciever.accountNumber, senderAccount: finder.accountNumber }] }).sort({ createdAt: -1 })
        return res.render('user/selected-upi', { finder, reciever, transaction })
    } catch (error) {
        console.log(error)
        return res.redirect('/error')
    }
}


exports.incorrectPin = (req, res) => {
    try {
        return res.render('user/incorrect-pin', { accountNumber: req.params.accountNumber })
    } catch (error) {
        console.log(error)
        return res.redirect('/error')
    }
}

exports.sendMoney = async (req, res) => {
    try {
        const { amount, pin } = req.body
        const sender = await User.findOne({ id: req.user.id })
        const reciever = await User.findOne({ accountNumber: req.params.accountNumber })
        if (sender.pin != pin) {
            return res.redirect(`/incorrectpin/${reciever.accountNumber}`)
        }
        if (parseInt(sender.balance) < parseInt(amount)) {
            return res.redirect(`/insufficientbalance/${reciever.accountNumber}`)
        }
        sender.balance = parseInt(sender.balance) - parseInt(amount)
        await sender.save()
        reciever.balance = parseInt(reciever.balance) + parseInt(amount)
        await reciever.save()
        await Transaction.create({
            id: crypto.randomUUID(),
            senderAccount: sender.accountNumber,
            senderUpi: sender.upi,
            recieverAccount: reciever.accountNumber,
            recieverUpi: reciever.upi,
            amount: amount,
            date: dayjs().format('DD-MM-YY HH:mm:ss')
        })
        return res.redirect(`/success/${reciever.accountNumber}`)
    } catch (error) {
        console.log(error)
        return res.redirect('/error')
    }
}

exports.getTransaction = async (req, res) => {
    try {
        const finder = await User.findOne({ id: req.user.id })
        const transaction = await Transaction.find({ $or: [{ senderAccount: finder.accountNumber }, { recieverAccount: finder.accountNumber }] })
        return res.render('user/transaction', { finder, transaction })
    } catch (error) {
        console.log(error)
        return res.redirect('/error')
    }
}

exports.getNoBalance = (req, res) => {
    return res.render('user/no-balance', { accountNumber: req.params.accountNumber })
}

exports.getSuccess = (req, res) => {
    return res.render('user/success', { accountNumber: req.params.accountNumber })
}

exports.getError = (req, res) => {
    return res.render('user/error')
}