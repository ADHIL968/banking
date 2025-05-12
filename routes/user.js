const express = require('express')
const router = express.Router()

const { getHome, getCreateAccount, createAccount, getSendMoney, getSuccess, getNoBalance, getError, getTransaction, getSelectedUpi, sendMoney, incorrectPin, sendToAccount } = require('../controller/user')

router
    .route('/createaccount')
    // .get(getCreateAccount)
    .post(createAccount)

router
    .route('/')
    .get(getHome)

router
    .route('/sendmoney')
    .get(getSendMoney)

router
    .route('/sendtoaccount')
    .post(sendToAccount)

router
    .route('/success/:accountNumber')
    .get(getSuccess)

router
    .route('/insufficientbalance/:accountNumber')
    .get(getNoBalance)

router
    .route('/transaction')
    .get(getTransaction)

router
    .route('/sendmoney/:accountNumber/send')
    .get(getSelectedUpi)
    .post(sendMoney)
router
    .route('/incorrectpin/:accountNumber')
    .get(incorrectPin)
    
router
    .route('/error')
    .get(getError)


module.exports = router