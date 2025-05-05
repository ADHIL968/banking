const cloudinary = require('cloudinary').v2

const connectCloudinary = async () => {
    try {
        await cloudinary.config({
            cloud_name: process.env.CLOUDNAME,
            api_key: process.env.APIKEY,
            api_secret: process.env.APISECRET
        })
        console.log('connected to cloudinary')
    } catch (err) {
        console.log(err)
        console.log('cloudinary not connected')
    }
}

module.exports = connectCloudinary
