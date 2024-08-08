import 'fastify';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { PreOrder } from '@/models/PreOrder';

declare module 'fastify' {
    interface FastifyInstance{
        db: {
            models: {
                ProductSchema: Product,
                CategorySchema: Category,
                PreOrderSchema: PreOrder
            }
        }
    }
}