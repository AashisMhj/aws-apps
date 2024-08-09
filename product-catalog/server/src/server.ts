import { fastify, } from 'fastify';
import pino from 'pino';
import mercurius from 'mercurius';
import cors from '@fastify/cors';
//
import DBPlugin from './models/db';
import schema from './schema';
import resolvers from './resolver';
import Routes from './routes/index';

const PortEnv = process.env.PORT || '5000' ;
const port = parseInt(PortEnv)
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/product-catalog';
const server = fastify({
    logger: pino({ level: 'info' })
});

server.register(cors, {})
server.register(DBPlugin, {uri});
server.register(mercurius,{
    schema,
    resolvers,
    graphiql: 'graphiql'
})
server.register(Routes);


const start = async () => {
    try {
        await server.listen({host: '0.0.0.0', port: port});
        console.log('Server started successfully');
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();