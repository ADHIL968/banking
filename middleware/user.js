const jwt = require('jsonwebtoken')

exports.isLoggedIn = (req, res, next) => {
    var token = req.cookies.userToken
    if (token) {
        var decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded) {
            return res.redirect('/')
        } else {
            return res.clearCookie('userToken').render('user/login', { msg: 'unexpected error', color: 'red' })
        }
    } else {
        next()
    }
}

exports.validateUserToken = (req, res, next) => {
    var token = req.cookies.userToken
    if (token) {
        try {
            var decoded = jwt.verify(token, process.env.JWT_SECRET)
            if (decoded) {
                req.user = decoded
                next()
            } else {
                return res.clearCookie('userToken').redirect('/')
            }
        } catch (error) {
            return res.clearCookie('userToken').redirect('/')
        }
    } else {
        return res.clearCookie('userToken').render('user/login', { msg: 'please login to continue', color: 'red' })
    }
}