const User = require('../model/User')
const Bank = require('../model/Bank')
const Upi = require('../model/Upi')
const Transaction = require('../model/Transaction')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const dayjs = require('dayjs')

exports.getLogin = (req, res) => {
    return res.render('bank/login', { msg: '', color: '' })
}

exports.login = async (req, res) => {
    try {
        const finder = await Bank.findOne({ email: req.body.email })
        if (!finder) {
            return res.render('bank/login', { msg: 'no user found', color: 'red' })
        }
        const validate = await finder.validateBankPassword(req.body.password)
        if (!validate) {
            return res.render('bank/login', { msg: 'incorrect password', color: 'red' })
        }
        const token = await finder.createUserToken()
        return res.cookie('bankToken', token, { httpOnly: true }).redirect('/bank')
    } catch (error) {
        console.log(error)
        return res.render('bank/login', { msg: 'unexpected error , please try again', color: 'red' })
    }
}

exports.getHome = async (req, res) => {
    try {
        const rejectedUser = await User.find({ rejected: true })
        const users = await User.find({ applied: true, approved: false, rejected: false })
        return res.render('bank/home', { users, rejectedUser })
    } catch (error) {
        console.log(error)
        return res.redirect('/bank/error')
    }
}


exports.approveAccount = async (req, res) => {
    try {
        const finder = await User.findOne({ id: req.params.id })
        finder.approved = true
        finder.rejected = false
        finder.accountNumber = `4690${Date.now()}`
        finder.upi = `${finder.email.split('@')[0]}@oksbi`
        await finder.save()
        await Upi.create({
            id: crypto.randomUUID(),
            photograph: finder.photograph,
            name: finder.name,
            accountNumber: finder.accountNumber,
            upi: `${finder.email.split('@')[0]}@oksbi`
        })
        return res.redirect('/bank')
    } catch (error) {
        console.log(error)
        return res.redirect('/bank/error')
    }
}

exports.rejectAccount = async (req, res) => {
    try {
        const finder = await User.findOne({ id: req.params.id })
        finder.rejected = true
        await finder.save()
        return res.redirect('/bank')
    } catch (error) {
        console.log(error)
        return res.redirect('/bank/error')
    }

}

exports.getAccounts = async (req, res) => {
    try {
        const rejectedUser = await User.find({ rejected: true })
        const users = await User.find({ applied: true, approved: false, rejected: false })
        const account = await User.find({ approved: true })
        return res.render('bank/accounts', { users, account, rejectedUser })
    } catch (error) {
        console.log(error)
        return res.redirect('/bank/error')
    }
}

exports.getViewProfile = async (req, res) => {
    try {
        const rejectedUser = await User.find({ rejected: true })
        const users = await User.find({ applied: true, approved: false, rejected: false })
        const finder = await User.findOne({ id: req.params.id })
        if (!finder) {
            return res.render('bank/error')
        }
        return res.render('bank/view-profile', { users, finder, rejectedUser })
    } catch (error) {
        console.log(error)
        return res.redirect('/bank/error')
    }
}

exports.credit = async (req, res) => {
    try {
        const finder = await User.findOne({ id: req.params.id })
        finder.balance = parseInt(finder.balance) + parseInt(req.body.amount)
        await finder.save()
        await Transaction.create({
            id: crypto.randomUUID(),
            senderAccount: 'cash deposit from bank',
            senderUpi: 'cash deposit from bank',
            recieverAccount: finder.accountNumber.toLowerCase(),
            recieverUpi: finder.upi.toLowerCase(),
            amount: req.body.amount,
            date:dayjs().format('DD-MM-YY HH:mm:ss')
        })
        return res.redirect(`/bank/account/${req.params.id}/view`)
    } catch (error) {
        console.log(error)
        return res.redirect('/bank/error')
    }
}

exports.debit = async (req, res) => {
    try {
        const finder = await User.findOne({ id: req.params.id })
        finder.balance = parseInt(finder.balance) - parseInt(req.body.amount)
        await finder.save()
        await Transaction.create({
            id: crypto.randomUUID(),
            senderAccount: finder.accountNumber,
            senderUpi: finder.upi.toLowerCase(),
            recieverAccount: 'cash debit from bank',
            recieverUpi: 'cash debit from bank',
            amount: req.body.amount,
            date:dayjs().format('DD-MM-YY HH:mm:ss')
        })
        return res.redirect(`/bank/account/${req.params.id}/view`)
    } catch (error) {
        console.log(error)
        return res.redirect('/bank/error')
    }
}

exports.getRejected = async (req, res) => {
    try {
        const rejectedUser = await User.find({ rejected: true })
        const users = await User.find({ applied: true, approved: false, rejected: false })
        const account = await User.find({ rejected: true })
        return res.render('bank/rejected', { users, account, rejectedUser })
    } catch (error) {
        console.log(error)
        return res.redirect('/bank/error')
    }
}

exports.getRejectedProfile = async (req, res) => {
    try {
        const rejectedUser = await User.find({ rejected: true })
        const users = await User.find({ applied: true, approved: false, rejected: false })
        const finder = await User.findOne({ id: req.params.id })
        return res.render('bank/rejected-profile', { users, finder, rejectedUser })
    } catch (error) {
        console.log(error)
        return res.redirect('/bank/error')
    }
}

exports.error = (req, res) => {
    return res.render('bank/error')
}

exports.logout = (req, res) => {
    return res.clearCookie('bankToken').redirect('/bank')
}