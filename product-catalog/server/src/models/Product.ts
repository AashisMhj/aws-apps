import {Schema, model} from 'mongoose';

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
}, {timestamps: true})

const ProductSchema = model('product', Product);
export default ProductSchema;