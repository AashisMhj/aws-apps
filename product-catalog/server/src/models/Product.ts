import {Schema, ObjectId, model} from 'mongoose';

export const Product = new Schema({
    product_name: {
        type: String,
        required: true
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock_quantity: {
        type: Number,
        default: 0
    },
    description: {
        type: String
    }
})

const ProductSchema = model('product', Product);
export default ProductSchema;