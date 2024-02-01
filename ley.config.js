const dotenv = require('dotenv')
const { parse } = require('pg-connection-string')

dotenv.config({ path: '.env.development.local' })

const options = parse(process.env.POSTGRES_URL || '')

module.exports = options
