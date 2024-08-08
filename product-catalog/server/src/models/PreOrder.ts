import { Schema, model } from "mongoose";

export const PreOrder = new Schema({
    user_name: {
        type: String,
        required: true
    },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },

},{timestamps: true});

const PreOrderSchema = model('preorders', PreOrder);
export default PreOrderSchema;