import * as dotenv from 'dotenv'
import * as process from 'process'

process.env.NODE_ENV = process.env.NODE_ENV || 'develop'

if (process.env.NODE_ENV === 'develop') {
    dotenv.config({ path: '.env.dev' })
} else if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: '.env.test' })
} else if (process.env.NODE_ENV === 'staging'){
    dotenv.config({ path: '.env' })
}