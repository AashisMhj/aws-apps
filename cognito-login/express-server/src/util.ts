import jwt from 'jsonwebtoken';
import { JWT_ERRORS } from './types';

export const verifyAccessToken = (token:string)=>{
    try {
        const decoded = jwt.decode(token, {complete: true});
        if(!decoded) return JWT_ERRORS.INVALID_TOKEN;
        const now = Math.floor(Date.now()/1000);
        console.log(decoded.payload);
        // if(decoded.payload.exp < now){
        // }
        return JWT_ERRORS.TOKEN_EXPIRED
        return decoded;
    } catch (error) {
        return JWT_ERRORS.INVALID_TOKEN;
    }
}