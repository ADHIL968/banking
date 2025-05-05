const express = require('express')
const router = express.Router()

const { isLoggedIn } = require('../middleware/user')
const { getSignup, signup, getLogin, login, logout } = require('../controller/userAuth')

router
    .route('/signup')
    .get(getSignup)
    .post(signup)

router
    .route('/login')
    .get(isLoggedIn, getLogin)
    .post(login)

router
    .route('/logout')
    .get(logout)

module.exports = router