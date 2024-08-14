import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import fs from 'node:fs';
import mongoose from 'mongoose';
//
import ProductSchema from './Product';
import CategorySchema from './Category';
import PreOrderSchema from './PreOrder';
import { insertData } from '../insert';
const models = {
    ProductSchema, CategorySchema, PreOrderSchema
}

const ConnectDB = async (fastify: FastifyInstance, options: { uri: string }) => {
    try {
        console.log(options.uri);
        const db = await mongoose.connect(options.uri, {
            tls: true,
            tlsCAFile:  `./global-bundle.pem`
        });
        // insert data
        const products = await ProductSchema.countDocuments();
        if (products === 0) {
            await insertData();
        }
        // decorates fastify with our model
        fastify.decorate('db', { models });
    } catch (error) {
        console.error(error);
    }
}

export default fp(ConnectDB);