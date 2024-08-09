import ProductSchema from "./models/Product";
import CategorySchema from "./models/Category";

const resolvers = {
    Query: {
        products: async (_:unknown, {count}:{count?:number})=>{
            const limit = count || 10;
            const products = await ProductSchema.find({}).limit(limit);
            return products;
        },
        product: async (_:unknown, obj:{id: string}) =>{
            const {id} = obj;
            const product = await ProductSchema.findById(id);
            return product;
        },
        category: async (_:unknown, obj:{id: string}) =>{
            const {id} = obj;
            const category = await CategorySchema.findById(id);
            return category;
        },
        categories: async(_:unknown, obj:Object) =>{
            const categories = await CategorySchema.find();
            return categories;
        },
        aggregation: async(_:unknown, obj:Object) =>{
            try {
                const categoriesWithCounts = await CategorySchema.aggregate([
                    {
                        $lookup: {
                            from: 'products',
                            localField: '_id',
                            foreignField: 'category_id',
                            as: 'products'
                        }
                    },
                    {
                        $project: {
                            category_name: 1,
                            productCount: {$size: '$products'}
                        }
                    }
                ]);
                return categoriesWithCounts;
            } catch (error) {
                console.log(error);
                return []
            }
        },
        countPreOrder: async(_:unknown, obj:Object)=>{
            try {
                const preOrderCount = await ProductSchema.aggregate([
                    {
                        $lookup: {
                            from: 'preorders',
                            localField: '_id',
                            foreignField: 'product_id',
                            as: 'preorder'
                        },
                    },
                    {
                        $project: {
                            product_name: 1,
                            preOrderCount: {"$ifNull": [{$size: '$preorder'}, 0]},
                            order_quantity: 0
                        }
                    }
                ]);
                console.log(preOrderCount);
                return preOrderCount;
            } catch (error) {
                // console.log(error);
                return []
            }
        },
        countProductPreOrder: async(_:unknown, obj:{id:string})=>{
            const {id} = obj;
            console.log(id);
            try {
                const preOrderCount = await ProductSchema.aggregate([
                    {
                        $match: {
                            "_id": id
                        }
                    },
                    {
                        $lookup: {
                            "from": 'preroders',
                            "localField": "_id",
                            "foreignField": "product_id",
                            "as": "precounts"
                        },
                    },
                    {
                        $project: {
                            product_name: 1,
                            preOrderCount: {"$ifNull": [{$size: '$preorder'}, 0]},
                            order_quantity: {$sum: '$quantity'}
                        }
                    }
                ]);
                console.log(preOrderCount);
                return preOrderCount;
            } catch (error) {
                console.log(error);
                return null
            }
        }
    },
    Mutation: {
        createProduct: async (_:unknown, {category_id, price, product_name, stock_quantity, description}:{product_name: string, category_id: number, price:number, stock_quantity:number, description?: string}) =>{
            const newPost = new ProductSchema({
                category_id,
                price,
                description,
                product_name,
                stock_quantity
            });
            const post = await newPost.save();
            return [];
        }
    }
}

export default resolvers;