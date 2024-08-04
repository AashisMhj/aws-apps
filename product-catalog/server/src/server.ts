import { fastify, FastifyInstance } from 'fastify';
import pino from 'pino';
import DBPlugin from './models/db';
import Routes from './routes/index';
const Port = process.env.PORT || 7000;
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/product-catalog';
const server = fastify({
    logger: pino({ level: 'info' })
});

server.register(DBPlugin, {uri});
server.register(Routes);

const start = async () => {
    try {
        await server.listen({host: '0.0.0.0', port: 5000});
        console.log('Server started successfully');
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();