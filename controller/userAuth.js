const User = require('../model/User')
const crypto = require('crypto')


exports.getSignup = (req, res) => {
    return res.render('user/signup', { msg: '', color: '' })
}

exports.signup = async (req, res) => {
    try {
        const finder = await User.findOne({ email: req.body.email })
        if (finder) {
            return res.render('user/signup', { msg: 'email already in use', color: 'red' })
        }
        await User.create({
            id: crypto.randomUUID(),
            email: req.body.email,
            password: req.body.password
        })
        return res.redirect('/login')
    } catch (error) {
        console.log(error)
        return res.redirect('/signup')
    }
}


exports.getLogin = (req, res) => {
    return res.render('user/login', { msg: '', color: '' })
}

exports.login = async (req, res) => {
    try {
        const finder = await User.findOne({ email: req.body.email })
        if (!finder) {
            return res.render('user/login', { msg: 'no user found', color: 'red' })
        }
        const validate = await finder.validateUserPassword(req.body.password)
        if (!validate) {
            return res.render('user/login', { msg: 'incorrect password', color: 'red' })
        }
        const token = await finder.createUserToken()
        return res.cookie('userToken', token, { httpOnly: true, maxAge:3600000 }).redirect('/')
    } catch (error) {
        console.log(error)
        return res.render('user/login', { msg: 'unexpected error , please try again', color: 'red' })
    }
}

exports.logout = (req, res) => {
    return res.clearCookie('userToken').redirect('/')
}



// exports.signup = (req, res) => {
//     try {
//         return res.redirect('/signup')
//     } catch (error) {
//         console.log(error)
//         return res.redirect('/signup')
//     }
// }