const jwt = require('jsonwebtoken')

exports.isLoggedIn = (req, res, next) => {
    var token = req.cookies.bankToken
    if (token) {
        var decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded) {
            return res.redirect('/bank')
        } else {
            return res.clearCookie('bankToken').render('bank/login', { msg: 'unexpected error', color: 'red' })
        }
    } else {
        next()
    }
}

exports.validateBankToken = (req, res, next) => {
    var token = req.cookies.bankToken
    if (token) {
        var decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded) {
            req.bank = decoded
            next()
        } else {
            return res.clearCookie('bankToken').render('bank/login', { msg: 'token error', color: 'red' })
        }
    } else {
        return res.clearCookie('bankToken').render('bank/login', { msg: 'please login to continue', color: 'red' })
    }
}