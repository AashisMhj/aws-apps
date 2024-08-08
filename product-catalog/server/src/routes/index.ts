import { FastifyInstance } from "fastify";
import fp from 'fastify-plugin'

async function routes (fastify:FastifyInstance, options:Object){
    const collection = fastify.db;

    fastify.get('/', async (request, reply)=>{
        return {hello: 'world'}
    });
}

export default fp(routes);