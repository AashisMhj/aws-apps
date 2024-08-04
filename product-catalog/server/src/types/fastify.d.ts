import 'fastify';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';

declare module 'fastify' {
    interface FastifyInstance{
        db: {
            models: {
                ProductSchema: Product,
                CategorySchema: Category
            }
        }
    }
}