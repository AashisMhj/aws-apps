import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import mongoose from 'mongoose';
//
import ProductSchema from './Product';
import CategorySchema from './Category';
const models = {
    ProductSchema, CategorySchema
}

const ConnectDB = async (fastify:FastifyInstance, options: {uri:string}) =>{
    try {
        mongoose.connection.on('connected', ()=>{
            fastify.log.info({actor: 'MongoDB'}, 'connected');
        });
        mongoose.connection.on('disconnected', () => {
            fastify.log.error({ actor: 'MongoDB' }, 'disconnected');
        });
        const db = await mongoose.connect(options.uri, {});
        // insert data
        // decorates fastify with our model
        fastify.decorate('db', { models });
    } catch (error) {
        console.error(error);
    }
}

export default fp(ConnectDB);