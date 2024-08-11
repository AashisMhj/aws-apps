import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import mongoose from 'mongoose';
//
import ProductSchema from './Product';
import CategorySchema from './Category';
import PreOrderSchema from './PreOrder';
import { insertData } from '../insert';
const models = {
    ProductSchema, CategorySchema, PreOrderSchema
}

const ConnectDB = async (fastify:FastifyInstance, options: {uri:string}) =>{
    try {
        // mongoose.connection.on('connected', ()=>{
        //     fastify.log.info({actor: 'MongoDB'}, 'connected');
        // });
        // mongoose.connection.on('disconnected', () => {
        //     fastify.log.error({ actor: 'MongoDB' }, 'disconnected');
        // });
        // mongoose.connection.on('error', (error)=>{
        //     console.log(error);
        // });
        console.log(options.uri);
        const db = await mongoose.connect(options.uri, {});
        // insert data
        const products = await ProductSchema.countDocuments();
        if(products === 0){
            await insertData();
        }
        // decorates fastify with our model
        fastify.decorate('db', { models });
    } catch (error) {
        console.error(error);
    }
}

export default fp(ConnectDB);