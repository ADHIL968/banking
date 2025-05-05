require('dotenv').config()
const express = require('express')
const app = express()

app.set('view engine', 'ejs')

const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')


app.use(express.urlencoded())
app.use(cookieParser())
app.use(express.json())
app.use(express.static('static'))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

const connectDatabase = require('./config/database')
const connectCloudinary = require('./config/cloudinary')

const noCache = (req, res, next) => {
    res.set('Cache-Control', 'no-store')
    return next()
}
app.use(noCache)

const { validateUserToken } = require('./middleware/user')
const userAuth = require('./routes/userAuth')
const user = require('./routes/user')
const bank = require('./routes/bank')


app.use('/bank', bank)
app.use('/', userAuth)
app.use('/', validateUserToken, user)

const port = process.env.PORT || 3000
app.listen(port, '192.168.29.63', () => {
    console.log(`server started @ ${port}`)
    connectDatabase()
    connectCloudinary()
})
