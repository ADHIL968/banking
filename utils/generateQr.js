const QRCode = require('qrcode')

const createQr = QRCode.toDataURL(url, (err, qrCodeUrl) => {
    if (err) {
        return res.redirect('/error')
    }
    var a = qrCodeUrl
    return res.render('user/home', { finder, a })
})

module.exports = createQr