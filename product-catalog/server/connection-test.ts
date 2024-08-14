import mongoose from "mongoose";
import * as dotenv from 'dotenv';
dotenv.config();

console.log(process.env.DB_URL)

const db =  mongoose.connect(process.env.DB_URL || '', {
    // ssl: true,
    // tlsCertificateKeyFile: './global-bundle.pem'
    // tls: true,
    // tlsCAFile:  `./global-bundle.pem`
}).then(connected =>{
    console.log('connected')
}).catch(err => {
    console.log(err);
})