const dotenv = require('dotenv')
dotenv.config()
module.exports = {
    PORT: process.env.PORT,
    METEO_API_KEY: process.env.METEO_API_KEY,
    CITY_API_KEY: process.env.CITY_API_KEY
}