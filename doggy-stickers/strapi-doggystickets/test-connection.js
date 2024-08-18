const pg = require('pg');
const {Client} = pg;
const fs = require('fs');
const dotenv = require('dotenv')
dotenv.config();

const client = new Client({
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: 5432,
    database: process.env.DATABASE_NAME,
    ssl: {
        rejectUnauthorized: false,
        ca: fs.readFileSync('./us-east-1-bundle.pem').toString()
    }
})

client.connect().then(res => {
    console.log('connected');
    console.log(res);
})
.catch(err => {
    console.log(err)
})