const express = require('express')
const router = express.Router()

const { isLoggedIn, validateBankToken } = require('../middleware/bank')
const { getHome, approveAccount, getLogin, login, logout, sendMoney, verifyPayment, validateUpi, getAccounts, getViewProfile, credit, debit, rejectAccount, error, getRejected, getRejectedProfile } = require('../controller/bank')


router
    .route('/login')
    .get(isLoggedIn, getLogin)
    .post(login)
router
    .route('/')
    .get(validateBankToken, getHome)
router
    .route('/approveaccount/:id')
    .get(validateBankToken, approveAccount)
router
    .route('/rejectaccount/:id')
    .get(validateBankToken, rejectAccount)
router
    .route('/accounts')
    .get(validateBankToken, getAccounts)
router
    .route('/account/:id/view')
    .get(validateBankToken, getViewProfile)
router
    .route('/rejected')
    .get(validateBankToken, getRejected)
router
    .route('/rejected/:id/view')
    .get(validateBankToken, getRejectedProfile)
router
    .route('/account/:id/credit')
    .post(validateBankToken, credit)
router
    .route('/account/:id/debit')
    .post(validateBankToken, debit)
router
    .route('error')
    .get(error)
router
    .route('/logout')
    .get(logout)

module.exports = router